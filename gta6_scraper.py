import requests
from bs4 import BeautifulSoup
from datetime import datetime

def check_gta6_news():
    url = "https://www.rockstargames.com/newswire"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) GameBriefingBot/1.0'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print("Could not reach Rockstar Newswire.")
        return

    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Target Newswire article cards (Rockstar uses dynamic classes, adjust selectors as needed)
    articles = soup.find_all('div', class_='newswire-post') # Example container class
    
    for article in articles:
        title_el = article.find('h3')
        if not title_el:
            continue
            
        title = title_el.get_text(strip=True)
        
        # Filter strictly for GTA 6 related headlines
        if "gta vi" in title.lower() or "grand theft auto vi" in title.lower():
            link = article.find('a')['href']
            if not link.startswith('http'):
                link = "https://www.rockstargames.com" + link
                
            payload = {
                "game": "gta-6",
                "title": title,
                "sourceUrl": link,
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Send to your Fastify/Firebase ingestion endpoint
            # requests.post("https://api.gamebriefing.com.au/api/v1/webhook/ingest", json=payload)
            print(f"[GTA 6 DETECTED]: {title} -> {link}")

if __name__ == "__main__":
    check_gta6_news()