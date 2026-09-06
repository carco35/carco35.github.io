import { NextRequest, NextResponse } from 'next/server';
import { plaidClient } from '@/lib/plaid';
import { getDb, newId, nowIso } from '@/lib/db';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function summarizeTransactions(transactions: Array<{ amount: number; date: string }>): string {
  const count = transactions.length;
  if (count === 0) {
    return 'Connected via Plaid Sandbox — no transactions found in the last 30 days of test data.';
  }

  const overdraftCount = transactions.filter((t) => t.amount < 0 && Math.abs(t.amount) > 500).length;
  const totalSpend = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const overdraftNote = overdraftCount === 0 ? 'no unusually large negative balances' : `${overdraftCount} unusually large outgoing transaction(s)`;

  return `${count} transactions over the last 30 days (sandbox test data). Roughly $${totalIncome.toFixed(
    0
  )} in deposits and $${totalSpend.toFixed(0)} in spending, ${overdraftNote}.`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id, public_token } = body;

  if (!profile_id || !public_token) {
    return NextResponse.json({ error: 'profile_id and public_token are required' }, { status: 400 });
  }

  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = exchangeResponse.data.access_token;
    const item_id = exchangeResponse.data.item_id;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);

    let transactions: Array<{ amount: number; date: string }> = [];
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const txResponse = await plaidClient.transactionsGet({
          access_token,
          start_date: fmt(startDate),
          end_date: fmt(endDate),
        });
        transactions = txResponse.data.transactions.map((t) => ({ amount: t.amount, date: t.date }));
        break;
      } catch (err: any) {
        const code = err?.response?.data?.error_code;
        if (code === 'PRODUCT_NOT_READY' && attempt < 2) {
          await sleep(1500);
          continue;
        }
        throw err;
      }
    }

    const summary = summarizeTransactions(transactions);

    getDb()
      .prepare(
        `INSERT INTO plaid_items (id, profile_id, access_token, item_id, transactions_summary, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(newId(), profile_id, access_token, item_id, summary, nowIso());

    return NextResponse.json({ connected: true, summary });
  } catch (err) {
    console.error('Plaid exchange-token error', err);
    return NextResponse.json({ error: 'Could not connect bank account' }, { status: 500 });
  }
}
