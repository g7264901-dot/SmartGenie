import { useState, useEffect } from 'react';
import { useWeb3 } from './useWeb3';

// Import the blockchain dev's functions
declare global {
  interface Window {
    getPersonalDash: () => Promise<any>;
    getTeamDevDash: () => Promise<any>;
    getLevelDash: () => Promise<any>;
    getIncomeDash: () => Promise<any>;
    getGeneome: () => Promise<any>;
    initContractInstance: (provider: string) => Promise<any>;
    checkUserInSmartContract: (address: string) => Promise<boolean>;
    unixToIndianDate: (timestamp: number) => Promise<string>;
    currentAccount: string;
  }
}

interface PersonalData {
  userId: number;
  refId: number;
  doj: string;
}

interface TeamData {
  dRefCnt: number;
  indRefCnt: number;
  refTotal: number;
}

interface LevelData {
  level: number;
  levelStat: string;
  levelIncome: number;
}

interface IncomeData {
  dirRefInc: number;
  teamBon: number;
  levelTot: number;
  totalInc: number;
}

interface GenealogyNode {
  address: string;
  id: number;
  referrals?: GenealogyNode[];
}

interface MLMData {
  personal: PersonalData | null;
  team: TeamData | null;
  levels: LevelData[];
  income: IncomeData | null;
  genealogy: GenealogyNode | null;
}

export const useMLMData = () => {
  const [data, setData] = useState<MLMData>({
    personal: null,
    team: null,
    levels: [],
    income: null,
    genealogy: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { account } = useWeb3();

  const fetchAllData = async () => {
    if (!account) {
      setError('Wallet not connected');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set currentAccount for the connection.js functions
      window.currentAccount = account;

      // Execute all the blockchain dev's functions in parallel
      const [personalData, teamData, levelData, incomeData, genealogyData] = await Promise.allSettled([
        window.getPersonalDash?.() || Promise.resolve(null),
        window.getTeamDevDash?.() || Promise.resolve(null),
        window.getLevelDash?.() || Promise.resolve({ lvlData: [], lvlTotal: 0 }),
        window.getIncomeDash?.() || Promise.resolve(null),
        window.getGeneome?.() || Promise.resolve(null)
      ]);

      setData({
        personal: personalData.status === 'fulfilled' ? personalData.value : null,
        team: teamData.status === 'fulfilled' ? teamData.value : null,
        levels: levelData.status === 'fulfilled' ? levelData.value?.lvlData || [] : [],
        income: incomeData.status === 'fulfilled' ? incomeData.value : null,
        genealogy: genealogyData.status === 'fulfilled' ? genealogyData.value : null
      });

      // Log any rejected promises
      [personalData, teamData, levelData, incomeData, genealogyData].forEach((result, index) => {
        if (result.status === 'rejected') {
          console.warn(`Data fetch ${index} failed:`, result.reason);
        }
      });

    } catch (err: any) {
      console.error('Error fetching MLM data:', err);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && typeof window !== 'undefined') {
      // Wait a bit for the connection.js functions to be available
      const timer = setTimeout(() => {
        fetchAllData();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [account]);

  return {
    data,
    loading,
    error,
    refetch: fetchAllData
  };
};
