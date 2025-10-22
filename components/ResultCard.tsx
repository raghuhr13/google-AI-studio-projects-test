import React from 'react';
import type { DriveFile } from '../types';
import FileIcon from './icons/FileIcon';

interface ResultCardProps {
  result: DriveFile;
}

const getFileTypeFromMime = (mimeType: string): string => {
    if (mimeType.includes('google-apps.document')) return 'GDOC';
    if (mimeType.includes('google-apps.spreadsheet')) return 'GSHEET';
    if (mimeType.includes('google-apps.presentation')) return 'GSLIDE';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('wordprocessingml')) return 'DOCX';
    if (mimeType.includes('spreadsheetml')) return 'XLSX';
    if (mimeType.includes('presentationml')) return 'PPTX';
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    return 'FILE';
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const fileType = getFileTypeFromMime(result.mimeType);
  
  return (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-sky-500 transition-all duration-300 group">
      <a href={result.webViewLink} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4">
        <div className="flex-shrink-0 mt-1 text-slate-500 group-hover:text-sky-400 transition-colors duration-300">
          <FileIcon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-slate-100 truncate group-hover:text-sky-400 transition-colors duration-300" title={result.name}>{result.name}</p>
          <div className="flex items-center mt-2 text-sm text-slate-400">
             <span className="bg-slate-700 text-cyan-300 px-2 py-0.5 rounded-md text-xs font-mono font-bold">{fileType}</span>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ResultCard;
