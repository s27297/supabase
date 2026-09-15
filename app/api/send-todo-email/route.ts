import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { auth, currentUser } from '@clerk/nextjs/server'

const resend = new Resend(process.env.RESEND_API_KEY)

function escapeHtml(str: string) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
    console.log("start sending")
    const { userId } = await auth()
    console.log(req.body)
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()

    if (!name) {
        return NextResponse.json({ error: 'Missing todo name' }, { status: 400 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses[0]?.emailAddress

    if (!email) {
        return NextResponse.json({ error: 'No email on file for user' }, { status: 400 })
    }

    const date = new Date().toLocaleString()

    const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0; background-color:#f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
          <tr>
            <td align="center">
              <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; box-shadow:0 1px 3px rgba(0,0,0,0.08); overflow:hidden;">
                <tr>
                  <td style="background:#6366f1; padding:24px 32px;">
                    <span style="color:#ffffff; font-size:18px; font-weight:700;">Todo App</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <h1 style="margin:0 0 12px; font-size:20px; color:#111827;">New todo created</h1>
                    <p style="margin:0 0 20px; font-size:15px; line-height:1.6; color:#374151;">
                      You created todo <strong style="color:#111827;">"${escapeHtml(name)}"</strong> at
                      <strong style="color:#111827;">${date}</strong>.
                    </p>
                    <p style="margin:0; font-size:13px; color:#9ca3af;">
                      This is an automated notification from your Todo App.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `

    const { data, error } = await resend.emails.send({
        from: 'Todo App <onboarding@resend.dev>',
        to: [email],
        subject: 'New todo created',
        html,
    })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
}