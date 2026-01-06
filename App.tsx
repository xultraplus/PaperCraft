import React, { useState, useRef, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import PaperCanvas from './components/PaperCanvas';
import TemplateModal from './components/TemplateModal';
import GuideModal from './components/GuideModal';
import { DEFAULT_CONFIG, PAPER_DIMENSIONS } from './constants';
import { PaperConfig, PaperSize } from './types';
import { Printer, BookTemplate, HelpCircle, FileDown, Download, ChevronDown, Image as ImageIcon, FileText, Languages } from 'lucide-react';
import { jsPDF } from "jspdf";
import { TRANSLATIONS, LangType } from './translations';

function App() {
  const [config, setConfig] = useState<PaperConfig>(DEFAULT_CONFIG);
  const [isTemplateModalOpen, setTemplateModalOpen] = useState(false);
  const [isGuideModalOpen, setGuideModalOpen] = useState(false);
  const [isExportMenuOpen, setExportMenuOpen] = useState(false);
  const [lang, setLang] = useState<LangType>('zh'); // Default to Chinese
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Translation helper
  const t = (key: string) => {
    // @ts-ignore
    return TRANSLATIONS[lang][key] || key;
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setExportMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async (format: 'png' | 'jpg' | 'pdf') => {
    setExportMenuOpen(false);
    
    // Find the first SVG element for image export, or loop for PDF
    const svgs = document.querySelectorAll('.print-container svg');
    if (!svgs.length) {
      alert("Could not find paper to export.");
      return;
    }

    // Get dimensions in mm
    let dim = PAPER_DIMENSIONS[config.size as Exclude<PaperSize, 'custom'>];
    if (config.size === 'custom' && config.customDimensions) {
       dim = config.customDimensions;
    }
    if (!dim) dim = PAPER_DIMENSIONS['A4']; // Fallback

    const widthMm = config.orientation === 'portrait' ? dim.width : dim.height;
    const heightMm = config.orientation === 'portrait' ? dim.height : dim.width;

    // High resolution for print (300 DPI)
    const dpi = 300;
    const pixelsPerMm = dpi / 25.4;
    const widthPx = Math.ceil(widthMm * pixelsPerMm);
    const heightPx = Math.ceil(heightMm * pixelsPerMm);

    if (format === 'pdf') {
         const pdf = new jsPDF({
            orientation: config.orientation,
            unit: 'mm',
            format: [widthMm, heightMm]
         });

         const serializer = new XMLSerializer();

         for (let i = 0; i < svgs.length; i++) {
             const svgElement = svgs[i] as SVGSVGElement;
             const svgString = serializer.serializeToString(svgElement);
             const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
             const url = URL.createObjectURL(svgBlob);

             await new Promise<void>((resolve) => {
                 const img = new Image();
                 img.onload = () => {
                     const canvas = document.createElement('canvas');
                     canvas.width = widthPx;
                     canvas.height = heightPx;
                     const ctx = canvas.getContext('2d');
                     if (ctx) {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, widthPx, heightPx);
                        ctx.drawImage(img, 0, 0, widthPx, heightPx);
                        const imgData = canvas.toDataURL('image/png');
                        
                        if (i > 0) pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, 0, widthMm, heightMm);
                     }
                     URL.revokeObjectURL(url);
                     resolve();
                 };
                 img.src = url;
             });
         }
         pdf.save(`${config.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);

    } else {
        // For images, we just export the first page for now
        const svgElement = svgs[0] as SVGSVGElement;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = widthPx;
            canvas.height = heightPx;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, widthPx, heightPx);
            ctx.drawImage(img, 0, 0, widthPx, heightPx);

            const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
            const link = document.createElement('a');
            link.download = `${config.name.toLowerCase().replace(/\s+/g, '-')}-page1.${format}`;
            link.href = canvas.toDataURL(mimeType, 0.95);
            link.click();
            URL.revokeObjectURL(url);
        };
        img.src = url;
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'zh' ? 'en' : 'zh');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-100">
      
      {/* Header - Hidden on Print */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20 flex-shrink-0 no-print">
        <div className="flex items-center gap-2">
           <div className="bg-blue-600 p-1.5 rounded text-white">
             <FileDown className="w-5 h-5" />
           </div>
           <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t('appTitle')}</h1>
        </div>

        <div className="flex items-center space-x-3">
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Switch Language"
          >
            <Languages className="w-4 h-4 mr-2" />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>

          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          <button 
            onClick={() => setGuideModalOpen(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            {t('guide')}
          </button>
          
          <button 
            onClick={() => setTemplateModalOpen(true)}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <BookTemplate className="w-4 h-4 mr-2" />
            {t('templates')}
          </button>
          
          <div className="h-6 w-px bg-gray-300 mx-2"></div>

          {/* Export Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setExportMenuOpen(!isExportMenuOpen)}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download')}
              <ChevronDown className={`w-3 h-3 ml-2 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('png')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <ImageIcon className="w-4 h-4 mr-3 text-blue-500" />
                    {t('downloadPng')}
                  </button>
                  <button
                    onClick={() => handleExport('jpg')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <ImageIcon className="w-4 h-4 mr-3 text-green-500" />
                    {t('downloadJpg')}
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <FileText className="w-4 h-4 mr-3 text-red-500" />
                    {t('downloadPdf')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all active:scale-95"
          >
            <Printer className="w-4 h-4 mr-2" />
            {t('print')}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Controls - Hidden on Print */}
        <div className="w-80 flex-shrink-0 h-full bg-white border-r border-gray-200 z-10 no-print overflow-hidden">
          <ControlPanel config={config} onChange={setConfig} t={t} />
        </div>

        {/* Preview Area */}
        <main className="flex-1 overflow-auto bg-gray-100/50 p-8 flex flex-col items-center justify-start gap-8">
           {/* Render pages based on page count */}
           {Array.from({ length: config.pages?.count || 1 }).map((_, index) => (
               <div key={index} className="">
                 <PaperCanvas config={config} pageNumber={index + 1} />
               </div>
           ))}
        </main>

      </div>

      {/* Modals */}
      <TemplateModal 
        isOpen={isTemplateModalOpen} 
        onClose={() => setTemplateModalOpen(false)} 
        onSelect={(newConfig) => setConfig({ ...newConfig, id: `custom-${Date.now()}` })}
        currentId={config.id}
        t={t}
      />

      <GuideModal 
        isOpen={isGuideModalOpen} 
        onClose={() => setGuideModalOpen(false)} 
        t={t}
      />
    </div>
  );
}

export default App;