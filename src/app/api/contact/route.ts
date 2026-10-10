import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";

import { resend } from "~/lib/resend";
import { getAdminContactNotificationHtml, getContactConfirmationHtml } from "~/lib/email-templates";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().min(2, "Please provide your name.").max(120),
  // email is derived from the authenticated user; ignore any client-provided value
  message: z
    .string()
    .min(10, "Tell us a little more about how we can help.")
    .max(4000),
});

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress ?? undefined;

    const body = await request.json();
    const payload = contactSchema.parse(body);

    await db.contactMessage.create({
      data: {
        name: payload.name,
        email: userEmail ?? "",
        message: payload.message,
      },
    });

    // Send notification email to the support team
    try {
      await resend.emails.send({
        from: 'DebotifyText Support <support@debotifytext.com>', 
        to: 'debotifytext@gmail.com', // Sent to admin email
        replyTo: userEmail,
        subject: `New Contact Message from ${payload.name}`,
        html: getAdminContactNotificationHtml(payload.name, userEmail ?? "No email provided", payload.message),
      });

      // Send automated confirmation email to the user
      if (userEmail) {
        await resend.emails.send({
          from: 'DebotifyText <support@debotifytext.com>',
          to: userEmail,
          subject: 'We received your message - DebotifyText',
          html: getContactConfirmationHtml(payload.name),
        });
      }
    } catch (emailError) {
      console.error("[RESEND_ERROR]", emailError);
      // We don't fail the overall request if the email fails to send
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.flatten() }, { status: 400 });
    }

    console.error("[CONTACT_API]", error);
    return NextResponse.json({ success: false, error: "Unable to save your message right now." }, { status: 500 });
  }
}

