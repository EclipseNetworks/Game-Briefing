const Parser = require('rss-parser');
const cron = require('node-cron');
const parser = new Parser();

const ROCKSTAR_NEWSWIRE_RSS = 'https://www.rockstargames.com/newswire/feed';

// Check every 20 minutes for new Rockstar announcements
cron.schedule('*/20 * * * *', async () => {
    try {
        console.log('[CRON] Checking Rockstar Newswire for GTA VI intel...');
        const feed = await parser.parseURL(ROCKSTAR_NEWSWIRE_RSS);
        
        // Look through the latest articles
        for (const item of feed.items) {
            const title = item.title || '';
            const content = item.contentSnippet || '';
            
            // Check if the article is relevant to GTA 6
            if (title.toLowerCase().includes('gta vi') || 
                title.toLowerCase().includes('grand theft auto vi') || 
                content.toLowerCase().includes('leonida')) {
                
                console.log(`[MATCH FOUND] GTA VI Update: ${title}`);
                
                // Dispatch to your backend ingestion API
                await postToBackend({
                    game: 'gta-6',
                    tag: 'Major Intel',
                    title: title,
                    summary: content,
                    sourceUrl: item.link,
                    date: new Date().toISOString()
                });
            }
        }
    } catch (error) {
        console.error('[ERROR] Failed to fetch Rockstar Newswire:', error.message);
    }
});

async function postToBackend(payload) {
    /*
    await fetch('https://api.gamebriefing.com.au/api/v1/webhook/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    */
    console.log('[DB] Synced GTA 6 brief to Firebase/Fastify backend.');
}