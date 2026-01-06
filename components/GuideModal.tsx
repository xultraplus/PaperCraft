import React from 'react';
import { X, Printer, Settings, Layers } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">{t('howToUse')}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-8 space-y-8">
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
               <Layers className="w-6 h-6 text-blue-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step1Title')}</h3>
               <p className="text-gray-600">{t('step1Desc')}</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
               <Settings className="w-6 h-6 text-green-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step2Title')}</h3>
               <p className="text-gray-600">{t('step2Desc')}</p>
             </div>
          </div>

          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
               <Printer className="w-6 h-6 text-purple-600" />
             </div>
             <div>
               <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step3Title')}</h3>
               <p className="text-gray-600">{t('step3Desc')}</p>
             </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end">
           <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
             {t('gotIt')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default GuideModal;