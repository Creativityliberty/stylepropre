import React, { useState } from 'react';
import { DesignSystem } from '../types';
import { Moon, Sun, Layers, LayoutGrid, Type, Palette, Zap, Code, Maximize, Image as ImageIcon, MousePointer2 } from 'lucide-react';

interface Props {
  ds: DesignSystem;
}

export const StyleguideDisplay: React.FC<Props> = ({ ds }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  
  // Defensive programming: Deep merge to ensure critical nested objects exist
  const defaultTypographyScale = { h1: '2.5rem', h2: '2rem', h3: '1.75rem', body: '1rem', caption: '0.875rem' };
  const defaultSpacingScale = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', xxl: '48px' };
  const defaultAnimationDuration = { fast: '150ms', normal: '300ms', slow: '500ms' };

  const safeDs = {
    ...ds,
    borderRadius: ds?.borderRadius || { small: '4px', medium: '8px', large: '12px', full: '9999px' },
    shadows: ds?.shadows || { sm: '0 1px 2px rgba(0,0,0,0.1)', md: '0 4px 6px rgba(0,0,0,0.1)', lg: '0 10px 15px rgba(0,0,0,0.1)' },
    animation: {
        easing: ds?.animation?.easing || 'ease',
        duration: { ...defaultAnimationDuration, ...ds?.animation?.duration }
    },
    spacing: {
        base: ds?.spacing?.base || 4,
        scale: { ...defaultSpacingScale, ...ds?.spacing?.scale }
    },
    typography: {
        fontFamily: ds?.typography?.fontFamily || 'sans-serif',
        scale: { ...defaultTypographyScale, ...ds?.typography?.scale }
    },
    colors: ds?.colors || { 
        light: { primary: '#000', text: '#000', background: '#fff' } as any, 
        dark: { primary: '#fff', text: '#fff', background: '#000' } as any 
    }
  };

  // Select the current color palette based on mode
  const colors = safeDs.colors[mode] || safeDs.colors.light || { background: '#fff', text: '#000' };
  const comps = safeDs.components || {};
  const borderRadius = safeDs.borderRadius;
  const shadows = safeDs.shadows;

  // Defaults helpers
  const defaultBadges = {
      success: { background: (colors.success || '#10B981') + '33', text: colors.success || '#10B981' },
      error: { background: (colors.error || '#EF4444') + '33', text: colors.error || '#EF4444' },
      warning: { background: (colors.warning || '#F59E0B') + '33', text: colors.warning || '#F59E0B' },
      info: { background: (colors.info || '#3B82F6') + '33', text: colors.info || '#3B82F6' },
  };

  // Robustly merge defaults (handling case where comps.badges is {} but missing keys)
  const badges = {
      success: comps?.badges?.success || defaultBadges.success,
      error: comps?.badges?.error || defaultBadges.error,
      warning: comps?.badges?.warning || defaultBadges.warning,
      info: comps?.badges?.info || defaultBadges.info,
  };

  // Use component specs if available, otherwise fallback to defaults (legacy support)
  const btnPrimary = comps?.buttons?.primary || { 
      background: colors.primary || '#000000', 
      text: '#FFFFFF', 
      hover: colors.primaryHover || colors.primary || '#333333',
      radius: borderRadius.medium
  };
  
  const btnSecondary = comps?.buttons?.secondary || { 
      border: colors.border || '#E5E5E5', 
      text: colors.text || '#000000', 
      hoverBackground: colors.surfaceHighlight || '#F5F5F5',
      radius: borderRadius.medium
  };

  const cardStyle = {
      background: comps?.cards?.background || colors.surface || '#FFFFFF',
      radius: comps?.cards?.radius || borderRadius.large,
      shadow: comps?.cards?.shadow || shadows.md,
      hoverShadow: comps?.cards?.hoverShadow || shadows.lg
  };

  const inputStyle = {
      background: comps?.inputs?.background || colors.surfaceHighlight || '#F5F5F5',
      border: comps?.inputs?.border || colors.border || '#E5E5E5',
      focusBorder: comps?.inputs?.focusBorder || colors.primary || '#000000',
      radius: comps?.inputs?.radius || borderRadius.medium
  };
  
  const gradients = safeDs.gradients || { primary: 'none', secondary: 'none' };

  return (
    <div 
      className="w-full max-w-6xl mx-auto shadow-2xl overflow-hidden relative transition-colors duration-500 ease-in-out rounded-xl"
      style={{ backgroundColor: colors.background || '#FFFFFF', fontFamily: safeDs.typography.fontFamily, color: colors.text || '#000000' }}
    >
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Control Bar (Theme Switcher) */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
         <button
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-2 px-4 py-2 rounded-full font-medium shadow-lg transition-all transform active:scale-95"
            style={{ 
                backgroundColor: colors.surface || '#FFFFFF', 
                color: colors.text || '#000000',
                border: `1px solid ${colors.border || '#E5E5E5'}`
            }}
         >
            {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{mode === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
         </button>
      </div>

      <div className="relative p-8 md:p-12 space-y-16">
        
        {/* Header */}
        <div className="border-b pb-8 max-w-3xl" style={{ borderColor: colors.border || '#E5E5E5' }}>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 text-transparent bg-clip-text transition-all duration-500"
              style={{ 
                backgroundImage: `linear-gradient(135deg, ${colors.text || '#000'} 0%, ${colors.textSecondary || '#666'} 100%)` 
              }}>
            {safeDs.projectName || 'Project'}
          </h1>
          <p className="text-xl md:text-2xl font-light mb-4" style={{ color: colors.textSecondary || '#666' }}>
            App UI Styleguide
          </p>
          <div className="flex gap-2 text-xs font-mono opacity-60">
             <span className="px-2 py-1 rounded border" style={{ borderColor: colors.border || '#E5E5E5' }}>v1.0.0</span>
             <span className="px-2 py-1 rounded border" style={{ borderColor: colors.border || '#E5E5E5' }}>{mode.toUpperCase()}</span>
          </div>
          <p className="mt-6 max-w-2xl opacity-80 leading-relaxed">{safeDs.description}</p>
        </div>

        {/* 0. UI Visualisation */}
        {safeDs.uiImage && (
          <section>
            <div className="flex items-center gap-2 mb-6 opacity-80" style={{ color: colors.textSecondary || '#666' }}>
               <ImageIcon size={20} />
               <h3 className="text-xl font-semibold uppercase tracking-widest">UI Concept Visualization</h3>
            </div>
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border" style={{ borderColor: colors.border || '#E5E5E5' }}>
               <img src={safeDs.uiImage} alt="AI Generated UI Mockup" className="w-full h-auto object-cover" />
               <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md">
                  Generated by Gemini 2.5
               </div>
            </div>
          </section>
        )}

        {/* 1. Color Tokens & Gradients */}
        <section>
          <div className="flex items-center gap-2 mb-6 opacity-80" style={{ color: colors.textSecondary || '#666' }}>
             <Palette size={20} />
             <h3 className="text-xl font-semibold uppercase tracking-widest">Colors & Gradients</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Primary', value: colors.primary },
              { label: 'Secondary', value: colors.secondary },
              { label: 'Surface', value: colors.surface, border: true },
              { label: 'Background', value: colors.background, border: true },
              { label: 'Success', value: colors.success },
              { label: 'Warning', value: colors.warning },
              { label: 'Error', value: colors.error },
              { label: 'Info', value: colors.info },
              { label: 'Text Main', value: colors.text },
              { label: 'Text Sec', value: colors.textSecondary },
            ].map((color) => (
              <div key={color.label} className="group">
                <div 
                  className="h-24 w-full rounded-lg mb-3 shadow-sm transition-transform transform group-hover:scale-105 flex items-center justify-center relative overflow-hidden"
                  style={{ 
                    backgroundColor: color.value || '#CCCCCC', 
                    borderRadius: borderRadius.medium,
                    border: color.border ? `1px solid ${colors.border || '#E5E5E5'}` : 'none'
                  }}
                >
                    <span className="opacity-0 group-hover:opacity-100 bg-black/50 text-white text-xs px-2 py-1 rounded transition-opacity backdrop-blur-sm">
                        {color.value || 'N/A'}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-medium text-sm">{color.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography & Motion */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
          <section>
             <div className="flex items-center gap-2 mb-6 opacity-80" style={{ color: colors.textSecondary || '#666' }}>
                 <Type size={20} />
                 <h3 className="text-xl font-semibold uppercase tracking-widest">Typography</h3>
             </div>
             
             <div className="space-y-8">
                <div className="flex flex-col gap-1 pb-4 border-b" style={{ borderColor: colors.border || '#E5E5E5' }}>
                  <span style={{ fontSize: safeDs.typography.scale.h1, fontWeight: 700, lineHeight: 1.2 }}>The quick brown fox</span>
                  <div className="flex justify-between text-xs font-mono opacity-50 mt-1">
                      <span>Heading 1</span>
                      <span>{safeDs.typography.scale.h1}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 pb-4 border-b" style={{ borderColor: colors.border || '#E5E5E5' }}>
                  <span style={{ fontSize: safeDs.typography.scale.h2, fontWeight: 600 }}>Jumps over the lazy dog</span>
                  <div className="flex justify-between text-xs font-mono opacity-50 mt-1">
                      <span>Heading 2</span>
                      <span>{safeDs.typography.scale.h2}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: safeDs.typography.scale.body, lineHeight: 1.6 }}>
                    {safeDs.iconStyle || 'Outline'} icons are recommended for this design system to maintain visual consistency.
                  </span>
                  <div className="flex justify-between text-xs font-mono opacity-50 mt-2">
                      <span>Body</span>
                      <span>{safeDs.typography.scale.body}</span>
                  </div>
                </div>
             </div>
          </section>

          <section>
                <div className="flex items-center gap-2 mb-6 opacity-80" style={{ color: colors.textSecondary || '#666' }}>
                    <Zap size={20} />
                    <h3 className="text-xl font-semibold uppercase tracking-widest">Motion & Spacing</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {['fast', 'normal', 'slow'].map((speed) => (
                        <div key={speed} className="bg-transparent border rounded-lg p-4 flex flex-col gap-4" style={{ borderColor: colors.border || '#E5E5E5' }}>
                             <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-current w-1/2 animate-pulse"
                                    style={{ 
                                        backgroundColor: colors.primary || '#000',
                                        animationDuration: safeDs.animation.duration[speed as keyof typeof safeDs.animation.duration] 
                                    }}
                                />
                             </div>
                             <div className="flex justify-between items-end">
                                 <span className="text-xs uppercase font-bold opacity-60">{speed}</span>
                                 <span className="text-xs font-mono opacity-40">{safeDs.animation.duration[speed as keyof typeof safeDs.animation.duration]}</span>
                             </div>
                        </div>
                    ))}
                </div>
                 <div className="space-y-3">
                    {Object.entries(safeDs.spacing.scale).slice(0,4).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-4 group">
                            <span className="w-8 text-xs font-mono uppercase opacity-50">{key}</span>
                            <div 
                                className="h-4 rounded-sm transition-all duration-300 group-hover:opacity-100 opacity-60"
                                style={{ width: val, backgroundColor: colors.primary || '#000' }} 
                            />
                            <span className="text-xs font-mono opacity-40">{val}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        <div className="h-px w-full" style={{ backgroundColor: colors.border || '#E5E5E5' }} />

        {/* 3. Detailed Component Specs */}
        <section>
          <div className="flex items-center gap-2 mb-10 opacity-80" style={{ color: colors.textSecondary || '#666' }}>
             <Layers size={20} />
             <h3 className="text-xl font-semibold uppercase tracking-widest">Components</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Buttons Group */}
            <div className="space-y-6">
                <h4 className="text-sm font-mono opacity-50 mb-2 border-b pb-2" style={{borderColor: colors.border || '#E5E5E5'}}>BUTTONS</h4>
                
                {/* Primary Button with dynamic hover state */}
                <div 
                    className="group w-full relative"
                    onMouseEnter={() => setActiveBtn('primary')}
                    onMouseLeave={() => setActiveBtn(null)}
                >
                    <button 
                        className="w-full flex items-center justify-center px-6 py-3 font-semibold transition-all shadow-md"
                        style={{ 
                            background: activeBtn === 'primary' ? btnPrimary.hover : btnPrimary.background, 
                            color: btnPrimary.text, 
                            borderRadius: btnPrimary.radius,
                            transitionDuration: safeDs.animation.duration.fast,
                            transitionTimingFunction: safeDs.animation.easing
                        }}
                    >
                        Primary Action
                    </button>
                    {/* Hover tooltip */}
                    <div className="absolute top-0 right-0 -mt-8 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-2 py-1 rounded">
                        Hover: {btnPrimary.hover}
                    </div>
                </div>

                {/* Secondary Button */}
                 <div 
                    className="group w-full relative"
                    onMouseEnter={() => setActiveBtn('secondary')}
                    onMouseLeave={() => setActiveBtn(null)}
                >
                    <button 
                        className="w-full flex items-center justify-center px-6 py-3 font-semibold transition-colors border"
                        style={{ 
                            borderColor: btnSecondary.border,
                            backgroundColor: activeBtn === 'secondary' ? btnSecondary.hoverBackground : 'transparent',
                            color: btnSecondary.text, 
                            borderRadius: btnSecondary.radius
                        }}
                    >
                        Secondary Action
                    </button>
                </div>
            </div>

            {/* Inputs & Badges */}
            <div className="space-y-6">
                <h4 className="text-sm font-mono opacity-50 mb-2 border-b pb-2" style={{borderColor: colors.border || '#E5E5E5'}}>INPUTS & BADGES</h4>
                
                {/* Input */}
                <div className="space-y-1">
                    <label className="text-xs font-bold uppercase opacity-70">Email Address</label>
                    <input 
                        type="text" 
                        defaultValue="design@university.edu"
                        className="w-full px-4 py-3 outline-none transition-all"
                        style={{ 
                            backgroundColor: inputStyle.background,
                            border: `1px solid ${inputStyle.border}`,
                            borderRadius: inputStyle.radius,
                            color: colors.text || '#000',
                            transitionDuration: safeDs.animation.duration.fast
                        }}
                        onFocus={(e) => e.target.style.borderColor = inputStyle.focusBorder}
                        onBlur={(e) => e.target.style.borderColor = inputStyle.border}
                    />
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-center" 
                          style={{ backgroundColor: badges.success.background, color: badges.success.text, borderRadius: borderRadius.full }}>
                        Success
                    </span>
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-center" 
                          style={{ backgroundColor: badges.info.background, color: badges.info.text, borderRadius: borderRadius.full }}>
                        Info
                    </span>
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-center" 
                          style={{ backgroundColor: badges.warning.background, color: badges.warning.text, borderRadius: borderRadius.full }}>
                        Warning
                    </span>
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-center" 
                          style={{ backgroundColor: badges.error.background, color: badges.error.text, borderRadius: borderRadius.full }}>
                        Error
                    </span>
                </div>
            </div>

            {/* Cards */}
            <div className="space-y-6">
                 <h4 className="text-sm font-mono opacity-50 mb-2 border-b pb-2" style={{borderColor: colors.border || '#E5E5E5'}}>CARDS</h4>
                 
                 <div 
                   className="flex flex-col overflow-hidden transition-all group"
                   style={{ 
                     backgroundColor: cardStyle.background,
                     borderRadius: cardStyle.radius,
                     boxShadow: cardStyle.shadow,
                     border: `1px solid ${colors.border || '#E5E5E5'}`,
                     transitionDuration: safeDs.animation.duration.normal,
                   }}
                   onMouseEnter={(e) => {
                       e.currentTarget.style.boxShadow = cardStyle.hoverShadow;
                       e.currentTarget.style.transform = "translateY(-2px)";
                   }}
                   onMouseLeave={(e) => {
                       e.currentTarget.style.boxShadow = cardStyle.shadow;
                       e.currentTarget.style.transform = "translateY(0)";
                   }}
                 >
                   <div className="h-32 w-full relative" style={{ background: gradients.secondary }}>
                       <div className="absolute bottom-4 left-4">
                            <span className="px-2 py-1 text-xs font-bold rounded bg-white/20 text-white backdrop-blur-md">
                                Course Module
                            </span>
                       </div>
                   </div>
                   <div className="p-5 space-y-3">
                       <h5 className="font-bold text-lg">Introduction to Design</h5>
                       <p className="text-sm opacity-60 leading-relaxed">
                           Learn the fundamentals of color theory and typography in this comprehensive module.
                       </p>
                       <div className="pt-2 flex items-center gap-2 text-xs font-medium" style={{ color: colors.primary || '#000' }}>
                           <span>Start Learning</span>
                           <MousePointer2 size={12} />
                       </div>
                   </div>
                 </div>
            </div>
          </div>
        </section>

        {/* CSS Export Block */}
        <section className="bg-black/5 dark:bg-black/30 p-6 rounded-xl border border-black/10 dark:border-white/10 font-mono text-xs overflow-x-auto">
             <div className="flex items-center gap-2 mb-4 opacity-70">
                <Code size={16} />
                <span className="uppercase font-bold tracking-wider">Developer Export (CSS Variables)</span>
             </div>
             <pre className="text-opacity-80" style={{ color: colors.text || '#000' }}>
{`:root {
  /* Colors (${mode}) */
  --primary: ${colors.primary};
  --primary-hover: ${colors.primaryHover};
  --secondary: ${colors.secondary};
  --success: ${colors.success};
  --error: ${colors.error};
  --warning: ${colors.warning};
  --info: ${colors.info};
  --background: ${colors.background};
  --text: ${colors.text};
  
  /* Components */
  --btn-radius: ${btnPrimary.radius};
  --card-radius: ${cardStyle.radius};
  --card-shadow: ${cardStyle.shadow};
  --input-radius: ${inputStyle.radius};

  /* Motion */
  --ease-default: ${safeDs.animation.easing};
  --duration-normal: ${safeDs.animation.duration.normal};
}`}
             </pre>
        </section>

        {/* Footer info */}
        <div className="pt-8 text-center text-xs opacity-40 font-mono">
          Generated via Gemini API • Viewing {mode.toUpperCase()} Mode
        </div>

      </div>
    </div>
  );
};