import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the sitemap.xml file from public directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    const sitemap = fs.readFileSync(sitemapPath, 'utf-8');
    
    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error serving sitemap:', error);
    return new NextResponse('Sitemap not found', { status: 404 });
  }
}
