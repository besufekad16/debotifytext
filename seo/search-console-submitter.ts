/**
 * Google Search Console Sitemap Submission Script
 * Automates sitemap submission via Search Console API
 * 
 * SETUP REQUIRED:
 * 1. Install: npm install googleapis
 * 2. Follow setup guide in SEARCH_CONSOLE_SETUP.md
 * 3. Add GOOGLE_SERVICE_ACCOUNT_KEY to .env
 * 4. Run: npm run seo:submit-sitemap
 * 
 * RECOMMENDED: Manual submission is easier!
 * Just go to Search Console and submit sitemap.xml manually.
 */

import { google } from 'googleapis';

const SITE_URL = 'https://www.debotifytext.com/';
const SITEMAP_URL = 'https://www.debotifytext.com/sitemap.xml';

interface SubmissionResult {
  success: boolean;
  message: string;
  timestamp: string;
}

export async function submitSitemapToSearchConsole(): Promise<SubmissionResult> {
  try {
    console.log('🔐 Authenticating with Google Search Console...\n');

    // Load service account credentials
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set\n');
      console.log('📖 Setup Instructions:');
      console.log('   1. Read SEARCH_CONSOLE_SETUP.md for detailed setup');
      console.log('   2. Or submit sitemap manually in Search Console (easier!)\n');
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
    }

    const credentials = JSON.parse(serviceAccountKey);

    // Create JWT client
    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });

    // Initialize Search Console API
    const searchconsole = google.searchconsole({
      version: 'v1',
      auth,
    });

    console.log('📤 Submitting sitemap to Search Console...');
    console.log(`   Site: ${SITE_URL}`);
    console.log(`   Sitemap: ${SITEMAP_URL}\n`);

    // Submit sitemap
    await searchconsole.sitemaps.submit({
      siteUrl: SITE_URL,
      feedpath: SITEMAP_URL,
    });

    const result: SubmissionResult = {
      success: true,
      message: 'Sitemap submitted successfully',
      timestamp: new Date().toISOString(),
    };

    console.log('✅ Sitemap submitted successfully!');
    console.log(`   Timestamp: ${result.timestamp}\n`);

    // Get sitemap status
    console.log('📊 Fetching sitemap status...\n');
    const status = await searchconsole.sitemaps.get({
      siteUrl: SITE_URL,
      feedpath: SITEMAP_URL,
    });

    if (status.data) {
      console.log('Sitemap Status:');
      console.log(`   Path: ${status.data.path}`);
      console.log(`   Last submitted: ${status.data.lastSubmitted || 'N/A'}`);
      console.log(`   Last downloaded: ${status.data.lastDownloaded || 'N/A'}`);
      console.log(`   Warnings: ${status.data.warnings || 0}`);
      console.log(`   Errors: ${status.data.errors || 0}\n`);
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Error submitting sitemap:', errorMessage);
    console.log('\n💡 TIP: Manual submission is easier!');
    console.log('   1. Go to https://search.google.com/search-console');
    console.log('   2. Click "Sitemaps"');
    console.log('   3. Enter: sitemap.xml');
    console.log('   4. Click "Submit"\n');

    return {
      success: false,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Request indexing for priority URLs
 * Uses Indexing API for immediate indexing requests
 * 
 * NOTE: This is optional. Google will crawl pages naturally from sitemap.
 */
export async function requestIndexing(urls: string[]): Promise<void> {
  try {
    console.log(`🔍 Requesting indexing for ${urls.length} URLs...\n`);

    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set');
    }

    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const indexing = google.indexing({
      version: 'v3',
      auth,
    });

    // Request indexing for each URL (with rate limiting)
    let successCount = 0;
    let failCount = 0;

    for (const url of urls) {
      try {
        await indexing.urlNotifications.publish({
          requestBody: {
            url,
            type: 'URL_UPDATED',
          },
        });
        console.log(`✓ Requested indexing: ${url}`);
        successCount++;
        
        // Rate limit: 200 requests per minute
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (error) {
        console.error(`✗ Failed: ${url}`);
        failCount++;
      }
    }

    console.log(`\n✅ Indexing requests completed!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}\n`);
  } catch (error) {
    console.error('❌ Error requesting indexing:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  console.log('🚀 Google Search Console Sitemap Submitter\n');
  console.log('═══════════════════════════════════════════\n');
  
  submitSitemapToSearchConsole()
    .then((result) => {
      if (result.success) {
        console.log('🎉 All done! Your sitemap has been submitted.\n');
        console.log('📊 Monitor indexing progress in Search Console:');
        console.log('   https://search.google.com/search-console\n');
      } else {
        console.log('⚠️  Submission failed. See error above.\n');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}
