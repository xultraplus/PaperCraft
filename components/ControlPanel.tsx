import React, { useRef } from 'react';
import { PaperConfig, PaperSize, PatternType, Orientation, BackgroundPatternType, LineStyle } from '../types';
import { TEMPLATES, DEFAULT_CONFIG, THEME_PRESETS } from '../constants';
import { 
  Settings2, Layout, Ruler, Palette, FileText, Grid, Save, 
  Download, Upload, Type, Droplet, Hash, CheckSquare, Square
} from 'lucide-react';

interface ControlPanelProps {
  config: PaperConfig;
  onChange: (newConfig: PaperConfig) => void;
  t: (key: string) => string;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange, t }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateConfig = (key: keyof PaperConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const updateCustomDimensions = (dimKey: 'width' | 'height', value: number) => {
    onChange({
      ...config,
      customDimensions: {
        ...config.customDimensions || { width: 210, height: 297 },
        [dimKey]: value
      }
    });
  };

  const updateBackground = (key: keyof typeof config.background, value: any) => {
    onChange({
      ...config,
      background: { ...config.background, [key]: value }
    });
  };

  const updateWatermark = (key: keyof typeof config.watermark, value: any) => {
    onChange({
      ...config,
      watermark: { ...config.watermark, [key]: value }
    });
  };

  const updatePages = (key: keyof typeof config.pages, value: any) => {
    onChange({
      ...config,
      pages: { ...config.pages, [key]: value }
    });
  };

  const updateMargin = (side: keyof typeof config.margins, value: number) => {
    onChange({
      ...config,
      margins: { ...config.margins, [side]: value }
    });
  };

  // Helper to apply a preset template but keep the ID unique
  const applyTemplate = (templateId: string) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
       onChange({
         ...template,
         id: config.id, 
       });
    }
  };

  // Apply theme
  const handleThemeChange = (themeKey: string) => {
    const preset = THEME_PRESETS[themeKey];
    if (preset) {
        onChange({
            ...config,
            theme: themeKey,
            strokeColor: preset.strokeColor,
            background: {
                ...config.background,
                color: preset.bgColor,
                patternColor: preset.patternColor,
            }
        });
    }
  };

  const handleSave = () => {
    const name = prompt(t('enterTemplateName'), config.name);
    if (!name) return;
    
    const newTemplate: PaperConfig = {
      ...config,
      id: `saved-${Date.now()}`,
      name: name.trim()
    };
    
    try {
      const existing = localStorage.getItem('papercraft_saved_configs');
      const saved: PaperConfig[] = existing ? JSON.parse(existing) : [];
      saved.push(newTemplate);
      localStorage.setItem('papercraft_saved_configs', JSON.stringify(saved));
      alert(t('saveSuccess'));
    } catch (e) {
      alert(t('saveFail'));
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const date = new Date().toISOString().split('T')[0];
    downloadAnchorNode.setAttribute("download", `paper-settings-${date}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const content = e.target?.result;
            if (typeof content === 'string') {
                const importedConfig = JSON.parse(content);
                if (importedConfig.pattern && importedConfig.margins && importedConfig.size) {
                     const mergedConfig = {
                       ...DEFAULT_CONFIG,
                       ...importedConfig,
                       background: { ...DEFAULT_CONFIG.background, ...(importedConfig.background || {}) },
                       watermark: { ...DEFAULT_CONFIG.watermark, ...(importedConfig.watermark || {}) },
                       pages: { ...DEFAULT_CONFIG.pages, ...(importedConfig.pages || {}) },
                       id: `imported-${Date.now()}`
                     };
                     onChange(mergedConfig);
                     alert(t('importSuccess'));
                } else {
                    alert(t('importFail'));
                }
            }
        } catch (error) {
            alert(t('importFail'));
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(fileObj);
  };

  // Find current template match or default
  const currentTemplateId = TEMPLATES.find(t => t.name === config.name)?.id || 'custom';

  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-6 bg-white border-r border-gray-200">
      
      {/* 📄 Paper Type */}
      <div className="space-y-3">
        <h3 className="flex items-center text-sm font-semibold text-blue-600">
          <FileText className="w-4 h-4 mr-2" /> {t('paperType')}
        </h3>
        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('paperTemplate')}</label>
           <select 
             value={currentTemplateId}
             onChange={(e) => applyTemplate(e.target.value)}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           >
              <option value="custom" disabled>{t('customSelection')}</option>
              {TEMPLATES.map(tmp => (
                <option key={tmp.id} value={tmp.id}>{t(tmp.name) || tmp.name}</option>
              ))}
           </select>
        </div>
      </div>

      {/* 📏 Paper Size */}
      <div className="space-y-3">
        <h3 className="flex items-center text-sm font-semibold text-purple-600">
          <Layout className="w-4 h-4 mr-2" /> {t('paperSize')}
        </h3>
        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('size')}</label>
           <select 
             value={config.size}
             onChange={(e) => updateConfig('size', e.target.value)}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           >
              {['A4', 'A5', 'A3', 'B4', 'B5', 'Letter', 'Legal', 'Tabloid', 'Executive', 'custom'].map(s => (
                <option key={s} value={s}>{t(s)}</option>
              ))}
           </select>
        </div>
        
        {config.size === 'custom' && (
           <div className="grid grid-cols-2 gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
              <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('width')} (mm)</label>
                  <input 
                    type="number"
                    value={config.customDimensions?.width || 210}
                    onChange={(e) => updateCustomDimensions('width', parseFloat(e.target.value))}
                    className="w-full text-sm border-gray-300 rounded shadow-sm p-1.5 border"
                  />
              </div>
              <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t('height')} (mm)</label>
                  <input 
                    type="number"
                    value={config.customDimensions?.height || 297}
                    onChange={(e) => updateCustomDimensions('height', parseFloat(e.target.value))}
                    className="w-full text-sm border-gray-300 rounded shadow-sm p-1.5 border"
                  />
              </div>
           </div>
        )}

        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('orientation')}</label>
           <div className="flex bg-gray-100 p-1 rounded-lg">
             {(['portrait', 'landscape'] as Orientation[]).map((o) => (
               <button
                 key={o}
                 onClick={() => updateConfig('orientation', o)}
                 className={`flex-1 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                   config.orientation === o ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                 }`}
               >
                 {t(o)}
               </button>
             ))}
           </div>
        </div>
      </div>

      {/* 🎨 Theme */}
      <div className="space-y-3">
        <h3 className="flex items-center text-sm font-semibold text-pink-600">
          <Palette className="w-4 h-4 mr-2" /> {t('theme')}
        </h3>
        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('theme')}</label>
           <select 
             value={config.theme || 'default'}
             onChange={(e) => handleThemeChange(e.target.value)}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           >
              <option value="default">{t('default')}</option>
              <option value="night">{t('night')}</option>
              <option value="sepia">{t('sepia')}</option>
              <option value="vintage">{t('vintage')}</option>
              <option value="pastel">{t('pastel')}</option>
              <option value="classic">{t('classic')}</option>
              <option disabled>---- {t('newThemes') || '新增主题'} ----</option>
              <option value="minimalist">{t('minimalist')}</option>
              <option value="ocean">{t('ocean')}</option>
              <option value="forest">{t('forest')}</option>
              <option value="sunset">{t('sunset')}</option>
              <option value="tech">{t('tech')}</option>
              <option value="elegant">{t('elegant')}</option>
              <option value="creative">{t('creative')}</option>
           </select>
        </div>
      </div>

      {/* ✏️ Line Settings */}
      {config.pattern !== 'blank' && (
      <div className="space-y-3">
        <h3 className="flex items-center text-sm font-semibold text-indigo-600">
          <Settings2 className="w-4 h-4 mr-2" /> {t('lineSettings')}
        </h3>
        
        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('lineColor')}</label>
           <div className="flex gap-2 items-center">
             <input 
                type="color" 
                value={config.strokeColor}
                onChange={(e) => updateConfig('strokeColor', e.target.value)}
                className="h-9 w-full rounded cursor-pointer border p-1"
             />
           </div>
        </div>

        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('lineStyle')}</label>
           <select 
             value={config.lineStyle || 'solid'}
             onChange={(e) => updateConfig('lineStyle', e.target.value)}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           >
              <option value="solid">{t('solid')}</option>
              <option value="dashed">{t('dashed')}</option>
              <option value="dotted">{t('dotted')}</option>
           </select>
        </div>

        <div>
           <div className="flex justify-between">
             <label className="text-xs text-gray-500 mb-1 block">{t('spacing')}</label>
             <button 
                onClick={() => updateConfig('spacing', 10)}
                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 hover:bg-blue-100"
             >
                {t('recommended')}
             </button>
           </div>
           <input 
             type="number"
             value={config.spacing}
             onChange={(e) => updateConfig('spacing', parseFloat(e.target.value))}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           />
           {config.pattern === 'pinyin' && <p className="text-[10px] text-red-500 mt-1">{t('pinyinRecommended')}</p>}
        </div>

        <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('lineWeight')}</label>
           <input 
             type="number"
             step="0.1"
             value={config.strokeWidth}
             onChange={(e) => updateConfig('strokeWidth', parseFloat(e.target.value))}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           />
        </div>
      </div>
      )}

      {/* 📐 Margins */}
      <div className="space-y-3">
         <h3 className="flex items-center text-sm font-semibold text-green-600">
            <Ruler className="w-4 h-4 mr-2" /> {t('margins')}
         </h3>
         <div className="grid grid-cols-2 gap-3">
            {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
               <div key={side}>
                 <input 
                   type="number" 
                   value={config.margins[side]}
                   onChange={(e) => updateMargin(side, Number(e.target.value))}
                   className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                   placeholder={t(side)}
                 />
               </div>
            ))}
         </div>
         <label className="flex items-center text-xs text-gray-500 cursor-pointer">
             <input 
               type="checkbox"
               checked={config.showMarginBox}
               onChange={(e) => updateConfig('showMarginBox', e.target.checked)}
               className="mr-2 rounded text-blue-600"
             />
             {t('showMarginGuides')}
         </label>
      </div>

      {/* 🖼️ Background */}
      <div className="space-y-3">
         <h3 className="flex items-center text-sm font-semibold text-orange-500">
            <Palette className="w-4 h-4 mr-2" /> {t('backgroundSettings')}
         </h3>
         
         <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('backgroundColor')}</label>
           <div className="flex gap-2">
              <input 
                 type="color"
                 value={config.background?.color || '#ffffff'}
                 onChange={(e) => updateBackground('color', e.target.value)}
                 className="h-8 w-12 rounded border p-0 cursor-pointer"
              />
              <div className="flex-1 flex gap-1">
                 {['#ffffff', '#f8fafc', '#fffbeb', '#f0fdf4', '#eff6ff'].map(c => (
                    <button 
                      key={c}
                      onClick={() => updateBackground('color', c)}
                      className={`w-8 h-8 rounded border ${config.background?.color === c ? 'ring-2 ring-blue-500' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                 ))}
              </div>
           </div>
         </div>

         <div>
           <label className="text-xs text-gray-500 mb-1 block">{t('texture')}</label>
           <select 
             value={config.background?.pattern || 'none'}
             onChange={(e) => updateBackground('pattern', e.target.value)}
             className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
           >
              <option value="none">{t('noTexture')}</option>
              <option value="grid">{t('gridTexture')}</option>
              <option value="dots">{t('dotTexture')}</option>
              <option value="lines">{t('lineTexture')}</option>
           </select>
         </div>
      </div>

      {/* 💧 Watermark */}
      <div className="space-y-3">
         <h3 className="flex items-center text-sm font-semibold text-red-500">
            <Droplet className="w-4 h-4 mr-2" /> {t('watermark')}
         </h3>
         
         <label className="flex items-center text-sm text-gray-700 font-medium cursor-pointer">
             <input 
               type="checkbox"
               checked={config.watermark?.enabled || false}
               onChange={(e) => updateWatermark('enabled', e.target.checked)}
               className="mr-2 rounded text-blue-600"
             />
             {t('enableWatermark')}
         </label>

         {config.watermark?.enabled && (
           <div className="pl-6 space-y-2">
             <input 
               type="text"
               value={config.watermark.text}
               onChange={(e) => updateWatermark('text', e.target.value)}
               className="w-full text-sm border p-2 rounded"
               placeholder={t('watermarkPlaceholder')}
             />
             <div className="flex gap-2">
                <input 
                  type="color"
                  value={config.watermark.color}
                  onChange={(e) => updateWatermark('color', e.target.value)}
                  className="h-8 w-12 rounded border p-0 cursor-pointer"
                />
                <input 
                   type="range"
                   min="0" max="1" step="0.1"
                   value={config.watermark.opacity}
                   onChange={(e) => updateWatermark('opacity', parseFloat(e.target.value))}
                   className="flex-1"
                />
             </div>
           </div>
         )}
      </div>

      {/* 📄 Page Settings */}
      <div className="space-y-3">
         <h3 className="flex items-center text-sm font-semibold text-teal-600">
            <FileText className="w-4 h-4 mr-2" /> {t('pageSettings')}
         </h3>
         
         <div>
            <label className="text-xs text-gray-500 mb-1 block">{t('pageCount')}</label>
            <input 
               type="number"
               min="1" max="100"
               value={config.pages?.count || 1}
               onChange={(e) => updatePages('count', parseInt(e.target.value))}
               className="w-full text-sm border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            />
         </div>
         
         <label className="flex items-center text-sm text-gray-700 cursor-pointer">
             <input 
               type="checkbox"
               checked={config.pages?.showNumbers || false}
               onChange={(e) => updatePages('showNumbers', e.target.checked)}
               className="mr-2 rounded text-blue-600"
             />
             {t('showPageNumbers')}
         </label>
      </div>

      <div className="pt-4 space-y-2 border-t mt-4">
         <button onClick={handleSave} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" /> {t('saveToBrowser')}
         </button>
         <div className="grid grid-cols-2 gap-2">
            <button onClick={handleExportJson} className="py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center text-gray-600">
               <Download className="w-4 h-4 mr-2" /> {t('export')}
            </button>
            <button onClick={handleImportClick} className="py-2 border rounded-lg hover:bg-gray-50 text-sm flex items-center justify-center text-gray-600">
               <Upload className="w-4 h-4 mr-2" /> {t('import')}
            </button>
         </div>
         <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
      </div>

    </div>
  );
};

export default ControlPanel;