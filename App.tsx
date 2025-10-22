import React, { useState, useEffect, useCallback, useRef } from 'react';
import SearchBar from './components/SearchBar';
import ResultsList from './components/ResultsList';
import Spinner from './components/Spinner';
import ConnectDrive from './components/ConnectDrive';
import { summarizeFileList } from './services/geminiService';
import { searchDriveFiles } from './services/googleDriveService';
import type { DriveFile } from './types';

// 🔴 CONFIGURATION: Replace with your actual Google OAuth 2.0 Client ID
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

// This is a workaround for the global `google` object from the GSI script
// Fix: Provide minimal type definitions for the Google Identity Services client library
declare global {
  namespace google {
    namespace accounts {
      namespace oauth2 {
        interface TokenClient {
          requestAccessToken: () => void;
        }
        interface TokenResponse {
          access_token: string;
          error?: string;
          error_description?: string;
        }
        function initTokenClient(config: {
          client_id: string;
          scope: string;
          callback: (tokenResponse: TokenResponse) => void;
        }): TokenClient;
        function revoke(accessToken: string, callback: () => void): void;
      }
    }
  }
  interface Window {
    google: typeof google;
  }
}

const App: React.FC = () => {
  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [tokenClient, setTokenClient] = useState<google.accounts.oauth2.TokenClient | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<DriveFile[] | null>(null);
  const [searchSummary, setSearchSummary] = useState<string | null>(null);
  
  const isMounted = useRef(true);

  useEffect(() => {
    // Check if the GSI script has loaded
    const interval = setInterval(() => {
      if (window.google) {
        setIsGsiLoaded(true);
        clearInterval(interval);
      }
    }, 100);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);
  
  useEffect(() => {
    if (isGsiLoaded) {
      if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID_HERE') {
        setConfigError("Google Client ID is not configured. Please set it in App.tsx.");
        return;
      }
      setConfigError(null);
      
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: DRIVE_SCOPE,
        // Fix: Removed explicit `any` type, allowing TypeScript to infer the type from the new definitions.
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            setError(tokenResponse.error_description || 'An error occurred during authentication.');
            return;
          }
          if (isMounted.current) {
            setAccessToken(tokenResponse.access_token);
            setError(null);
          }
        },
      });
      if (isMounted.current) {
        setTokenClient(client);
      }
    }
  }, [isGsiLoaded]);

  const handleConnect = useCallback(() => {
    if (tokenClient) {
      tokenClient.requestAccessToken();
    }
  }, [tokenClient]);
  
  const handleDisconnect = useCallback(() => {
    if (accessToken) {
        window.google.accounts.oauth2.revoke(accessToken, () => {
            if (isMounted.current) {
              setAccessToken(null);
              setSearchResults(null);
              setSearchSummary(null);
              setError(null);
            }
        });
    }
  }, [accessToken]);

  const handleSearch = useCallback(async (query: string) => {
    if (!accessToken) {
      setError("Not connected to Google Drive.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setSearchSummary(null);

    try {
      const files = await searchDriveFiles(query, accessToken);
      setSearchResults(files);
      
      const summary = await summarizeFileList(files, query);
      setSearchSummary(summary);

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        if (err.message.toLowerCase().includes('invalid token') || err.message.toLowerCase().includes('token has been expired')) {
             setAccessToken(null); // Token might be invalid, force re-login
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [accessToken]);
  
  if (!accessToken) {
    return (
      <ConnectDrive 
        onConnect={handleConnect} 
        isGsiLoaded={isGsiLoaded}
        configError={configError}
        runtimeError={error}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 md:p-8 font-sans">
      <div className="container mx-auto max-w-4xl">
        <header className="text-center my-8 md:my-12">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                AI Document Search
            </h1>
            <p className="mt-4 text-lg text-slate-400">
                Searching your Google Drive files with the power of AI.
            </p>
        </header>
        
        <div className="text-center mb-8">
            <p className="text-sm text-green-400 bg-green-900/50 border border-green-700 rounded-full inline-block px-4 py-1">
                Connected to Google Drive
                <button 
                    onClick={handleDisconnect} 
                    className="ml-3 text-xs text-slate-400 hover:text-white font-bold"
                    aria-label="Disconnect from Google Drive"
                >
                (Sign Out)
                </button>
            </p>
        </div>


        <main>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          <div className="mt-8">
            {isLoading && <Spinner />}
            {error && (
              <div className="text-center p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg max-w-2xl mx-auto">
                <p className="font-semibold">Search Failed</p>
                <p>{error}</p>
              </div>
            )}
            
            {!isLoading && !error && searchResults === null && (
                <div className="text-center text-slate-500 pt-10">
                    <p>Enter a keyword to find related documents from your Drive.</p>
                </div>
            )}
            
            {(searchResults || searchSummary) && (
              <ResultsList results={searchResults || []} summary={searchSummary} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
