# Project Context for Claude

## CRITICAL: Always Verify These Work
Before committing ANY changes, verify:
1. **Hero Image Visible**: The Hollywoo background image MUST be visible
2. **Data Loading**: The Fantasy Pros table MUST show data
3. **Mobile Access**: App must work on `http://[local-ip]:5173`

### Quick Verification Commands
```bash
# Test hero image visibility
npx playwright test tests/hero-visibility.spec.ts:4

# Check if data loads (look for console logs)
curl http://localhost:5173 

# Verify images exist
ls -la public/images/
```

## Design Philosophy
- Minimal, lean, unopinionated interface
- Professional, maintainable codebase
- Clean data visualization without unnecessary flourish
- Mobile-first development

## Current Implementation

### Hero Section
- Full-screen Hollywoo background (`/images/hollywoo.png`)
- PB Livin Sonic character overlay (`/images/pblivin.png`)
- Text: "Fantasy Football 2025" (static, bold, white)
- Subtext: "PB Livin' is going back to" (with bouncing "back to")

### Data Section
- Fantasy Pros data widget with WR/RB tabs
- Season Totals / Per Game toggle
- Expandable table (5 rows → 20 rows)

## Data Sources

### Fantasy Pros Data (New)
- Location: `/public/data/FantasyPros_*.csv`
- Format: WR/RB, 2022-2024, Totals/Per_Game
- Columns: Rank, Player, G, REC, YDS, TGT, etc.

### Pro Football Reference Data (Legacy)
- Location: `/public/data/pff-nfl-*.csv`
- Format: receiving/rushing/passing, regular/playoff

## Common Issues & Fixes

### Image Not Showing
- Check vite.config.ts base path (should be '/' for dev)
- Verify image exists: `ls public/images/`
- Check image path in component (should be `/images/filename`)

### Data Not Loading
- Check CSV column names (case sensitive!)
- Fantasy Pros uses uppercase: YDS, TGT, REC
- PFR uses mixed case: Yds, Tgt, Rec
- Add console.log to debug data parsing

## Tech Stack
- React with TypeScript
- Tailwind CSS for styling
- Vite for build tooling
- Papa Parse for CSV processing
- Playwright for testing

## Development Guidelines
- Always test on mobile via network IP
- Run Playwright tests before major changes
- Keep animations subtle and performant
- Verify both image and data visibility after changes