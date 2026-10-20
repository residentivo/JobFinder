import { ApiJob } from "@/types/job";

interface JobCardProps {
  job: ApiJob;
}

export function JobCard({ job }: JobCardProps) {
  // Pega as iniciais da empresa para o logo
  const initials = job.empresa.substring(0, 2).toUpperCase();

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-700">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600">
                {job.nome}
              </h3>
              <p className="text-sm text-slate-600">{job.empresa}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.localizacao_cidade}, {job.localizacao_estado}
            </span>
            
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 capitalize">
              {job.modalidade}
            </span>
            
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 capitalize">
              {job.nivel}
            </span>

            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
              {job.stack}
            </span>

            <span className="ml-auto font-semibold text-slate-800">
              R$ {job.salario.toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}