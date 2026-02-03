import React, { useState } from 'react';
import { ProjectManifest } from '../types';
import { StyleguideDisplay } from './StyleguideDisplay';
import { Layout, Code, Database, Rocket, Shield, Layers, Box, Globe, ChevronRight, Copy, Check } from 'lucide-react';

interface Props {
  manifest: ProjectManifest;
}

export const ProjectBlueprint: React.FC<Props> = ({ manifest }) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'design' | 'tech' | 'json'>('blueprint');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Safety first: Ensure the manifest structure exists
  const project = manifest.project || { name: 'New Project', version: '0.1.0', tagline: '', description: '', domain: 'example.com', locale: 'en-US' };
  const landing = manifest.landing || { structure: [], sections: {} };
  const app = manifest.app || { dashboard: { modules: [] } };
  const growth = manifest.growth || { viralLoop: { mechanism: 'N/A' }, onboarding: { gamified: false } };
  const tech = manifest.tech || { stackPreset: 'N/A', persistence: { mode: 'N/A' }, quality: { unitTests: false, e2eTests: false } };
  const auth = manifest.auth || { providers: [] };
  const seo = manifest.seo || { indexing: { robotsTxt: 'N/A', sitemap: false } };
  const designSystem = manifest.designSystem || { theme: 'light', colors: {}, components: {} }; // StyleguideDisplay handles deeper safety

  return (
    <div className="w-full max-w-7xl mx-auto bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[800px]">
      
      {/* Top Bar / Navigation */}
      <div className="border-b border-neutral-800 bg-neutral-950 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-900/20">
             {project.name?.charAt(0) || 'P'}
           </div>
           <div>
             <h2 className="text-xl font-bold text-white flex items-center gap-2">
               {project.name}
               <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono border border-blue-500/20">
                 v{project.version}
               </span>
             </h2>
             <p className="text-xs text-neutral-500 font-mono tracking-wide uppercase">
               {manifest.edition || 'Standard'} • {manifest.auditStatus || 'Draft'}
             </p>
           </div>
        </div>

        <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
          {[
            { id: 'blueprint', label: 'Architecture', icon: Layers },
            { id: 'design', label: 'Design System', icon: Layout },
            { id: 'tech', label: 'Factory & Tech', icon: Database },
            { id: 'json', label: 'Raw Manifest', icon: Code },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id 
                  ? 'bg-neutral-800 text-white shadow-sm' 
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-neutral-900/50 overflow-y-auto">
        
        {/* TAB: BLUEPRINT (Landing & App Structure) */}
        {activeTab === 'blueprint' && (
          <div className="p-8 space-y-12">
            
            {/* Project Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
              <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">
                {project.tagline}
              </h3>
              <p className="text-lg text-neutral-400">{project.description}</p>
              <div className="flex justify-center gap-2">
                <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-mono">{project.domain}</span>
                <span className="px-3 py-1 rounded bg-neutral-800 text-neutral-300 text-xs font-mono">{project.locale || 'en-US'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Landing Page Structure */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                 <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
                    <Globe className="text-blue-500" size={20} />
                    <h4 className="text-lg font-semibold text-white">Landing Strategy</h4>
                 </div>
                 <div className="space-y-4 relative">
                    <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-neutral-800" />
                    {(landing.structure || []).map((section, idx) => (
                      <div key={idx} className="relative flex items-center gap-4 group">
                         <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-xs font-mono text-neutral-500 z-10 group-hover:border-blue-500 group-hover:text-blue-400 transition-colors">
                           {idx + 1}
                         </div>
                         <div className="flex-1 bg-neutral-900 border border-neutral-800 p-3 rounded-lg text-sm text-neutral-300 group-hover:translate-x-1 transition-transform">
                            <span className="font-mono text-blue-400 uppercase text-xs mr-2">{section.replace(/_/g, ' ')}</span>
                            {/* Try to find details in sections object */}
                            <span className="text-neutral-500 text-xs block mt-1">
                               {landing.sections?.[section]?.headline || landing.sections?.[section]?.title || "Content Block"}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* App Dashboard Structure */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                 <div className="flex items-center gap-2 mb-6 border-b border-neutral-800 pb-4">
                    <Box className="text-purple-500" size={20} />
                    <h4 className="text-lg font-semibold text-white">App Dashboard</h4>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {(app.dashboard?.modules || []).map((mod: any) => (
                      <div key={mod.id || Math.random()} className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
                         <div className="mb-2 text-neutral-400">
                           {/* Icon placeholder since we have string names */}
                           <div className="w-8 h-8 rounded bg-neutral-800 flex items-center justify-center">
                              <Box size={16} />
                           </div>
                         </div>
                         <div className="font-medium text-white">{mod.label}</div>
                         <div className="text-xs text-neutral-500 font-mono mt-1 capitalize">{mod.type || 'module'}</div>
                      </div>
                    ))}
                 </div>

                 {/* Growth & Viral Loop */}
                 <div className="mt-8 pt-6 border-t border-neutral-800">
                    <div className="flex items-center gap-2 mb-4">
                      <Rocket className="text-pink-500" size={18} />
                      <h5 className="font-medium text-white">Growth Engine</h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       <div className="p-3 rounded bg-pink-500/5 border border-pink-500/20">
                          <div className="text-xs text-pink-400 uppercase font-bold mb-1">Viral Loop</div>
                          <div className="text-sm text-neutral-300">{growth.viralLoop?.mechanism || 'Not specified'}</div>
                       </div>
                       <div className="p-3 rounded bg-pink-500/5 border border-pink-500/20">
                          <div className="text-xs text-pink-400 uppercase font-bold mb-1">Onboarding</div>
                          <div className="text-sm text-neutral-300">{growth.onboarding?.gamified ? 'Gamified Flow' : 'Standard'}</div>
                       </div>
                    </div>
                 </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB: DESIGN SYSTEM (Reuse existing visualization) */}
        {activeTab === 'design' && (
           <div className="p-4 bg-white/5">
             <StyleguideDisplay ds={{...(designSystem as any), projectName: project.name}} />
           </div>
        )}

        {/* TAB: TECH & FACTORY */}
        {activeTab === 'tech' && (
          <div className="p-8 max-w-5xl mx-auto space-y-8">
            <h3 className="text-2xl font-bold text-white mb-6">Factory Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               
               {/* Tech Stack */}
               <div className="col-span-1 md:col-span-2 bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Database className="text-emerald-500" size={20} />
                    <h4 className="text-lg font-semibold text-white">Tech Stack</h4>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                        <span className="text-neutral-400">Preset</span>
                        <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{tech.stackPreset}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                        <span className="text-neutral-400">Persistence</span>
                        <span className="font-mono text-white">{tech.persistence?.mode}</span>
                     </div>
                     <div className="flex justify-between items-center py-2 border-b border-neutral-800">
                        <span className="text-neutral-400">Testing</span>
                        <div className="flex gap-2">
                           {tech.quality?.unitTests && <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300">Unit</span>}
                           {tech.quality?.e2eTests && <span className="text-xs bg-neutral-800 px-2 py-1 rounded text-neutral-300">E2E</span>}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Auth & Security */}
               <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Shield className="text-orange-500" size={20} />
                    <h4 className="text-lg font-semibold text-white">Security</h4>
                  </div>
                  <ul className="space-y-3">
                     {(auth.providers || []).map(p => (
                        <li key={p} className="flex items-center gap-2 text-sm text-neutral-300 capitalize">
                           <Check size={14} className="text-orange-500" />
                           {p} Auth
                        </li>
                     ))}
                     <li className="flex items-center gap-2 text-sm text-neutral-300">
                        <Check size={14} className="text-orange-500" />
                        GDPR Compliance
                     </li>
                  </ul>
               </div>

               {/* SEO Config */}
               <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="text-indigo-500" size={20} />
                    <h4 className="text-lg font-semibold text-white">SEO & Meta</h4>
                  </div>
                  <div className="text-sm text-neutral-400 space-y-2">
                     <p>Indexing: <span className="text-white">{seo.indexing?.robotsTxt || 'Allow All'}</span></p>
                     <p>Sitemap: <span className={seo.indexing?.sitemap ? 'text-green-400' : 'text-red-400'}>{seo.indexing?.sitemap ? 'Auto-Generated' : 'Manual'}</span></p>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* TAB: RAW JSON */}
        {activeTab === 'json' && (
          <div className="relative h-full min-h-[600px] bg-black">
             <button
               onClick={copyToClipboard}
               className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors border border-neutral-700"
             >
               {copied ? <Check size={14} /> : <Copy size={14} />}
               {copied ? 'Copied!' : 'Copy JSON'}
             </button>
             <pre className="p-6 text-xs font-mono text-green-400 overflow-auto h-full pb-20">
               {JSON.stringify(manifest, null, 2)}
             </pre>
          </div>
        )}

      </div>
    </div>
  );
};