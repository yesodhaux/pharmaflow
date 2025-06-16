
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Cloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SearchSource = 'supabase' | 'api';

export const SearchSourceToggle = () => {
  const [source, setSource] = useState<SearchSource>('supabase');
  const { toast } = useToast();

  useEffect(() => {
    const savedSource = localStorage.getItem('searchSource') as SearchSource;
    if (savedSource && ['supabase', 'api'].includes(savedSource)) {
      setSource(savedSource);
    }
  }, []);

  const toggleSource = () => {
    const newSource: SearchSource = source === 'supabase' ? 'api' : 'supabase';
    setSource(newSource);
    localStorage.setItem('searchSource', newSource);
    toast({
      title: 'Fonte de busca alterada',
      description: `Agora buscando via ${newSource === 'supabase' ? 'Banco de Dados' : 'API Legada'}`,
    });
  };

  const tooltipText = source === 'supabase' ? 'Buscando no Banco de Dados (Supabase)' : 'Buscando na API Legada';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggleSource} aria-label="Alterar fonte de busca de produtos">
            {source === 'supabase' ? <Database className="h-5 w-5" /> : <Cloud className="h-5 w-5" />}
            <span className="sr-only">Alterar fonte de busca para {source === 'supabase' ? 'API Legada' : 'Banco de Dados'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
