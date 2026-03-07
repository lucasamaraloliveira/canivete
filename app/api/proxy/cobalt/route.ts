import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { url, videoQuality = '720', audioOnly = false } = body;

        if (!url) {
            return NextResponse.json({ status: 'error', text: 'URL é obrigatória' }, { status: 400 });
        }

        console.log(`[PROXY REQUEST] Target URL: ${url} | Format: ${audioOnly ? 'Audio' : 'Video'}`);

        // Tenta usar ytdl-core diretamente para YouTube, que ignora as proteções do Cobalt (Turnstile)
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            try {
                console.log('[YTDL-CORE] Starting local extraction...');
                const ytdl = require('@distube/ytdl-core');

                // Opções configuradas para simular navegador
                const info = await ytdl.getInfo(url);

                // Escolher formato baseado na UI (Apenas Áudio ou Áudio + Vídeo)
                let format;
                if (audioOnly) {
                    format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
                } else {
                    // Tenta 'highest' (audio/video combo). O YouTube às vezes separa, e nesse caso baixar direto por link de navegador falha sem som.
                    // Para download direto no navegador (sem ffmpeg), precisamos de um formato que tenha AMBOS (hasVideo && hasAudio)
                    format = info.formats.find((f: any) => f.hasVideo && f.hasAudio && f.container === 'mp4') || ytdl.chooseFormat(info.formats, { quality: 'highest' });
                }

                if (format && format.url) {
                    console.log(`[YTDL-CORE SUCCESS] Found raw URL for: ${info.videoDetails.title}`);
                    return NextResponse.json({
                        status: 'tunnel', // Simulando o status do Cobalt para compatibilidade com o Frontend
                        url: format.url,
                        filename: info.videoDetails.title.replace(/[^a-zA-Z0-9 -]/g, '')
                    });
                }
            } catch (ytdlError: any) {
                console.warn(`[YTDL-CORE FAIL] ${ytdlError.message}`);
                // Se falhar, continua e tenta jogar pras instâncias do Cobalt
            }
        }

        // Instâncias verificadas como estáveis em Março/2026
        const instances = [
            { url: 'https://cobalt-api.meowing.de', version: 10 },
            { url: 'https://cobalt-backend.canine.tools', version: 10 },
            { url: 'https://capi.3kh0.net', version: 10 },
            { url: 'https://cobalt-api.m0e.dev', version: 10 }
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
                        'User-Agent': 'Canivete/1.0 (YouTube-Worker; +https://canivete.tools)',
                        'Referer': meta.url,
                        'Origin': meta.url
                    },
                    body: JSON.stringify({
                        url,
                        videoQuality,
                        isAudioOnly: audioOnly,
                        downloadMode: 'tunnel'
                    }),
                    signal: AbortSignal.timeout(15000)
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
        }, { status: 200 }); // Retornamos 200 para que a mensagem amigável chegue ao UI sem disparar erro de rede
    } catch (error: any) {
        console.error('[COBALT PROXY FATAL ERROR]:', error);
        return NextResponse.json({ status: 'error', text: 'Erro ao processar requisição.' }, { status: 200 });
    }
}
