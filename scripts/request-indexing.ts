/**
 * Google Indexing API - Automated URL Indexing Request
 * 
 * This script uses the Google Indexing API to request indexing for priority pages.
 * 
 * SETUP REQUIRED:
 * 1. Create a Google Cloud Project
 * 2. Enable the Indexing API
 * 3. Create a Service Account
 * 4. Download the service account JSON key
 * 5. Add service account email to Search Console (as Owner)
 * 6. Set GOOGLE_SERVICE_ACCOUNT_KEY in .env
 * 
 * USAGE:
 * npm run indexing:request
 * 
 * RATE LIMITS:
 * - 200 requests per day per project
 * - 600 requests per minute
 */

import { google } from 'googleapis';

const SITE_URL = 'https://www.humanifylab.com';

// Priority pages to request indexing for
const PRIORITY_URLS = [
  '/',       