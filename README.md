# Fantasy Football 2025 Analysis Platform

A comprehensive data-driven fantasy football analysis platform combining advanced NFL statistics with expert insights for the 2025 season.

## 📊 Data Sources & Citations

### Primary Data Provider
**Pro Football Focus (PFF)** - https://www.pro-football-focus.com/
- Regular season statistics (2022-2024)
- Playoff statistics (2022-2024)  
- Advanced receiving metrics
- Passing efficiency data
- Rushing analytics

### Additional Data Sources
**Pro Football Reference** - https://www.pro-football-reference.com/
- Historical player statistics
- Team performance metrics
- Game logs and splits

**NFL Next Gen Stats** (Planned Integration)
- Advanced metrics including ADOT (Average Depth of Target)
- YPRR (Yards Per Route Run)
- Separation metrics
- Route participation data

## 🚀 Features

### Current Capabilities
- **Interactive Data Tables**: Sort and filter through 500+ NFL players
- **Advanced Metrics**: 
  - ADOT (Average Depth of Target) - estimated
  - YPRR (Yards Per Route Run) - estimated
  - Target Share percentage
  - Fantasy Points (Half-PPR scoring)
- **Multi-Year Analysis**: Compare performance across 2022-2024 seasons
- **Position Filtering**: WR, TE, RB, QB, and more
- **Real-time Search**: Find players by name or team
- **Responsive Design**: Mobile-friendly interface

### Planned Features
- [ ] Predictive analytics and backtesting engine
- [ ] Expert consensus aggregation system
- [ ] Interactive data visualizations (charts, heat maps)
- [ ] Automated weekly updates via GitHub Actions
- [ ] Custom scoring system support
- [ ] Trade analyzer and team optimizer
- [ ] Injury impact analysis
- [ ] Weather correlation data

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Data Processing**: PapaParse for CSV handling
- **Visualization**: Recharts (planned)
- **Build Tool**: Vite
- **Deployment**: Vercel/Netlify (planned)

## 📁 Project Structure

```
fantasy-football-2025/
├── public/
│   └── data/                 # NFL statistics (CSV files)
│       ├── pff-nfl-regular-*.csv
│       ├── pff-nfl-playoff-*.csv
│       └── .gitkeep
├── src/
│   ├── components/           # React components
│   │   ├── ReceivingStatsTableCSV.tsx
│   │   └── ReceivingStatsLoader.tsx
│   ├── data/                # Data models and types
│   └── App.tsx              # Main application
├── package.json
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pblivin0x/fantasy-football-2025.git
cd fantasy-football-2025
```

2. Install dependencies:
```bash
npm install
```

3. Add your data files:
   - Place PFF CSV exports in `public/data/` with prefix `pff-`
   - Files are gitignored for data privacy

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

## 📈 Data Format

The platform expects CSV files with the following structure:

### Receiving Data
```csv
Rk,Player,Age,Team,Pos,G,GS,Tgt,Rec,Yds,Y/R,TD,1D,Succ%,Lng,R/G,Y/G,Ctch%,Y/Tgt,Fmb,Awards,PlayerID
```

### Passing Data
```csv
Rk,Player,Age,Team,Pos,G,GS,Cmp,Att,Cmp%,Yds,TD,Int,Y/A,AY/A,Y/G,Rate,QBR,Sk,Yds,Sk%,NY/A,ANY/A,4QC,GWD
```

### Rushing Data
```csv
Rk,Player,Age,Team,Pos,G,GS,Att,Yds,TD,1D,Lng,Y/A,Y/G,Fmb
```

## 🔒 Data Privacy

All statistical data files (`*.csv`, `*.json`) in the `public/data/` directory are gitignored to respect data licensing and privacy. Users must provide their own data exports from authorized sources.

## 📊 Advanced Metrics Explained

- **ADOT (Average Depth of Target)**: The average distance the ball travels in the air on targets to a receiver
- **YPRR (Yards Per Route Run)**: Total receiving yards divided by total routes run
- **Target Share**: Percentage of team targets directed to a player
- **Success Rate**: Percentage of plays resulting in positive EPA (Expected Points Added)
- **Catch Rate**: Receptions divided by targets

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
1. Follow existing code style and patterns
2. Add tests for new features
3. Update documentation as needed
4. Ensure all data citations are maintained

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚖️ Legal Notice

This platform is for educational and personal use. All NFL-related trademarks and data are property of their respective owners:
- NFL data statistics are property of the National Football League
- PFF data is property of Pro Football Focus
- Users are responsible for ensuring they have proper authorization to use any data they import

## 🙏 Acknowledgments

- **Pro Football Focus (PFF)** for providing comprehensive NFL statistics
- **Pro Football Reference** for historical data
- **NFL Next Gen Stats** for advanced metrics methodology
- **Fantasy Football Community** for insights and feedback

## 📧 Contact

Project Link: https://github.com/pblivin0x/fantasy-football-2025

---

*Built with ❤️ for the fantasy football community*