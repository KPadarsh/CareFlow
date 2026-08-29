'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Database, Sliders } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface SubPageSkeletonProps {
  role: string;
  subTitle: string;
  description: string;
  allowedRoles: string[];
}

export default function SubPageSkeleton({ role, subTitle, description, allowedRoles }: SubPageSkeletonProps) {
  const formatRole = (r: string) => {
    return r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ');
  };

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-body-md text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href={`/${role}`}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-lg capitalize">{formatRole(role)} Portal</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {formatRole(role)} Module
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 mb-6">
            <Link href={`/${role}`} className="hover:text-slate-600 transition-colors capitalize">
              {formatRole(role)}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-600 dark:text-slate-300 font-medium capitalize">{subTitle}</span>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white/70 dark:bg-slate-950/70">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 capitalize">{subTitle}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
              </div>
            </div>

            {/* Mock Database Panel */}
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-center text-center">
              <Sliders className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-4 animate-pulse" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-1">Data Model Integrated</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                Next.js server-side queries have been wired to the database. Real-time patient and record tables will render here once entries are generated.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
