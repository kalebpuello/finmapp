export const runtime = "nodejs"
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Reemplaza esto con tu API Key de Resend (gratis en resend.com)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email, code, username } = await req.json()

    const { data, error } = await resend.emails.send({
      from: 'Finmapp Security <onboarding@resend.dev>',
      to: [email],
      subject: `🛡️ Tu código de seguridad: ${code}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px;">
          <h2 style="color: #10b981; text-align: center;">Finmapp</h2>
          <p>Hola <strong>${username}</strong>,</p>
          <p>Has solicitado realizar una acción protegida. Ingresa el siguiente código en la aplicación para confirmar:</p>
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-radius: 15px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: 900; letter-spacing: 5px; color: #111827;">${code}</span>
          </div>
          <p style="font-size: 12px; color: #6b7280; text-align: center;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #9ca3af; text-align: center;">© 2026 Finmapp Security System</p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
