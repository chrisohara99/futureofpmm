#!/usr/bin/env python3
"""Add textbook PDF download links to each curriculum chapter page."""
import re
from pathlib import Path

curriculum_dir = Path("/root/.openclaw/workspace/futureofpmm/dist/curriculum")

# Sequential mapping: curriculum chapter → textbook PDF
chapter_map = {
    "01": "introduction",
    "02": "chapter-01",
    "03": "chapter-02",
    "04": "chapter-03",
    "05": "chapter-04",
    "06": "chapter-05",
    "07": "chapter-06",
    "08": "chapter-07",
    "09": "chapter-08",
    "10": "chapter-09",
    "11": "chapter-10",
    "12": "chapter-11",
    "13": "chapter-12",
}

# New textbook download button HTML
textbook_btn = '''<a href="../textbook/{pdf_name}-full.pdf" class="download-btn" download>
        <span class="icon">📚</span>
        <span class="info">
          <span class="label">Download</span>
          <br>Textbook Chapter
        </span>
      </a>'''

updated = 0
for chapter_num, pdf_name in chapter_map.items():
    chapter_dir = curriculum_dir / f"chapter-{chapter_num}"
    index_file = chapter_dir / "index.html"
    
    if not index_file.exists():
        print(f"Skipping {chapter_num}: file not found")
        continue
    
    content = index_file.read_text()
    
    # Check if textbook link already exists
    if "Textbook Chapter" in content:
        print(f"Chapter {chapter_num}: already has textbook link")
        continue
    
    # Find the downloads div and add the textbook button after the existing buttons
    # Look for the pattern: download-btn...Whitepaper</span></a> followed by </div>
    pattern = r'(Whitepaper\s*</span>\s*</a>)\s*(</div>\s*<!-- Downloads -->|</div>\s*\n\s*\n\s*<!--)'
    
    btn = textbook_btn.format(pdf_name=pdf_name)
    replacement = r'\1\n      ' + btn + r'\n    \2'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    if new_content != content:
        index_file.write_text(new_content)
        print(f"Chapter {chapter_num}: added textbook link ({pdf_name}-full.pdf)")
        updated += 1
    else:
        # Try alternate pattern - simpler approach
        # Just find </div> that closes downloads
        old_downloads = re.search(r'<div class="downloads">.*?</div>', content, re.DOTALL)
        if old_downloads:
            old_div = old_downloads.group(0)
            # Check it has download-btn but not textbook
            if 'download-btn' in old_div and 'Textbook' not in old_div:
                # Insert before closing </div>
                new_div = old_div[:-6] + btn + '\n    </div>'
                new_content = content.replace(old_div, new_div)
                index_file.write_text(new_content)
                print(f"Chapter {chapter_num}: added textbook link ({pdf_name}-full.pdf) [alt]")
                updated += 1
            else:
                print(f"Chapter {chapter_num}: downloads div issue")
        else:
            print(f"Chapter {chapter_num}: no downloads div found")

print(f"\nUpdated {updated} files")
