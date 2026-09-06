import { NextRequest, NextResponse } from 'next/server';
import { CountryCode, Products } from 'plaid';
import { plaidClient } from '@/lib/plaid';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { profile_id } = body;

  if (!profile_id) {
    return NextResponse.json({ error: 'profile_id is required' }, { status: 400 });
  }

  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: profile_id },
      client_name: 'Builder Readiness Profile',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    });

    return NextResponse.json({ link_token: response.data.link_token });
  } catch (err) {
    console.error('Plaid create-link-token error', err);
    return NextResponse.json({ error: 'Could not create Plaid link token' }, { status: 500 });
  }
}
