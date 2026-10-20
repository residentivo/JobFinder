"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchJobs } from "@/lib/api";
import { ApiJob } from "@/types/job";
import { JobCard } from "@/components/JobCard";
import { SearchForm } from "@/components/SearchForm";

export default function Home() {
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const [params, setParams] = useState({
    q: "",
    sm: undefined as number | undefined,
    sx: undefined as number | undefined,
    page: 1,
    total: 5, 
    sort: undefined as string | undefined,
    order:  "asc" as "asc" | "desc" | undefined, 
  });

  const loadJobs = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchJobs({
        q: params.q,
        sm: params.sm,
        sx: params.sx,
        page: params.page,
        total: params.total, 
        sort: params.sort,
        order: params.order,
      });
      setJobs(data.vagas || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError("Erro ao carregar as vagas. Verifique se a API está rodando.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (hasSearched) {
      loadJobs();
    }
  }, [loadJobs, hasSearched]);

  const handleSearch = (searchData: { q: string; sm: string; sx: string; total: number }) => {
    setParams({
      q: searchData.q,
      sm: searchData.sm ? Number(searchData.sm) : undefined,
      sx: searchData.sx ? Number(searchData.sx) : undefined,
      page: 1, 
      total: searchData.total, 
      sort: params.sort,
      order: params.order,
    });
    setHasSearched(true);
  };

  const totalPages = Math.ceil(total / params.total);

  const handleSortChange = (newSort: string) => {

    const nextSort = params.sort === newSort ? undefined : newSort;
    
    setParams((prev) => {
      // Se clicou no mesmo botão, inverte a ordem
      if (prev.sort === newSort) {
        return {
          ...prev,
          order: prev.order === "asc" ? "desc" : "asc",
          page: 1,
        };
      }
      
      // Se clicou em um botão diferente, define o novo sort e força "asc"
      return {
        ...prev,
        sort: newSort,
        order: "asc",
        page: 1,
      };
    });

    if (params.q.trim()) {
      setHasSearched(true);
    }
  };


  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Encontre sua próxima{" "}
            <span className="text-indigo-600">oportunidade</span>
          </h1>
          <p className="mt-2 text-slate-600">
            Pesquise por cargo, empresa ou tecnologia.
          </p>
        </header>

        {/* Formulário de Busca */}
        <SearchForm onSearch={handleSearch} isLoading={isLoading} currentSort={params.sort} currentOrder={params.order} onSortChange={handleSortChange} />
        
        {/* Resultados */}
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {isLoading ? "Buscando vagas..." : `${total} vagas encontradas`}
          </p>

          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-red-700">{error}</div>
          )}

          {!isLoading && jobs.length === 0 && !error && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <p className="text-lg font-medium text-slate-700">Nenhuma vaga encontrada</p>
              <p className="mt-1 text-sm text-slate-500">Tente ajustar a busca ou os valores de salário.</p>
            </div>
          )}

          {!isLoading &&
            jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>


        {/* Paginação */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
            <button
              onClick={() => setParams((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={params.page === 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-slate-600">
              Página {params.page} de {totalPages}
            </span>
            <button
              onClick={() =>{ 
                setParams((prev) => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }));                
            }}
              disabled={params.page === totalPages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </main>
  );
}