export interface ReceivingStats {
  rank: number;
  player: string;
  age: number;
  team: string;
  position: string;
  games: number;
  gamesStarted: number;
  targets: number;
  receptions: number;
  yards: number;
  yardsPerReception: number;
  touchdowns: number;
  firstDowns: number;
  successRate: number;
  long: number;
  receptionsPerGame: number;
  yardsPerGame: number;
  catchPercentage: number;
  yardsPerTarget: number;
  fumbles: number;
  awards: string;
  playerId: string;
}

export const receivingData: ReceivingStats[] = [
  {
    rank: 1,
    player: "Ja'Marr Chase",
    age: 24,
    team: "CIN",
    position: "WR",
    games: 17,
    gamesStarted: 16,
    targets: 175,
    receptions: 127,
    yards: 1708,
    yardsPerReception: 13.4,
    touchdowns: 17,
    firstDowns: 75,
    successRate: 62.3,
    long: 70,
    receptionsPerGame: 7.5,
    yardsPerGame: 100.5,
    catchPercentage: 72.6,
    yardsPerTarget: 9.8,
    fumbles: 0,
    awards: "PBAP-1AP MVP-8AP OPoY-3",
    playerId: "ChasJa00"
  },
  {
    rank: 2,
    player: "Amon-Ra St. Brown",
    age: 25,
    team: "DET",
    position: "WR",
    games: 17,
    gamesStarted: 17,
    targets: 141,
    receptions: 115,
    yards: 1263,
    yardsPerReception: 11.0,
    touchdowns: 12,
    firstDowns: 73,
    successRate: 70.2,
    long: 66,
    receptionsPerGame: 6.8,
    yardsPerGame: 74.3,
    catchPercentage: 81.6,
    yardsPerTarget: 9.0,
    fumbles: 1,
    awards: "PBAP-1AP OPoY-11",
    playerId: "StxxAm00"
  },
  {
    rank: 3,
    player: "Brock Bowers",
    age: 22,
    team: "LVR",
    position: "TE",
    games: 17,
    gamesStarted: 16,
    targets: 153,
    receptions: 112,
    yards: 1194,
    yardsPerReception: 10.7,
    touchdowns: 5,
    firstDowns: 61,
    successRate: 60.8,
    long: 57,
    receptionsPerGame: 6.6,
    yardsPerGame: 70.2,
    catchPercentage: 73.2,
    yardsPerTarget: 7.8,
    fumbles: 0,
    awards: "PBAP-1AP ORoY-2",
    playerId: "BoweBr01"
  },
  {
    rank: 4,
    player: "Trey McBride",
    age: 25,
    team: "ARI",
    position: "TE",
    games: 16,
    gamesStarted: 16,
    targets: 147,
    receptions: 111,
    yards: 1146,
    yardsPerReception: 10.3,
    touchdowns: 2,
    firstDowns: 63,
    successRate: 63.3,
    long: 37,
    receptionsPerGame: 6.9,
    yardsPerGame: 71.6,
    catchPercentage: 75.5,
    yardsPerTarget: 7.8,
    fumbles: 0,
    awards: "PB",
    playerId: "McBrTr01"
  },
  {
    rank: 5,
    player: "Malik Nabers",
    age: 21,
    team: "NYG",
    position: "WR",
    games: 15,
    gamesStarted: 13,
    targets: 170,
    receptions: 109,
    yards: 1204,
    yardsPerReception: 11.0,
    touchdowns: 7,
    firstDowns: 55,
    successRate: 51.2,
    long: 59,
    receptionsPerGame: 7.3,
    yardsPerGame: 80.3,
    catchPercentage: 64.1,
    yardsPerTarget: 7.1,
    fumbles: 1,
    awards: "PBAP ORoY-5",
    playerId: "NabeMa00"
  },
  {
    rank: 6,
    player: "Justin Jefferson",
    age: 25,
    team: "MIN",
    position: "WR",
    games: 17,
    gamesStarted: 17,
    targets: 154,
    receptions: 103,
    yards: 1533,
    yardsPerReception: 14.9,
    touchdowns: 10,
    firstDowns: 62,
    successRate: 57.1,
    long: 97,
    receptionsPerGame: 6.1,
    yardsPerGame: 90.2,
    catchPercentage: 66.9,
    yardsPerTarget: 10.0,
    fumbles: 1,
    awards: "PBAP-1AP OPoY-7",
    playerId: "JeffJu00"
  },
  {
    rank: 7,
    player: "CeeDee Lamb",
    age: 25,
    team: "DAL",
    position: "WR",
    games: 15,
    gamesStarted: 15,
    targets: 152,
    receptions: 101,
    yards: 1194,
    yardsPerReception: 11.8,
    touchdowns: 6,
    firstDowns: 54,
    successRate: 50.0,
    long: 65,
    receptionsPerGame: 6.7,
    yardsPerGame: 79.6,
    catchPercentage: 66.4,
    yardsPerTarget: 7.9,
    fumbles: 1,
    awards: "PBAP-2",
    playerId: "LambCe00"
  },
  {
    rank: 8,
    player: "Garrett Wilson",
    age: 24,
    team: "NYJ",
    position: "WR",
    games: 17,
    gamesStarted: 17,
    targets: 154,
    receptions: 101,
    yards: 1104,
    yardsPerReception: 10.9,
    touchdowns: 7,
    firstDowns: 60,
    successRate: 53.9,
    long: 42,
    receptionsPerGame: 5.9,
    yardsPerGame: 64.9,
    catchPercentage: 65.6,
    yardsPerTarget: 7.2,
    fumbles: 2,
    awards: "",
    playerId: "WilsGa00"
  },
  {
    rank: 9,
    player: "Drake London",
    age: 23,
    team: "ATL",
    position: "WR",
    games: 17,
    gamesStarted: 17,
    targets: 158,
    receptions: 100,
    yards: 1271,
    yardsPerReception: 12.7,
    touchdowns: 9,
    firstDowns: 67,
    successRate: 56.3,
    long: 39,
    receptionsPerGame: 5.9,
    yardsPerGame: 74.8,
    catchPercentage: 63.3,
    yardsPerTarget: 8.0,
    fumbles: 0,
    awards: "",
    playerId: "LondDr00"
  },
  {
    rank: 10,
    player: "Jaxon Smith-Njigba",
    age: 22,
    team: "SEA",
    position: "WR",
    games: 17,
    gamesStarted: 16,
    targets: 137,
    receptions: 100,
    yards: 1130,
    yardsPerReception: 11.3,
    touchdowns: 6,
    firstDowns: 57,
    successRate: 58.4,
    long: 46,
    receptionsPerGame: 5.9,
    yardsPerGame: 66.5,
    catchPercentage: 73.0,
    yardsPerTarget: 8.2,
    fumbles: 1,
    awards: "PB",
    playerId: "SmitJa06"
  }
];

// Add function to calculate advanced metrics
export function calculateAdvancedMetrics(stats: ReceivingStats) {
  // These would normally come from play-by-play data
  // For now, we'll estimate based on available stats
  
  const estimatedADOT = stats.yardsPerTarget * 1.2; // Rough estimate
  const estimatedYPRR = stats.yardsPerGame / 30; // Assuming ~30 routes per game
  const targetShare = (stats.targets / (stats.games * 35)) * 100; // Assuming ~35 team targets per game
  
  return {
    ...stats,
    adot: estimatedADOT,
    yprr: estimatedYPRR,
    targetShare: targetShare,
    fantasyPoints: stats.yards * 0.1 + stats.touchdowns * 6 + stats.receptions * 0.5 // Half PPR
  };
}