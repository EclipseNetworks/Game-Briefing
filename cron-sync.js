const Parser = require('rss-parser');
const cron = require('node-cron');
const parser = new Parser();

// Example official or aggregated RSS feeds for Fortnite / Gaming News
const FEEDS = [
    { game: 'fortnite', url: 'https://www.epicgames.com/fortnite/en-US/news/rss' },
    // Add other game RSS feeds or custom endpoints here
];

// Run every 30 minutes
cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Checking for new game updates and briefings...');

    for (const feedConfig of FEEDS) {
        try {
            const feed = await parser.parseURL(feedConfig.url);
            
            // Grab the latest item from the feed
            const latestItem = feed.items[0];
            
            console.log(`[SYNC] Latest from ${feedConfig.game}: ${latestItem.title}`);

            // Send payload to your Fastify / Firebase backend ingestion endpoint
            await sendToBackend({
                game: feedConfig.game,
                title: latestItem.title,
                summary: latestItem.contentSnippet || latestItem.summary,
                sourceUrl: latestItem.link,
                date: new Date().toISOString()
            });

        } catch (error) {
            console.error(`[ERROR] Failed to sync feed for ${feedConfig.game}:`, error.message);
        }
    }
});

async function sendToBackend(payload) {
    // Example fetch call to your Fastify backend API
    /*
    await fetch('https://api.gamebriefing.com.au/api/v1/webhook/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    */
    console.log('[DB] Dispatched to Firebase ingestion pipeline:', payload.title);
}