import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { suggestion } = await request.json();

        if (!suggestion) {
            return NextResponse.json({ error: 'Sugestão é obrigatória' }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from: 'Canivete Suíço <onboarding@resend.dev>',
            to: ['lucas.amaral.oliveira.silva@gmail.com'],
            subject: 'Nova Sugestão de Ferramenta - Canivete Suíço',
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #000;">Nova Sugestão Recebida!</h2>
          <p>Alguém enviou uma sugestão para o seu projeto <strong>Canivete Suíço</strong>:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="font-size: 16px; margin: 0;">${suggestion}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999;">Este é um e-mail automático enviado pela sua plataforma.</p>
        </div>
      `,
        });

        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (err) {
        console.error('Erro interno:', err);
        return NextResponse.json({ error: 'Erro interno ao processar a requisição' }, { status: 500 });
    }
}
