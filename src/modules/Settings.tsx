import React from 'react';
import { Settings, Shield, Webhook, Globe } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Settings & System Configuration</h1>
          <p className="text-xs text-slate-400">Role-Based Access Control (RBAC), Webhooks & Multi-Tenant Locales</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-slate-200 text-xs font-semibold border-b border-slate-800 pb-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Role-Based Access Control (RBAC)</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
              <span className="font-semibold text-slate-200">Administrator</span>
              <span className="text-emerald-400 text-[10px]">Full Access</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
              <span className="font-semibold text-slate-200">Content Author</span>
              <span className="text-blue-400 text-[10px]">Edit & Create ULOs</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-slate-200 text-xs font-semibold border-b border-slate-800 pb-2">
            <Webhook className="w-4 h-4 text-emerald-400" />
            <span>Ecosystem Webhooks & API Endpoints</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300">COSYworld RPG Stream</span>
              <span className="text-emerald-400 text-[10px]">Active (1ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
