# Data Sources Documentation

## Primary Data: Pro Football Focus (PFF)

All statistical data is sourced from **Pro Football Focus (PFF)** exports.

### Available Datasets

#### Regular Season Data (2022-2024)
- `pff-nfl-regular-receiving-[year].csv` - Receiving statistics
- `pff-nfl-regular-passing-[year].csv` - Passing statistics  
- `pff-nfl-regular-rushing-[year].csv` - Rushing statistics

#### Playoff Data (2022-2024)
- `pff-nfl-playoff-receiving-[year].csv` - Playoff receiving statistics
- `pff-nfl-playoff-passing-[year].csv` - Playoff passing statistics
- `pff-nfl-playoff-rushing-[year].csv` - Playoff rushing statistics

## Data Structure

### CSV Header Format
PFF exports contain a double header row:
1. First row: Category labels (e.g., "Receiving,Receiving,...")
2. Second row: Actual column names

The application automatically handles this format by:
- Stripping the first header row
- Removing "-9999" and "-additional" column markers
- Filtering out "League Average" rows

### Key Columns

#### Receiving Data
- **Rk**: Rank
- **Player**: Player name
- **Team**: Current team (includes "2TM", "3TM" for multi-team players)
- **Pos**: Position
- **Tgt**: Targets
- **Rec**: Receptions
- **Yds**: Yards
- **TD**: Touchdowns
- **Ctch%**: Catch percentage
- **Y/Tgt**: Yards per target

#### Passing Data
- **Cmp**: Completions
- **Att**: Attempts
- **Cmp%**: Completion percentage
- **Yds**: Passing yards
- **TD**: Passing touchdowns
- **Int**: Interceptions
- **Rate**: Passer rating

#### Rushing Data
- **Att**: Attempts
- **Yds**: Rushing yards
- **TD**: Rushing touchdowns
- **Y/A**: Yards per attempt
- **Fmb**: Fumbles

## Data Updates

To update the data:
1. Export fresh data from PFF
2. Save files with naming convention: `pff-nfl-[season]-[stat_type]-[year].csv`
3. Place in `public/data/` directory
4. The application will automatically load the new data

## Advanced Metrics Calculations

Some metrics are calculated from base statistics:
- **ADOT**: Estimated as Y/Tgt × 1.2
- **YPRR**: Estimated as Y/G ÷ 30 (assuming ~30 routes per game)
- **Target Share**: (Targets ÷ (Games × 35)) × 100
- **Fantasy Points**: (Yards × 0.1) + (TD × 6) + (Rec × 0.5) [Half-PPR]

## Data Privacy Note

All CSV files are gitignored to respect PFF's data licensing. Users must provide their own authorized data exports.

## Citation

When using this data, please cite:
> Data provided by Pro Football Focus (PFF) - https://www.pro-football-focus.com/