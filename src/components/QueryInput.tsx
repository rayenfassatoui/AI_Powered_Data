import { useState, KeyboardEvent } from 'react';
import { FiSend } from 'react-icons/fi';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export default function QueryInput({ onSubmit, isLoading = false }: QueryInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Ask a question about your data..."
        className="w-full p-4 pr-12 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={3}
        disabled={isLoading}
      />
      <button
        onClick={handleSubmit}
        disabled={!query.trim() || isLoading}
        className={`absolute right-2 bottom-2 p-2 rounded-full ${
          query.trim() && !isLoading
            ? 'text-blue-600 hover:bg-blue-50'
            : 'text-gray-400'
        }`}
      >
        <FiSend className="h-5 w-5" />
      </button>
    </div>
  );
}
