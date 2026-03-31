#!/usr/bin/env /opt/homebrew/bin/python3
"""
Fetch 1000 high-quality historical photographs from Library of Congress.
Searches across major American cities and eras.
Downloads medium-res JPEGs suitable for web display.
"""

import json
import os
import time
import urllib.request
import urllib.parse
from pathlib import Path

OUT_DIR = Path(__file__).parent.parent / "images" / "raw"
MANIFEST_PATH = Path(__file__).parent.parent / "data" / "images.json"
OUT_DIR.mkdir(parents=True, exist_ok=True)
MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)

# Search queries: city + era combinations for diverse coverage
QUERIES = [
    # Major cities
    ("new york", "1870-1930"), ("new york", "1930-1960"),
    ("chicago", "1870-1930"), ("chicago", "1930-1960"),
    ("san francisco", "1870-1930"), ("san francisco", "1930-1960"),
    ("boston", "1870-1930"), ("boston", "1930-1960"),
    ("philadelphia", "1870-1930"), ("philadelphia", "1930-1960"),
    ("denver", "1870-1930"), ("denver", "1930-1960"),
    ("los angeles", "1890-1940"), ("los angeles", "1940-1960"),
    ("washington dc", "1870-1930"), ("washington dc", "1930-1960"),
    ("detroit", "1900-1950"), ("new orleans", "1870-1940"),
    ("atlanta", "1870-1930"), ("seattle", "1890-1940"),
    ("st louis", "1870-1930"), ("pittsburgh", "1890-1940"),
    ("cleveland", "1890-1930"), ("baltimore", "1870-1930"),
    ("portland oregon", "1890-1930"), ("minneapolis", "1890-1930"),
    # Themes
    ("main street", "1890-1930"), ("horse carriage", "1870-1910"),
    ("factory workers", "1900-1940"), ("immigrants ellis island", "1890-1920"),
    ("dust bowl", "1930-1940"), ("great depression", "1929-1939"),
    ("prohibition", "1920-1933"), ("world war", "1914-1945"),
    ("railroad", "1860-1920"), ("gold rush", "1849-1900"),
    ("cowboys", "1870-1910"), ("native american", "1870-1930"),
    ("civil war", "1861-1865"), ("frontier", "1860-1900"),
    ("automobile", "1900-1930"), ("skyscraper construction", "1900-1940"),
    ("broadway", "1900-1940"), ("beach boardwalk", "1900-1950"),
    ("farm rural america", "1890-1940"), ("schoolchildren", "1890-1940"),
]

def search_loc(query, date_range, count=30):
    """Search Library of Congress photos."""
    params = urllib.parse.urlencode({
        "q": query,
        "dates": date_range,
        "fo": "json",
        "c": count,
        "fa": "online-format:image",
    })
    url = f"https://www.loc.gov/photos/?{params}"
    req = urllib.request.Request(url, headers={"User-Agent": "LostAmerica/1.0 (spirittree.dev)"})
    
    try:
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        results = []
        
        for item in data.get("results", []):
            title = item.get("title", "Untitled")
            date = item.get("date", "Unknown")
            loc_id = item.get("id", "")
            
            # Get image URLs
            image_urls = item.get("image_url", [])
            # Find a good resolution image (not the tiny thumbnail or SVG placeholder)
            img_url = None
            for url in image_urls:
                if isinstance(url, str) and "tile.loc.gov" in url and "150px" not in url:
                    # Try to get 1024px version
                    img_url = url.split("#")[0]
                    if "_150px" in img_url:
                        img_url = img_url.replace("_150px", "")
                    break
            
            # Also check for direct image link
            if not img_url:
                for url in image_urls:
                    if isinstance(url, str) and (".jpg" in url.lower() or ".tif" in url.lower()):
                        img_url = url.split("#")[0]
                        break
            
            if img_url and not img_url.endswith(".svg"):
                results.append({
                    "title": title,
                    "date": date,
                    "loc_id": loc_id,
                    "image_url": img_url,
                    "query": query,
                    "era": date_range,
                })
        
        return results
    except Exception as e:
        print(f"  Search error: {e}")
        return []


def download_image(url, dest_path):
    """Download image."""
    req = urllib.request.Request(url, headers={"User-Agent": "LostAmerica/1.0 (spirittree.dev)"})
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        content_type = resp.headers.get("Content-Type", "")
        if "image" not in content_type and "octet" not in content_type:
            return False
        
        data = resp.read()
        if len(data) < 5000:  # Skip tiny files (probably errors)
            return False
        
        with open(dest_path, "wb") as f:
            f.write(data)
        return True
    except Exception as e:
        return False


def main():
    all_images = []
    seen_urls = set()
    target = 1000
    
    # Load existing manifest if any
    if MANIFEST_PATH.exists():
        with open(MANIFEST_PATH) as f:
            existing = json.load(f)
            all_images = existing
            seen_urls = {img["image_url"] for img in existing}
            print(f"Resuming from {len(all_images)} existing images")
    
    print(f"Target: {target} images")
    print(f"Queries: {len(QUERIES)}")
    
    for qi, (query, era) in enumerate(QUERIES):
        if len(all_images) >= target:
            break
        
        remaining = target - len(all_images)
        fetch_count = min(30, remaining)
        
        print(f"[{qi+1}/{len(QUERIES)}] '{query}' ({era}) — need {remaining} more...", end=" ", flush=True)
        
        results = search_loc(query, era, count=fetch_count)
        
        new_count = 0
        for item in results:
            if len(all_images) >= target:
                break
            
            if item["image_url"] in seen_urls:
                continue
            
            # Generate filename
            slug = item["title"][:60].lower()
            slug = "".join(c if c.isalnum() or c == " " else "" for c in slug).strip().replace(" ", "-")
            filename = f"{len(all_images):04d}-{slug}.jpg"
            dest = OUT_DIR / filename
            
            if dest.exists():
                item["filename"] = filename
                item["local_path"] = f"images/raw/{filename}"
                all_images.append(item)
                seen_urls.add(item["image_url"])
                new_count += 1
                continue
            
            if download_image(item["image_url"], str(dest)):
                item["filename"] = filename
                item["local_path"] = f"images/raw/{filename}"
                all_images.append(item)
                seen_urls.add(item["image_url"])
                new_count += 1
            
            time.sleep(0.5)  # Be nice to LOC
        
        print(f"got {new_count}")
        
        # Save progress every query
        with open(MANIFEST_PATH, "w") as f:
            json.dump(all_images, f, indent=2)
        
        time.sleep(1)
    
    print(f"\nDone: {len(all_images)} images")
    print(f"Manifest: {MANIFEST_PATH}")


if __name__ == "__main__":
    main()
