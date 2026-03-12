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

    const response = NextResponse.next();

    // Adicionar cabeçalhos de segurança em nível de Edge
    const securityHeaders = {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-XSS-Protection': '1; mode=block',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };

    Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    return response;
}

export const config = {
    matcher: '/:path*',
};
