import React, { useState, useEffect } from 'react';
import { TEMPLATES } from '../constants';
import { PaperConfig } from '../types';
import { X, Check, Library, Save, Trash2 } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: PaperConfig) => void;
  currentId: string;
  t: (key: string) => string;
}

const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose, onSelect, currentId, t }) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'saved'>('presets');
  const [savedTemplates, setSavedTemplates] = useState<PaperConfig[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadSaved();
    }
  }, [isOpen]);

  const loadSaved = () => {
    try {
      const raw = localStorage.getItem('papercraft_saved_configs');
      if (raw) {
        setSavedTemplates(JSON.parse(raw));
      } else {
        setSavedTemplates([]);
      }
    } catch (e) {
      console.error('Failed to load saved templates', e);
      setSavedTemplates([]);
    }
  };

  const deleteSaved = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm(t('deleteConfirm'))) return;
    
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('papercraft_saved_configs', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const listToRender = activeTab === 'presets' ? TEMPLATES : savedTemplates;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{t('selectTemplate')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => setActiveTab('presets')} 
            className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'presets' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <Library className="w-4 h-4" /> {t('standardLibrary')}
          </button>
          <button 
            onClick={() => setActiveTab('saved')} 
            className={`flex-1 p-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'saved' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
             <Save className="w-4 h-4" /> {t('mySaved')}
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1 bg-gray-50/30">
          {listToRender.length === 0 && activeTab === 'saved' ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 text-gray-400">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                 <Save className="w-8 h-8 text-gray-300" />
               </div>
               <p className="text-lg font-medium text-gray-600">{t('noSavedTemplates')}</p>
               <p className="text-sm mt-1 max-w-xs">{t('noSavedTemplatesDesc')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listToRender.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template);
                    onClose();
                  }}
                  className={`relative group flex flex-col border-2 rounded-xl overflow-hidden transition-all hover:shadow-md text-left bg-white ${
                    currentId === template.id ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-400'
                  }`}
                >
                  <div className="h-32 bg-gray-50 border-b flex items-center justify-center p-4">
                      {/* Mini Preview Mock */}
                      <div className="w-20 h-28 bg-white shadow border border-gray-200 relative overflow-hidden">
                         <div className="absolute inset-0 opacity-50">
                           {template.pattern === 'lined' && <div className="w-full h-full" style={{ background: `repeating-linear-gradient(transparent, transparent ${template.spacing - 0.5}px, #000 ${template.spacing - 0.5}px, #000 ${template.spacing}px)`}}></div>}
                           {template.pattern === 'grid' && <div className="w-full h-full" style={{ backgroundSize: `${template.spacing}px ${template.spacing}px`, backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)'}}></div>}
                           {template.pattern === 'dot' && <div className="w-full h-full" style={{ backgroundSize: `${template.spacing}px ${template.spacing}px`, backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)'}}></div>}
                           {template.pattern === 'isometric' && <div className="w-full h-full" style={{ backgroundSize: `${template.spacing}px ${template.spacing}px`, backgroundImage: 'radial-gradient(circle, #ccc 1px, transparent 1px)', transform: 'skewX(30deg)'}}></div>}
                           {template.pattern === 'cross' && <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300">+</div>}
                         </div>
                      </div>
                  </div>
                  <div className="p-4">
                     <div className="flex justify-between items-start">
                       <div>
                         <h3 className="font-semibold text-gray-900">{t(template.name) || template.name}</h3>
                         <p className="text-xs text-gray-500 mt-1 capitalize">{template.pattern} • {template.spacing}mm</p>
                       </div>
                       <div className="flex gap-2">
                        {activeTab === 'saved' && (
                           <div
                             role="button"
                             onClick={(e) => deleteSaved(e, template.id)}
                             className="p-1.5 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                             title="Delete template"
                           >
                             <Trash2 className="w-4 h-4" />
                           </div>
                        )}
                        {currentId === template.id && <Check className="w-5 h-5 text-blue-600" />}
                       </div>
                     </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 border-t text-right rounded-b-xl">
           <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
             {t('cancel')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;