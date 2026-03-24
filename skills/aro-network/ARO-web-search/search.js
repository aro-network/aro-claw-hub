#!/usr/bin/env node
/**
 * SearX Search Tool for OpenClaw
 * Zero dependencies - only uses Node.js built-in modules
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// ============================================
// DEFAULT CONFIGURATION
// ============================================
const DEFAULT_SEARX_URL = 'https://sear-api.aro.network';
// Override via: ~/.openclaw/openclaw.json -> skills.searx.url
// Or: SEARX_URL env var
// Or: --url command line arg
// ============================================

function loadConfig() {
  // Priority: env var > config file > default
  if (process.env.SEARX_URL) {
    return process.env.SEARX_URL;
  }
  
  // Try to read from OpenClaw config
  const configPaths = [
    path.join(process.env.HOME || process.env.USERPROFILE, '.openclaw', 'openclaw.json'),
    path.join(process.cwd(), '.openclaw.json')
  ];
  
  for (const configPath of configPaths) {
    try {
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.skills?.searx?.url) {
          return config.skills.searx.url;
        }
      }
    } catch (e) {
      // Ignore config read errors
    }
  }
  
  return DEFAULT_SEARX_URL;
}

function fetchJson(urlString) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: 'GET',
      headers: {
        'User-Agent': 'OpenClaw-Searx-Skill/1.0 (Node.js)',
        'Accept': 'application/json'
      },
      timeout: 30000
    };
    
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON response: ${e.message}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

function parseResults(data) {
  if (!data.results || !Array.isArray(data.results)) {
    return [];
  }
  
  return data.results
    .map(r => ({
      title: (r.title || '').trim(),
      url: r.url || '',
      snippet: (r.content || '').trim(),
      engine: r.engine || '',
      score: r.score || 0
    }))
    .filter(r => r.title && r.url)
    .sort((a, b) => b.score - a.score);
}

function formatOutput(results, asJson = false) {
  if (asJson) {
    return JSON.stringify(results, null, 2);
  }
  
  if (results.length === 0) {
    return 'No results found.';
  }
  
  const lines = [];
  for (let i = 0; i < Math.min(results.length, 10); i++) {
    const r = results[i];
    lines.push(`[${i + 1}] ${r.title}`);
    lines.push(`    URL: ${r.url}`);
    
    if (r.snippet) {
      let snippet = r.snippet.replace(/\n/g, ' ').substring(0, 200);
      if (r.snippet.length > 200) {
        snippet += '...';
      }
      lines.push(`    ${snippet}`);
    }
    
    if (r.engine) {
      lines.push(`    [via ${r.engine}]`);
    }
    
    lines.push('');
  }
  
  return lines.join('\n');
}

function showHelp() {
  console.log(`
SearX Search Tool for OpenClaw

Usage: node search.js [options] <query>

Options:
  --url <url>       SearX endpoint (default: ${DEFAULT_SEARX_URL})
  --time <range>    Time filter: day, week, month, year
  --json            Output as JSON
  --limit <n>       Max results (default: 10)
  --help            Show this help

Examples:
  node search.js "openclaw features"
  node search.js "AI news" --time=week
  node search.js "query" --json --limit=5
  
Configuration:
  Set SEARX_URL env var or define in ~/.openclaw/openclaw.json:
  {"skills": {"searx": {"url": "http://127.0.0.1:8888"}}}
`);
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    process.exit(0);
  }
  
  // Parse arguments
  let query = '';
  let customUrl = null;
  let timeRange = null;
  let asJson = false;
  let limit = 10;
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--url' && i + 1 < args.length) {
      customUrl = args[++i];
    } else if (arg === '--time' && i + 1 < args.length) {
      timeRange = args[++i];
    } else if (arg === '--json') {
      asJson = true;
    } else if (arg === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[++i], 10) || 10;
    } else if (!arg.startsWith('--')) {
      query = arg;
    }
  }
  
  if (!query) {
    console.error('Error: No search query provided');
    showHelp();
    process.exit(1);
  }
  
  const baseUrl = customUrl || loadConfig();
  
  // Build URL
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    language: 'en-US'
  });
  
  if (timeRange) {
    params.set('time_range', timeRange);
  }
  
  const searchUrl = `${baseUrl}/search?${params.toString()}`;
  
  try {
    const data = await fetchJson(searchUrl);
    const results = parseResults(data).slice(0, limit);
    console.log(formatOutput(results, asJson));
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      console.error(`Error: Cannot connect to SearX at ${baseUrl}`);
      console.error('\nMake sure:');
      console.error('  1. SearX is running');
      console.error('  2. The URL is correct');
      console.error(`\nCurrent URL: ${baseUrl}`);
      console.error('Set SEARX_URL env var or use --url to specify a different endpoint');
    } else if (err.message.includes('timeout')) {
      console.error('Error: Request timed out. SearX may be slow or unreachable.');
    } else {
      console.error(`Error: ${err.message}`);
    }
    process.exit(1);
  }
}

main();
