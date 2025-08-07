import React, { useState } from 'react';
import { useWeb3 } from '../../hooks/useWeb3';
import { useMLMData } from '../../hooks/useMLMData';
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const ContractDebugger: React.FC = () => {
  const web3Context = useWeb3();
  const { data, loading, error, refetch } = useMLMData();
  const [testResults, setTestResults] = useState<any>({});
  const [testing, setTesting] = useState(false);

  const testContractFunctions = async () => {
    if (!web3Context?.contract || !web3Context?.account) {
      alert('Contract not initialized or account not connected');
      return;
    }

    setTesting(true);
    const results: any = {};

    try {
      // Test contract connection
      console.log('Testing contract at:', web3Context.contract.options.address);
      results.contractAddress = web3Context.contract.options.address;
      results.account = web3Context.account;

      // Test individual contract methods
      try {
        const userData = await web3Context.contract.methods.users(web3Context.account).call();
        results.users = {
          success: true,
          data: {
            id: userData.id?.toString(),
            referrerID: userData.referrerID?.toString(),
            joined: userData.joined?.toString(),
            isExist: userData.isExist
          }
        };
      } catch (err: any) {
        results.users = { success: false, error: err.message };
      }

      try {
        const tUserData = await web3Context.contract.methods.tusers(web3Context.account).call();
        results.tusers = {
          success: true,
          data: {
            directReferralCount: tUserData.directReferralCount?.toString(),
            indirectReferralCount: tUserData.indirectReferralCount?.toString(),
            earning: tUserData.earning?.toString()
          }
        };
      } catch (err: any) {
        results.tusers = { success: false, error: err.message };
      }

      // Test level price
      try {
        const levelPrice = await web3Context.contract.methods.LEVEL_PRICE(1).call();
        results.levelPrice = {
          success: true,
          data: levelPrice?.toString()
        };
      } catch (err: any) {
        results.levelPrice = { success: false, error: err.message };
      }

      // Test getUserIncomeCount
      try {
        const incomeCount = await web3Context.contract.methods.getUserIncomeCount(web3Context.account, 1).call();
        results.getUserIncomeCount = {
          success: true,
          data: incomeCount?.toString()
        };
      } catch (err: any) {
        results.getUserIncomeCount = { success: false, error: err.message };
      }

    } catch (error: any) {
      results.globalError = error.message;
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 my-4">
      <h3 className="text-white text-lg font-semibold mb-4">Contract Debugger</h3>
      
      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-700 p-3 rounded">
          <div className="flex items-center space-x-2">
            {web3Context?.web3 ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-white text-sm">Web3: {web3Context?.web3 ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>
        
        <div className="bg-slate-700 p-3 rounded">
          <div className="flex items-center space-x-2">
            {web3Context?.contract ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-white text-sm">Contract: {web3Context?.contract ? 'Loaded' : 'Not Loaded'}</span>
          </div>
        </div>
        
        <div className="bg-slate-700 p-3 rounded">
          <div className="flex items-center space-x-2">
            {web3Context?.account ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-white text-sm">Account: {web3Context?.account ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>
        
        <div className="bg-slate-700 p-3 rounded">
          <div className="flex items-center space-x-2">
            {web3Context?.isConnected ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-white text-sm">Status: {web3Context?.isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
      </div>

      {/* MLM Data Status */}
      <div className="bg-slate-700 p-4 rounded mb-4">
        <h4 className="text-white font-semibold mb-2">MLM Data Status</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className={`p-2 rounded ${data.personal ? 'bg-green-600' : 'bg-red-600'}`}>
            <span className="text-white">Personal: {data.personal ? '✓' : '✗'}</span>
          </div>
          <div className={`p-2 rounded ${data.team ? 'bg-green-600' : 'bg-red-600'}`}>
            <span className="text-white">Team: {data.team ? '✓' : '✗'}</span>
          </div>
          <div className={`p-2 rounded ${data.levels.length > 0 ? 'bg-green-600' : 'bg-red-600'}`}>
            <span className="text-white">Levels: {data.levels.length}</span>
          </div>
          <div className={`p-2 rounded ${data.income ? 'bg-green-600' : 'bg-red-600'}`}>
            <span className="text-white">Income: {data.income ? '✓' : '✗'}</span>
          </div>
          <div className={`p-2 rounded ${data.genealogy ? 'bg-green-600' : 'bg-red-600'}`}>
            <span className="text-white">Genealogy: {data.genealogy ? '✓' : '✗'}</span>
          </div>
        </div>
        {loading && (
          <div className="mt-2 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-blue-400">Loading MLM data...</span>
          </div>
        )}
        {error && (
          <div className="mt-2 text-red-400">
            Error: {error}
          </div>
        )}
      </div>

      {/* Contract Address & Account */}
      {web3Context?.contract && (
        <div className="bg-slate-700 p-4 rounded mb-4">
          <h4 className="text-white font-semibold mb-2">Contract Info</h4>
          <p className="text-gray-300 text-sm font-mono">
            Contract: {web3Context.contract.options.address}
          </p>
          <p className="text-gray-300 text-sm font-mono">
            Account: {web3Context.account}
          </p>
        </div>
      )}

      {/* Test Buttons */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={testContractFunctions}
          disabled={testing || !web3Context?.contract}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded text-white flex items-center space-x-2"
        >
          {testing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Test Contract Functions</span>
        </button>
        
        <button
          onClick={refetch}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded text-white flex items-center space-x-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>Refetch MLM Data</span>
        </button>
      </div>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <div className="bg-slate-700 p-4 rounded">
          <h4 className="text-white font-semibold mb-2">Contract Test Results</h4>
          <pre className="text-gray-300 text-sm overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      {/* Raw Data Display */}
      {data && (
        <div className="bg-slate-700 p-4 rounded mt-4">
          <h4 className="text-white font-semibold mb-2">Raw MLM Data</h4>
          <pre className="text-gray-300 text-sm overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ContractDebugger;
