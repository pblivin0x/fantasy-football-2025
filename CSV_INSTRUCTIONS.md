# How to Add the Full NFL Receiving Data

## Option 1: Save CSV File Directly (Recommended)

1. Copy your complete CSV data with all players
2. Save it as: `public/data/nfl-receiving-2024-full.csv`
3. The app will automatically load it when you refresh the page

## Option 2: Upload via the Interface

1. Open the app at http://localhost:5173/
2. Click the "Upload Full CSV Data" button
3. Select your CSV file
4. The data will load immediately

## CSV Format Required

The CSV should have these column headers (exactly as shown):
```
Rk,Player,Age,Team,Pos,G,GS,Tgt,Rec,Yds,Y/R,TD,1D,Succ%,Lng,R/G,Y/G,Ctch%,Y/Tgt,Fmb,Awards,PlayerID
```

Example row:
```
1,Ja'Marr Chase,24,CIN,WR,17,16,175,127,1708,13.4,17,75,62.3,70,7.5,100.5,72.6,9.8,0,PBAP-1AP MVP-8AP OPoY-3,ChasJa00
```

## Features Available Once Data is Loaded

- Sort by any column (click headers)
- Filter by position (WR, TE, RB, etc.)
- Search by player or team name
- Set minimum targets threshold
- Toggle advanced metrics (ADOT, YPRR, Target Share, Fantasy Points)
- All player stats will be displayed in a sortable table

## Notes

- The app can handle 500+ players without performance issues
- Empty or invalid rows will be automatically filtered out
- The "League Average" row will be excluded if present
- Awards are shown with a ★ indicator