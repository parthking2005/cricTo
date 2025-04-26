

import { NextResponse } from 'next/server';
import https from 'https';
import redis from '@/lib/redis'; // make sure this path is correct

export async function GET() {
  const cacheKey = 'cricbuzz-recent-matches';

  try {
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Fetch from API
    const data = await fetchCricketData();
    if (!data) throw new Error('No data received from API');

    // Calculate seconds until midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // next day's midnight
    const secondsUntilMidnight = Math.floor((midnight.getTime() - now.getTime()) / 1000);

    // Store in Redis with TTL
    await redis.set(cacheKey, JSON.stringify(data), 'EX', secondsUntilMidnight);

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

function fetchCricketData(): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'cricbuzz-cricket.p.rapidapi.com',
      port: null,
      path: '/matches/v1/recent',
      headers: {
        'x-rapidapi-key': '8bbcdaa891mshb3efc72ffc757a7p18f5abjsn01fe66602407',
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com',
      },
    };

    const req = https.request(options, (res) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(new Error('Failed to parse API response as JSON'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}
