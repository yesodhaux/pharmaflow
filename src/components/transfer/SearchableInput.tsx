
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchableInputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  disabled?: boolean;
  'aria-label': string;
  id?: string;
  className?: string;
}

export const SearchableInput: React.FC<SearchableInputProps> = ({
  placeholder,
  value,
  onChange,
  onSearch,
  disabled,
  'aria-label': ariaLabel,
  id,
  className,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch();
    }
  };

  return (
    <div className={`flex w-full items-center gap-2 ${className || ''}`}>
      <Input
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1"
        onKeyPress={handleKeyPress}
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={onSearch}
        disabled={!value.trim() || disabled}
        className="h-10 w-10 shrink-0"
        aria-label={ariaLabel}
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
};
