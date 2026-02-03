import React, { useState, useCallback, useRef } from 'react';
import { generateProjectManifest } from './services/geminiService';
import { ProjectManifest } from './types';
import { ProjectBlueprint } from './components/ProjectBlueprint';
import { generateMarkdown, downloadMarkdown } from './utils/markdownGenerator';
import { Loader2, Download, Wand2, Sparkles, AlertCircle, Mic, Image as ImageIcon, X } from 'lucide-react';

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manifest, setManifest] = useState<ProjectManifest | null>(null);
  
  // New features state
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !selectedImage) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateProjectManifest(prompt, selectedImage || undefined);
      setManifest(data);
    } catch (err) {
      console.error(err);
      setError("Failed to generate project manifest. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!manifest) return;
    // We map the manifest back to the simple DesignSystem type for the markdown generator for now,
    // or ideally update markdown generator to handle full manifest. 
    // For this step, we'll download the JSON manifest as it's more valuable for this 'Fractal' edition.
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.project.id || 'project'}-manifest.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }, [manifest]);

  // Voice Input Logic
  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => (prev ? prev + ' ' + transcript : transcript));
    };

    recognition.start();
  };

  // Image Upload Logic
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500 selection:text-white pb-20">
      
      {/* Header / Input Section */}
      <header className="pt-16 pb-12 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-blue-400 mb-6 shadow-glow">
          <Sparkles size={14} />
          <span>Fractal Engine v7.0 • Powered by Gemini</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-gradient-to-br from-white via-neutral-200 to-neutral-600 bg-clip-text text-transparent">
          Project Foundry
        </h1>
        
        <p className="text-xl text-neutral-400 mb-10 leading-relaxed max-w-2xl mx-auto">
          Transformez une idée en une spécification technique complète : Architecture, Design System, Stratégie Growth et SEO.
        </p>

        <form onSubmit={handleGenerate} className="relative group max-w-2xl mx-auto">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative flex flex-col gap-4 bg-neutral-950 p-4 rounded-xl border border-neutral-800 shadow-2xl">
            
            {/* Image Preview Area */}
            {selectedImage && (
              <div className="relative w-full h-32 bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center border border-dashed border-neutral-700 group/image">
                <img src={selectedImage} alt="Reference" className="h-full object-contain" />
                <button 
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                >
                  <X size={14} />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-1 rounded text-blue-400 font-mono border border-blue-500/30">
                  ASSIMILATION_MODE::ACTIVE
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Plateforme SaaS pour gestion de flotte de drones..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-4 pr-24 text-lg placeholder-neutral-600 text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
                  disabled={loading}
                />
                
                {/* Input Actions (Voice + Image) */}
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   {isListening && (
                      <span className="text-xs text-red-400 font-mono animate-pulse hidden sm:inline-block">
                        REC
                      </span>
                   )}
                  <button
                    type="button"
                    onClick={toggleVoiceInput}
                    className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                    title="Dictée vocale"
                  >
                    <Mic size={18} />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-2 rounded-full transition-all ${selectedImage ? 'text-blue-400 bg-blue-400/10' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}
                    title="Ajouter une image de référence"
                  >
                    <ImageIcon size={18} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || (!prompt.trim() && !selectedImage)}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-bold px-8 py-4 rounded-lg transition-all flex items-center justify-center gap-2 min-w-[140px] shadow-lg shadow-blue-900/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : (
                  <>
                    <Wand2 size={20} />
                    Build
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-lg text-red-400 flex items-center justify-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="px-4 md:px-8">
        
        {/* Results Area */}
        {manifest && (
          <>
            <div className="max-w-7xl mx-auto mb-6 flex justify-end">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 px-4 py-2 rounded-md border border-neutral-800 transition-colors text-xs font-mono uppercase tracking-wider"
              >
                <Download size={14} />
                Download Manifest (.json)
              </button>
            </div>

            <ProjectBlueprint manifest={manifest} />
          </>
        )}

      </main>
    </div>
  );
};

export default App;
