import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json({ status: 'error', text: 'URL é obrigatória' }, { status: 400 });
        }

        console.log(`[COBALT PROXY REQUEST] Target URL: ${url}`);

        // Lista de instâncias priorizando as conhecidas por serem mais 'abertas' em 2025
        const instances = [
            { url: 'https://downloadapi.stuff.solutions', version: 7 }, // Confirmada sem Turnstile
            { url: 'https://cobalt-api.meowing.de', version: 10 },    // Alta saúde, mas pode pedir JWT
            { url: 'https://capi.3kh0.net', version: 10 },
            { url: 'https://kityune.imput.net', version: 10 }
        ];

        let lastErrorInfo = 'Nenhuma resposta válida recebida.';

        for (const meta of instances) {
            const endpoint = meta.version === 7 ? `${meta.url}/api/json` : meta.url;

            try {
                console.log(`[COBALT PROXY TRY] Instance: ${meta.url} (v${meta.version})`);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                    },
                    body: JSON.stringify({
                        url,
                        videoQuality: '720'
                    }),
                    signal: AbortSignal.timeout(10000)
                });

                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.warn(`[COBALT PROXY FAIL] JSON Parse error from ${meta.url}`);
                    continue;
                }

                // Se a instância responder com sucesso ou um redirecionamento válido
                if (response.ok && data.status !== 'error') {
                    console.log(`[COBALT PROXY SUCCESS] Instance: ${meta.url}`);
                    return NextResponse.json(data);
                }

                // Se cair aqui, a instância respondeu com erro (ex: JWT missing ou Video too long)
                const errorDetail = data.text || data.error?.code || 'Erro desconhecido';
                console.warn(`[COBALT PROXY FAIL] Instance ${meta.url} returned: ${errorDetail}`);

                // Se o erro for JWT missing, sabemos que não adianta tentar de novo nesta instância via servidor
                if (errorDetail.includes('jwt') || errorDetail.includes('auth')) {
                    lastErrorInfo = 'Esta instância requer autenticação (bot-protection).';
                } else {
                    lastErrorInfo = errorDetail;
                }

            } catch (e: any) {
                console.warn(`[COBALT PROXY NETWORK ERROR] ${meta.url}: ${e.message}`);
                lastErrorInfo = `Falha de conexão: ${e.message}`;
            }
        }

        return NextResponse.json({
            status: 'error',
            text: `Não foi possível extrair o vídeo. Motivo: ${lastErrorInfo}. Link pode ser privado ou o serviço está sob alta carga.`
        }, { status: 500 });
    } catch (error: any) {
        console.error('[COBALT PROXY FATAL ERROR]:', error);
        return NextResponse.json({ status: 'error', text: 'Erro ao processar requisição.' }, { status: 500 });
    }
}
