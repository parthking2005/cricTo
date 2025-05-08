import { NextResponse } from 'next/server';
import https from 'https';
import redis from '@/lib/redis';

export async function GET() {
  const cacheKey = 'cricbuzz-series-list';

  try {
    // Check cache
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    // Fetch from API
    const data = await fetchSeriesData();
    if (!data) throw new Error('No data received from API');

    // Calculate seconds until midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const secondsUntilMidnight = Math.floor((midnight.getTime() - now.getTime()) / 1000);

    // Store in Redis with TTL
    await redis.set(cacheKey, JSON.stringify(data), 'EX', secondsUntilMidnight);

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

function fetchSeriesData(): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'cricbuzz-cricket.p.rapidapi.com',
      port: null,
      path: '/series/v1/international',
      headers: {
        'x-rapidapi-key': '8bbcdaa891mshb3efc72ffc757a7p18f5abjsn01fe66602407',
        'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };

    const req = https.request(options, (res: any) => {
      const chunks: Buffer[] = [];

      res.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          const data = JSON.parse(body.toString());
          resolve(data);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error: Error) => {
      reject(error);
    });

    req.end();
  });
}
