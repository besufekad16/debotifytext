import { Webhook } from 'svix'
import { headers } from 'next/headers'
import type { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '~/server/db'
import { env } from '~/env'
import { resend } from '~/lib/resend'
import { getWelcomeEmailHtml } from '~/lib/email-templates'

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET || '')

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data

    try {
      // Create user in database
      await db.user.create({
        data: {
          clerkId: id,
          email: email_addresses[0]?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || username || 'User',
          emailVerified: email_addresses[0]?.verification?.status === 'verified',
          image: image_url,
        },
      })

      console.log(`User created: ${id}`)

      // Send welcome email
      const userEmailAddress = email_addresses[0]?.email_address;
      if (userEmailAddress) {
        try {
          const name = `${first_name || ''} ${last_name || ''}`.trim() || username || 'User';
          await resend.emails.send({
            from: 'DebotifyText <hello@debotifytext.com>',
            to: userEmailAddress,
            subject: 'Welcome to DebotifyText! 🎉',
            html: getWelcomeEmailHtml(name),
          });
          console.log(`Welcome email sent to ${userEmailAddress}`);
        } catch (emailError) {
          console.error('Failed to send welcome email:', emailError);
          // Don't fail the webhook if email fails
        }
      }
    } catch (error) {
      console.error('Error creating user:', error)
      return new Response('Error creating user', { status: 500 })
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url, username } = evt.data

    try {
      // Update user in database
      await db.user.update({
        where: { clerkId: id },
        data: {
          email: email_addresses[0]?.email_address || '',
          name: `${first_name || ''} ${last_name || ''}`.trim() || username || 'User',
          emailVerified: email_addresses[0]?.verification?.status === 'verified',
          image: image_url,
        },
      })

      console.log(`User updated: ${id}`)
    } catch (error) {
      console.error('Error updating user:', error)
      // Don't fail if user doesn't exist
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    try {
      // Delete user from database
      await db.user.delete({
        where: { clerkId: id || '' },
      })

      console.log(`User deleted: ${id}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      // Don't fail if user doesn't exist
    }
  }

  return new Response('', { status: 200 })
}
