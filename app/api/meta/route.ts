import { NextResponse } from 'next/server';

// Mock database in memory (will reset on server restart)
let metaData = {
    current: 10,
    goal: 100,
    lastUpdate: new Date().toISOString(),
    supporters: [
        { name: 'Lucas Amaral', amount: 5, date: '2026-03-01T10:00:00Z', message: 'Idealizador 🚀', receiptId: 'INIT-001' },
        { name: 'Kelbis Vieira', amount: 5, date: '2026-03-01T11:00:00Z', message: 'Contribuinte Pioneiro', receiptId: 'INIT-002' }
    ]
};

export async function GET() {
    return NextResponse.json(metaData);
}

export async function POST(request: Request) {
    try {
        const { amount, name, message, receiptId } = await request.json();

        if (typeof amount !== 'number') {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Update progress
        metaData.current += amount;
        metaData.lastUpdate = new Date().toISOString();

        // Track supporter
        if (name) {
            metaData.supporters.unshift({
                name,
                amount,
                date: new Date().toISOString(),
                message: message || '',
                receiptId: receiptId || `E2E${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            });

            // Limit to last 50 supporters in memory
            if (metaData.supporters.length > 50) metaData.supporters.pop();
        }

        return NextResponse.json(metaData);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process' }, { status: 500 });
    }
}
