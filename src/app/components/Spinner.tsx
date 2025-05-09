'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
  className?: string;
}

export default function Spinner({ 
  size = 'md',
  color = 'primary',
  className = '',
}: SpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  const colorClass = {
    primary: 'text-emerald-600',
    white: 'text-white',
  };
  
  return (
    <div className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizeClass[size]} ${colorClass[color]} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
} 