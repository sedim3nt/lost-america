#!/usr/bin/env /opt/homebrew/bin/python3
"""
Re-fetch LOC images at higher resolution.
LOC search API provides thumbnail URLs — we need to hit the item API 
to get the full-size JPEG URL.
"""

import json
import os
import time
import urllib.request
import urllib.parse
from pathlib import Path
from PIL import Image

DATA = Path("data/images.json")
PHOTO_DIR = Path("public/photos")
MIN_WIDTH = 800  # Target minimum width

imgs = json.load(open(DATA))
print(f"Processing {len(imgs)} images...")

upgraded = 0
failed = 0

for i, img in enumerate(imgs):
    filepath = PHOTO_DIR / img["filename"]
    
    # Check current size
    if filepath.exists():
        try:
            im = Image.open(str(filepath))
            if im.width >= MIN_WIDTH:
                continue  # Already good
        except:
            pass
    
    # Try to get higher-res version from LOC item page
    loc_id = img.get("loc_id", "")
    if not loc_id:
        continue
    
    print(f"[{i+1}/{len(imgs)}] {img['title'][:50]}...", end=" ", flush=True)
    
    # Hit the LOC item API to get full image URLs
    try:
        item_url = f"{loc_id}?fo=json"
        if not item_url.startswith("http"):
            item_url = f"https://www.loc.gov{loc_id}?fo=json" if loc_id.startswith("/") else f"https://www.loc.gov/{loc_id}?fo=json"
        
        req = urllib.request.Request(item_url, headers={"User-Agent": "LostAmerica/1.0 (spirittree.dev)"})
        resp = urllib.request.urlopen(req, timeout=15)
        data = json.loads(resp.read())
        
        # Look for image resources
        item = data.get("item", data)
        resources = item.get("resources", []) or []
        image_url = None
        
        # Try to find a JPEG in resources
        for res in resources:
            files = res.get("files", [])
            for file_group in files:
                if isinstance(file_group, list):
                    for f in file_group:
                        url = f.get("url", "")
                        mimetype = f.get("mimetype", "")
                        size = f.get("size", 0)
                        if "image/jpeg" in mimetype and (not image_url or size > 50000):
                            # Get a reasonable size (not the 50MB TIFF)
                            if f.get("width", 0) >= 600 and f.get("width", 0) <= 4000:
                                image_url = url
                elif isinstance(file_group, dict):
                    url = file_group.get("url", "")
                    mimetype = file_group.get("mimetype", "")
                    if "image/jpeg" in mimetype:
                        if file_group.get("width", 0) >= 600:
                            image_url = url
        
        # Fallback: try modifying the thumbnail URL
        if not image_url:
            orig_url = img["image_url"]
            # Replace thumbnail suffixes with larger versions
            for suffix in ["t.gif", "t.jpg", "_150px.jpg"]:
                if suffix in orig_url:
                    # Try 'v.jpg' (medium) or 'r.jpg' (reference)
                    for replacement in ["v.jpg", "r.jpg"]:
                        test_url = orig_url.replace(suffix, replacement)
                        try:
                            req2 = urllib.request.Request(test_url, method="HEAD", headers={"User-Agent": "LostAmerica/1.0"})
                            resp2 = urllib.request.urlopen(req2, timeout=5)
                            if resp2.status == 200:
                                image_url = test_url
                                break
                        except:
                            continue
                    break
        
        if not image_url:
            print("❌ no hi-res")
            failed += 1
            time.sleep(0.5)
            continue
        
        # Download
        req3 = urllib.request.Request(image_url, headers={"User-Agent": "LostAmerica/1.0"})
        resp3 = urllib.request.urlopen(req3, timeout=30)
        data = resp3.read()
        
        if len(data) < 5000:
            print("❌ too small")
            failed += 1
            time.sleep(0.5)
            continue
        
        with open(str(filepath), "wb") as f:
            f.write(data)
        
        # Verify size
        im = Image.open(str(filepath))
        if im.width >= MIN_WIDTH:
            img["image_url"] = image_url  # Update URL
            upgraded += 1
            print(f"✅ {im.width}x{im.height}")
        else:
            print(f"⚠️ {im.width}x{im.height} (still small)")
            upgraded += 1
        
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        failed += 1
    
    time.sleep(1)

# Save updated manifest
json.dump(imgs, open(DATA, "w"), indent=2)
print(f"\nUpgraded: {upgraded}, Failed: {failed}")
