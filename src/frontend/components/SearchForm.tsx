// components/SearchForm.tsx
"use client";

import { FormEvent, useState, useEffect, useRef } from "react";
import { fetchSuggestions } from "@/lib/api";

interface SearchFormProps {
  onSearch: (params: { q: string; sm: string; sx: string; total: number }) => void;
  isLoading: boolean;
  currentSort?: string;       
  currentOrder?: "asc" | "desc";      
  onSortChange: (sort: string) => void;  
}

export function SearchForm({ onSearch, isLoading, currentSort, currentOrder, onSortChange }: SearchFormProps) {
  const [q, setQ] = useState("");
  const [sm, setSm] = useState("");
  const [sx, setSx] = useState("");
  const [total, setTotal] = useState(5);

  // Estados do Autocomplete
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sortOptions = [
    { label: "Stack", value: "stack" },
    { label: "Nível", value: "nivel" },
    { label: "Modalidade", value: "modalidade" },
    { label: "Salário", value: "salario" },
    { label: "Localidade", value: "localizacao" },
  ];
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Efeito com Debounce para buscar sugestões
  useEffect(() => {
    // Se o termo for muito curto, limpa as sugestões
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await fetchSuggestions(q);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    }, 300); // 300ms de delay

    return () => clearTimeout(timer);
  }, [q]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;

    setShowSuggestions(false);
    onSearch({ q, sm, sx, total });
  };

  // Navegação pelo teclado
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeSuggestionIndex >= 0) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      } else {
        handleSubmit(e as unknown as FormEvent);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setQ(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    // Opcional: Já dispara a busca automaticamente ao clicar
    onSearch({ q: suggestion, sm, sx, total });
  };

  const handleTotalChange = (newTotal: number) => {
    setTotal(newTotal);
    
    // Se já houver um termo de busca, dispara a busca imediatamente
    if (q.trim()) {
      onSearch({ q, sm, sx, total: newTotal });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="relative w-full" ref={wrapperRef}>
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActiveSuggestionIndex(-1);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder="Buscar vaga, empresa ou tecnologia..."
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
                className={`cursor-pointer px-4 py-2 text-sm text-slate-700 transition ${index === activeSuggestionIndex ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50"
                  }`}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="text-sm font-medium text-slate-600 mr-1">Ordenar por:</span>
        {sortOptions.map((option) => {
          const isActive = currentSort === option.value;
          
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onSortChange(option.value)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {option.label}
              
              {/* Seta de Ordenação */}
              {isActive && (
                <svg
                  className={`h-3 w-3 transition-transform duration-200 ${
                    currentOrder === "desc" ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-1 gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-600">Salário Mínimo (R$)</label>
            <input
              type="number"
              value={sm}
              onChange={(e) => setSm(e.target.value)}
              placeholder="Ex: 3000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-slate-600">Salário Máximo (R$)</label>
            <input
              type="number"
              value={sx}
              onChange={(e) => setSx(e.target.value)}
              placeholder="Ex: 15000"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        </div>

        <div className="w-full sm:w-40">
          <label className="mb-1 block text-sm font-medium text-slate-600">Itens por pág.</label>
          <select
            value={total}
            onChange={(e) => handleTotalChange(Number(e.target.value))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !q.trim()}
          className="h-[42px] rounded-xl bg-indigo-600 px-6 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Buscando..." : "Buscar Vagas"}
        </button>
      </div>
    </form>
  );
}