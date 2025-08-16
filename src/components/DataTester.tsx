import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { availableDataFiles, loadCSVData } from '../utils/dataLoader';

interface TestResult {
  fileName: string;
  displayName: string;
  status: 'pending' | 'success' | 'error';
  recordCount?: number;
  error?: string;
}

export default function DataTester() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const testAllFiles = async () => {
    setTesting(true);
    const results: TestResult[] = [];

    for (const file of availableDataFiles) {
      const result: TestResult = {
        fileName: file.fileName,
        displayName: file.displayName,
        status: 'pending'
      };

      try {
        console.log(`Testing ${file.fileName}...`);
        const data = await loadCSVData(file.fileName);
        result.status = 'success';
        result.recordCount = data.length;
        console.log(`✓ ${file.fileName}: ${data.length} records`);
      } catch (error) {
        result.status = 'error';
        result.error = error instanceof Error ? error.message : 'Unknown error';
        console.error(`✗ ${file.fileName}:`, error);
      }

      results.push(result);
      setTestResults([...results]);
    }

    setTesting(false);
  };

  useEffect(() => {
    testAllFiles();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500 animate-pulse" />;
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Data File Test Results</h2>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">✓ Success: {successCount}</span>
          <span className="text-red-400">✗ Failed: {errorCount}</span>
          <span className="text-gray-400">Total: {testResults.length}/{availableDataFiles.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        {testResults.map((result) => (
          <div 
            key={result.fileName}
            className={`flex items-center justify-between p-3 rounded-lg ${
              result.status === 'success' ? 'bg-green-900/20' :
              result.status === 'error' ? 'bg-red-900/20' :
              'bg-gray-800/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(result.status)}
              <div>
                <div className="font-medium">{result.displayName}</div>
                <div className="text-xs text-gray-400">{result.fileName}</div>
              </div>
            </div>
            
            <div className="text-right">
              {result.status === 'success' && (
                <span className="text-green-400">{result.recordCount} records</span>
              )}
              {result.status === 'error' && (
                <span className="text-red-400 text-xs">{result.error}</span>
              )}
              {result.status === 'pending' && (
                <span className="text-yellow-400">Testing...</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {!testing && (
        <button
          onClick={testAllFiles}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
        >
          Re-test All Files
        </button>
      )}
    </div>
  );
}