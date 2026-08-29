'use client';

import React from 'react';
import { LayoutGrid, LogOut, ShieldAlert } from 'lucide-react';

interface SkeletonPortalProps {
  role: string;
  user: any;
  logout: () => Promise<void>;
}

export default function SkeletonPortal({ role, user, logout }: SkeletonPortalProps) {
  const formatRole = (r: string) => {
    return r.charAt(0).toUpperCase() + r.slice(1).replace('_', ' ');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900 font-body-md text-slate-800 dark:text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2 py-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-md">
              <span className="font-bold text-lg">+</span>
            </div>
            <span className="font-bold tracking-tight text-xl">CareFlow</span>
          </div>

          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-medium">
              <LayoutGrid className="w-5 h-5" />
              <span>Dashboard</span>
            </div>
          </nav>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center justify-between">
          <h1 className="font-bold text-lg capitalize">{formatRole(role)} Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{user?.name}</span>
            <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {formatRole(user?.role || role)}
            </span>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center max-w-md p-8 rounded-2xl glass-panel border border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Module Under Construction</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-sm">
              The <span className="font-semibold text-slate-900 dark:text-slate-200">{formatRole(role)}</span> clinical portal is being migrated to Next.js and TypeScript. All client authentication and route protection are fully operational.
            </p>
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
