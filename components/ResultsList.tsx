import React from 'react';
import type { DriveFile } from '../types';
import ResultCard from './ResultCard';

interface ResultsListProps {
  results: DriveFile[];
  summary: string | null;
}

const ResultsList: React.FC<ResultsListProps> = ({ results, summary }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-8 space-y-6">
      {summary && (
        <div className="bg-slate-800/70 p-5 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold text-sky-300 mb-2">AI Summary</h2>
          <p className="text-slate-300 whitespace-pre-wrap">{summary}</p>
        </div>
      )}

      {results.length > 0 && (
         <div>
            <h2 className="text-xl font-bold text-sky-300 mb-4">Found Documents</h2>
            <div className="space-y-4">
                {results.map((result) => (
                    <ResultCard key={result.id} result={result} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultsList;
