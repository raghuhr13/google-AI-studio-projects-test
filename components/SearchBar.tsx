
import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your documents..."
          className="w-full pl-4 pr-12 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-full focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all duration-300"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-slate-400 hover:text-sky-400 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors duration-300"
          disabled={isLoading}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
