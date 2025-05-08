import https from 'https';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return new Response(JSON.stringify({ error: 'Match ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'cricbuzz-cricket.p.rapidapi.com',
      port: null,
      path: `/mcenter/v1/${matchId}/scard`,
      headers: {
        'x-rapidapi-key': '8bbcdaa891mshb3efc72ffc757a7p18f5abjsn01fe66602407',
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        try {
          const body = Buffer.concat(chunks).toString();
          resolve(new Response(body, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }));
        } catch (err) {
          reject(new Response(JSON.stringify({ error: 'Failed to parse API response' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Response(JSON.stringify({ error: 'Failed to fetch match data' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }));
    });

    req.end();
  });
}