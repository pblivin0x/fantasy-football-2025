import React, { useState, useEffect } from 'react';
import { Trophy, Target, Zap, TrendingUp, Award, Flame } from 'lucide-react';
import { loadCSVData } from '../utils/dataLoader';

interface LeaderCard {
  category: string;
  player: string;
  value: string | number;
  team: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export default function StatLeaders() {
  const [leaders, setLeaders] = useState<LeaderCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      // Load 2024 regular season data
      const [receivingData, passingData, rushingData] = await Promise.all([
        loadCSVData('pff-nfl-regular-receiving-2024.csv').catch(() => []),
        loadCSVData('pff-nfl-regular-passing-2024.csv').catch(() => []),
        loadCSVData('pff-nfl-regular-rushing-2024.csv').catch(() => [])
      ]);

      const leaderCards: LeaderCard[] = [];

      // Receiving Leader
      if (receivingData.length > 0) {
        const receivingLeader = receivingData.reduce((prev, current) => 
          (parseFloat(current.Yds) > parseFloat(prev.Yds)) ? current : prev
        );
        leaderCards.push({
          category: 'Receiving Leader',
          player: receivingLeader.Player,
          value: `${receivingLeader.Yds} yards`,
          team: receivingLeader.Team,
          icon: <Target className="w-5 h-5" />,
          color: 'from-purple-500 to-pink-500',
          subtitle: `${receivingLeader.Rec} rec, ${receivingLeader.TD} TD`
        });

        // Most TDs
        const tdLeader = receivingData.reduce((prev, current) => 
          (parseFloat(current.TD) > parseFloat(prev.TD)) ? current : prev
        );
        if (tdLeader.Player !== receivingLeader.Player) {
          leaderCards.push({
            category: 'Touchdown Leader',
            player: tdLeader.Player,
            value: `${tdLeader.TD} TDs`,
            team: tdLeader.Team,
            icon: <Flame className="w-5 h-5" />,
            color: 'from-red-500 to-orange-500',
            subtitle: `${tdLeader.Yds} yards`
          });
        }
      }

      // Passing Leader
      if (passingData.length > 0) {
        const passingLeader = passingData.reduce((prev, current) => 
          (parseFloat(current.Yds) > parseFloat(prev.Yds)) ? current : prev
        );
        leaderCards.push({
          category: 'Passing Leader',
          player: passingLeader.Player,
          value: `${passingLeader.Yds} yards`,
          team: passingLeader.Team,
          icon: <Zap className="w-5 h-5" />,
          color: 'from-blue-500 to-cyan-500',
          subtitle: `${passingLeader.TD} TD, ${passingLeader['Cmp%']}% completion`
        });
      }

      // Rushing Leader
      if (rushingData.length > 0) {
        const rushingLeader = rushingData.reduce((prev, current) => 
          (parseFloat(current.Yds) > parseFloat(prev.Yds)) ? current : prev
        );
        leaderCards.push({
          category: 'Rushing Leader',
          player: rushingLeader.Player,
          value: `${rushingLeader.Yds} yards`,
          team: rushingLeader.Team,
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'from-green-500 to-emerald-500',
          subtitle: `${rushingLeader['Y/A']} Y/A, ${rushingLeader.TD} TD`
        });
      }

      // Fantasy Points Leader (simplified calculation)
      if (receivingData.length > 0) {
        const fantasyLeader = receivingData.reduce((prev, current) => {
          const prevPoints = parseFloat(prev.Yds) * 0.1 + parseFloat(prev.TD) * 6 + parseFloat(prev.Rec) * 0.5;
          const currentPoints = parseFloat(current.Yds) * 0.1 + parseFloat(current.TD) * 6 + parseFloat(current.Rec) * 0.5;
          return currentPoints > prevPoints ? current : prev;
        });
        const points = (parseFloat(fantasyLeader.Yds) * 0.1 + parseFloat(fantasyLeader.TD) * 6 + parseFloat(fantasyLeader.Rec) * 0.5).toFixed(1);
        leaderCards.push({
          category: 'Fantasy MVP',
          player: fantasyLeader.Player,
          value: `${points} pts`,
          team: fantasyLeader.Team,
          icon: <Award className="w-5 h-5" />,
          color: 'from-yellow-500 to-amber-500',
          subtitle: 'Half-PPR Scoring'
        });
      }

      setLeaders(leaderCards);
    } catch (error) {
      console.error('Error loading leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-800/50 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {leaders.map((leader, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 transition-all hover:scale-105 hover:shadow-xl"
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${leader.color} opacity-10`}></div>
          
          <div className="relative p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${leader.color} text-white`}>
                {leader.icon}
              </div>
              <span className="text-xs font-bold text-gray-400">{leader.team}</span>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-400 font-medium">{leader.category}</p>
              <p className="font-bold text-white truncate">{leader.player}</p>
              <p className={`text-xl font-black bg-gradient-to-r ${leader.color} bg-clip-text text-transparent`}>
                {leader.value}
              </p>
              {leader.subtitle && (
                <p className="text-xs text-gray-500">{leader.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}