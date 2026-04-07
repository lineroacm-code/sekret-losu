import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // na start OK
      to: "lineroacm@gmail.com",
      subject: "Nowa wiadomość z formularza",
      html: `
        <p><strong>Imię:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Wiadomość:</strong><br/>${message}</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Błąd wysyłki" }, { status: 500 });
  }
}