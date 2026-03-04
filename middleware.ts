import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista básica de User-Agents de bots/scrapers comuns para bloquear
const BLOCKED_BOTS = [
    'HTTrack',
    'Wget',
    'Scrapy',
    'Curl',
    'Python-urllib',
    'PostmanRuntime',
    'HeadlessChrome',
    'Puppeteer',
    'AhrefsBot',
    'SemrushBot',
];

export function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';

    // Bloquear se o User-Agent contiver algum dos bots listados
    const isBot = BLOCKED_BOTS.some(bot => userAgent.includes(bot));

    if (isBot) {
        return new NextResponse(
            JSON.stringify({ error: 'Access Denied: Automated access is not allowed.' }),
            { status: 403, headers: { 'content-type': 'application/json' } }
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
