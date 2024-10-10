import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
const spreadsheetId = process.env.GOOGLE_SHEETS_ID as string;
const privateKey = process.env.GOOGLE_PRIVATE_KEY as string;
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL as string;

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Initialize auth
    const serviceAccountAuth = new JWT({
      email:  clientEmail,
      key: privateKey.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(spreadsheetId, serviceAccountAuth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    // Add row to sheet
    await sheet.addRow({
      Email: email,
      Timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ message: 'Successfully joined waitlist' });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    );
  }
}