import React from 'react';
import DriveIcon from './icons/DriveIcon';

interface ConnectDriveProps {
    onConnect: () => void;
    isGsiLoaded: boolean;
    configError: string | null;
    runtimeError: string | null;
}

const ErrorMessage: React.FC<{ title: string; message: string }> = ({ title, message }) => (
    <div className="mt-8 p-4 bg-red-900/80 border border-red-700 text-red-300 rounded-lg shadow-lg w-full">
        <p className="font-bold text-lg">{title}</p>
        <p className="mt-1 text-sm">{message}</p>
        {title === 'Configuration Required' && (
            <p className="mt-2 text-xs text-red-200">
                You'll need to create credentials in the Google Cloud Console and add them to the code.
            </p>
        )}
    </div>
);

const ConnectDrive: React.FC<ConnectDriveProps> = ({ onConnect, isGsiLoaded, configError, runtimeError }) => {
    const isButtonDisabled = !isGsiLoaded || !!configError;
    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col justify-center items-center font-sans">
            <div className="text-center max-w-lg w-full">
                <header className="my-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                        AI Document Search
                    </h1>
                    <p className="mt-4 text-lg text-slate-400">
                        Connect your Google Drive to unlock AI-powered search for all your files and documents.
                    </p>
                </header>
                <main className="mt-8 flex flex-col items-center">
                    <button
                        onClick={onConnect}
                        disabled={isButtonDisabled}
                        title={configError ? configError : 'Sign in with your Google Account'}
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-sky-600 hover:bg-sky-500 rounded-full text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-400/50 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        <DriveIcon className="w-7 h-7" />
                        Sign in with Google
                    </button>
                    {!configError && (
                        <p className="text-xs text-slate-500 mt-6">
                            This will request read-only access to your Google Drive files.
                        </p>
                    )}
                    
                    {configError && <ErrorMessage title="Configuration Required" message={configError} />}
                    {runtimeError && <ErrorMessage title="Connection Error" message={runtimeError} />}

                </main>
            </div>
        </div>
    );
};

export default ConnectDrive;
