import { Trash2, X } from "lucide-react";
import { Button } from "./ui/button";




export default function DeleteConfirmationPopup({ 
  isOpen, 
  onClose, 
  onConfirm,
  t 
}: { 
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  t: (key: string) => string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-background  rounded-lg shadow-xl w-full max-w-md animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div dir="ltr" className="w-full flex items-center justify-between p-4 border-b">
          <button
            onClick={onClose}
            className="p-1 hover:bg-text-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 " />
          </button>
          <h3 className="text-lg font-semibold w-full  text-right  ">
              {t('confirmDeleteTitle')}
          </h3>
          <div className="w-6" /> 
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className=" p-3 rounded-full">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h4 className="text-lg font-medium  text-center mb-2">
            {t('deleteAll') || 'حذف جميع العناصر'}
          </h4>
          
          <p className="opacity-70 text-center text-sm mb-6">
            {t('confirmDeleteAllMessage') || 'هل أنت متأكد أنك تريد حذف جميع العناصر من سلة التسوق؟ لا يمكن التراجع عن هذا الإجراء.'}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-300 "
            >
                {t('cancel')}
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
                {t('delete')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}