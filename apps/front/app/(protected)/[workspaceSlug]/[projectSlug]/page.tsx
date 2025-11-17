'use client';

import { useParams } from 'next/navigation';

export default function ProjectDetailPage() {
  const params = useParams<{
    workspaceSlug: string;
    projectSlug: string;
  }>();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900">
          Projet&nbsp;: {params?.projectSlug}
        </h1>
        <p className="text-neutral-500">
          Workspace&nbsp;: {params?.workspaceSlug}
        </p>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-neutral-600">
          Cette page affichera prochainement les détails du projet.
        </div>
      </div>
    </div>
  );
}
