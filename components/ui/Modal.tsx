'use client';

import React from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  variant?: 'danger' | 'primary' | 'warning';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'primary',
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F2DED4] relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#F5E5DC]">
          <div>
            <h3 className="text-lg font-bold text-[#29201D]">{title}</h3>
            {description && <p className="text-xs text-[#89817D] mt-1">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#89817D] hover:text-[#29201D] rounded-full hover:bg-[#FFF7F1] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4">{children}</div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F5E5DC]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#89817D] hover:text-[#29201D] rounded-xl hover:bg-[#FFF7F1] transition-colors"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-5 py-2 text-xs font-bold rounded-xl text-white transition-all shadow-sm ${
                variant === 'danger'
                  ? 'bg-[#EF4444] hover:bg-[#DC2626]'
                  : variant === 'warning'
                  ? 'bg-[#F59E0B] hover:bg-[#D97706]'
                  : 'bg-[#E77B52] hover:bg-[#D3683E]'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
