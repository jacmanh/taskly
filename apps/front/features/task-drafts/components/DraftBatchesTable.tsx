'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TaskDraftBatch } from '@taskly/types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { draftBatchesTableColumns } from './DraftBatchesTableColumns';

import '@features/tasks/styles/tasks.css';

interface DraftBatchesTableProps {
  batches: TaskDraftBatch[];
  onRowClick?: (batch: TaskDraftBatch) => void;
}

export function DraftBatchesTable({
  batches,
  onRowClick,
}: DraftBatchesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const t = useTranslations('draftbatches');

  const table = useReactTable({
    data: batches,
    columns: draftBatchesTableColumns(t),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: {
      pagination: { pageSize: 20 },
    },
  });

  if (batches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 text-sm">
          Aucune génération IA pour ce projet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center gap-2'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() &&
                          ({
                            asc: <ChevronUp className="w-4 h-4" />,
                            desc: <ChevronDown className="w-4 h-4" />,
                          }[header.column.getIsSorted() as string] ??
                            null)}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-neutral-50 cursor-pointer group transition-colors"
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-sm"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 text-sm border border-neutral-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors bg-white"
            >
              Précédent
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 text-sm border border-neutral-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-100 transition-colors bg-white"
            >
              Suivant
            </button>
          </div>
          <div className="text-sm text-neutral-500">
            Page {table.getState().pagination.pageIndex + 1} sur{' '}
            {table.getPageCount()} ({batches.length} génération
            {batches.length > 1 ? 's' : ''})
          </div>
        </div>
      )}
    </div>
  );
}
