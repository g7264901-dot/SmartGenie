import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import Web3 from "web3";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

// Import blockchain configuration and ABI
import contractABI from "../api/newmlm.json";

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  isConnected: boolean;
  contract: any;
  connectWallet: () => Promise<boolean>;
  checkUserRegistration: (address: string) => Promise<boolean>;
  registerUser: (referralId: string) => Promise<boolean>;
  loginUser: () => Promise<boolean>;
  logout: () => void;
  walletProvider: any;
  setWalletProvider: (provider: any) => void;
}

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Context = createContext<Web3ContextType | null>(null);

const CONTRACT_ADDRESS = "0xB3e87A325fDc19DAB850eD85e8057E5b91391C3b";
const REQUIRED_CHAIN_IDS = [204, 5611]; // opBNB mainnet and testnet

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState<any>(null);
  const [walletProvider, setWalletProvider] = useState<any>(null);

  useEffect(() => {
    // Check if user was previously logged in
    const savedAccount = localStorage.getItem("currentAccount");
    if (savedAccount) {
      setAccount(savedAccount);
      initializeWeb3();
    }

    // Listen for wallet events
    setupWalletListeners();
  }, []);

  const setupWalletListeners = () => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      logout();
    } else if (account && accounts[0] !== account) {
      Swal.fire({
        title: "Account Changed",
        text: "You have switched to a different account. Please login again.",
        icon: "warning",
      }).then(() => {
        logout();
      });
    }
  };

  const handleChainChanged = async (chainId: string) => {
    const currentChainId = parseInt(chainId, 16);
    if (!REQUIRED_CHAIN_IDS.includes(currentChainId)) {
      const result = await Swal.fire({
        title: "Wrong Network",
        text: "Please switch to opBNB network to continue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Switch Network",
        cancelButtonText: "Logout",
      });

      if (result.isConfirmed) {
        await switchToOpBNB();
      } else {
        logout();
      }
    }
  };

  const switchToOpBNB = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x15EB" }], // 5611 in hex for testnet
      });
      return true;
    } catch (error: any) {
      if (error.code === 4902) {
        toast.error("opBNB network not found in wallet");
      } else {
        toast.error("Failed to switch network");
      }
    }
  };

  const checkNetworkAndInitialize = async (provider: any) => {
    try {
      const web3Instance = new Web3(provider);
      const chainId = await web3Instance.eth.getChainId();

      if (!REQUIRED_CHAIN_IDS.includes(Number(chainId))) {
        toast.error("Please switch to opBNB network");
        return false;
      }

      setWeb3(web3Instance);

      // Initialize contract
      const contractInstance = new web3Instance.eth.Contract(
        contractABI,
        CONTRACT_ADDRESS
      );
      setContract(contractInstance);

      return true;
    } catch (error) {
      console.error("Network check failed:", error);
      toast.error("Failed to connect to network");
      return false;
    }
  };

  const initializeWeb3 = async () => {
    if (walletProvider) {
      await checkNetworkAndInitialize(walletProvider);
      setIsConnected(true);
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    try {
      if (!walletProvider) {
        toast.error("No wallet provider selected");
        return false;
      }

      console.log("Connecting wallet...");

      // First check if already connected
      let accounts;
      try {
        accounts = await walletProvider.request({ method: "eth_accounts" });
      } catch (error) {
        console.log("No existing accounts, will request access");
        accounts = [];
      }

      // If not connected, request access
      if (!accounts || accounts.length === 0) {
        accounts = await walletProvider.request({
          method: "eth_requestAccounts",
        });
      }
      
      console.log("Accounts received:", accounts);

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Account set:", accounts[0]);

        const networkOk = await checkNetworkAndInitialize(walletProvider);
        if (!networkOk) {
          console.log("Network check failed, but proceeding with connection");
          // Still set as connected even if network is wrong - user can switch later
        }

        setIsConnected(true);
        localStorage.setItem("currentAccount", accounts[0]);
        console.log("Wallet connected successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      
      // Handle specific error codes
      if (error.code === 4001) {
        console.log("User rejected the connection request");
      } else if (error.code === -32002) {
        console.log("Already processing request");
      } else {
        toast.error("Failed to connect wallet");
      }
      return false;
    }
  };

  const checkUserRegistration = async (address: string): Promise<boolean> => {
    try {
      if (!contract) return false;

      const userData = await contract.methods
        .users(address)
        .call({ from: address });
      return userData.isExist;
    } catch (error) {
      console.error("Error checking user registration:", error);
      return false;
    }
  };

  const registerUser = async (referralId: string): Promise<boolean> => {
    try {
      if (!contract || !account || !web3) {
        toast.error("Wallet not connected");
        return false;
      }

      if (!referralId || referralId === "Not specified") {
        toast.error("Invalid referral ID");
        return false;
      }

      const registrationFeeWei = "5000000000000"; // Test amount

      const gasPrice = await web3.eth.getGasPrice();
      const bufferedGasPrice = Math.floor(Number(gasPrice) * 1.2);

      const estimatedGas = await contract.methods
        .regUser(referralId)
        .estimateGas({
          from: account,
          value: registrationFeeWei,
        });

      await contract.methods.regUser(referralId).send({
        from: account,
        value: registrationFeeWei,
        gas: estimatedGas,
        gasPrice: bufferedGasPrice,
      });

      return true;
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === 4001) {
        toast.error("User denied transaction");
      } else {
        toast.error("Registration failed");
      }
      return false;
    }
  };

  const loginUser = async (): Promise<boolean> => {
    try {
      if (!account) return false;

      const isRegistered = await checkUserRegistration(account);
      if (isRegistered) {
        setIsConnected(true);
        localStorage.setItem("currentAccount", account);
        return true;
      } else {
        toast.error("User not registered");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setWeb3(null);
    setAccount(null);
    setIsConnected(false);
    setContract(null);
    localStorage.removeItem("currentAccount");
    localStorage.removeItem("selectedWalletRdns");
  };

  const value: Web3ContextType = {
    web3,
    account,
    isConnected,
    contract,
    connectWallet,
    checkUserRegistration,
    registerUser,
    loginUser,
    logout,
    walletProvider,
    setWalletProvider,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};
