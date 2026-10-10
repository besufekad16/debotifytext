import { NextResponse } from "next/server";
import { z } from "zod";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";

import { resend } from "~/lib/resend";

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
        from: 'onboarding@resend.dev', // Resend default testing address
        to: 'debotifytext@gmail.com', // Sent to admin email
        subject: `New Contact Message from ${payload.name}`,
        html: `
          <h3>New Contact Message</h3>
          <p><strong>Name:</strong> ${payload.name}</p>
          <p><strong>Email:</strong> ${userEmail ?? "No email provided"}</p>
          <p><strong>Message:</strong></p>
          <p>${payload.message}</p>
        `,
      });
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

