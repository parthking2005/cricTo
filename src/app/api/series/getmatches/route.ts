import { NextResponse } from 'next/server';
import https from 'https';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const seriesId = searchParams.get('seriesId');

	if (!seriesId) {
		return NextResponse.json({ error: 'Series ID is required' }, { status: 400 });
	}

	try {
		const data = await fetchSeriesMatches(seriesId);
		if (!data) {
			return NextResponse.json({ error: 'No data received from API' }, { status: 404 });
		}
		return NextResponse.json(data);
	} catch (err) {
		console.error('API error:', err);
		return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
	}
}

function fetchSeriesMatches(seriesId: string): Promise<any> {
	return new Promise((resolve, reject) => {
		const options = {
			method: 'GET',
			hostname: 'cricbuzz-cricket.p.rapidapi.com',
			port: null,
			path: `/series/v1/${seriesId}`,
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