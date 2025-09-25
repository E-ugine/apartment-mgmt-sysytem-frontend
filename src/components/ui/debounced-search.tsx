import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface DebouncedSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  className?: string;
}

export function DebouncedSearch({ 
  placeholder = 'Search...', 
  onSearch, 
  delay = 300,
  className 
}: DebouncedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, delay);

  React.useEffect(() => {
    onSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearch]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10"
      />
    </div>
  );
}