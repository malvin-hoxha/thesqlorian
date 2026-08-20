import React, { useRef } from 'react';
import mnemaImage from '/mnema.png';
import { useDialogFocus } from '../lib/useDialogFocus';

const QuestsDialogues = ({ tasks, onContinue }) => {
  const dialogRef = useRef(null);
  const buttonRef = useRef(null);
  useDialogFocus(dialogRef, buttonRef);

  return (
    <div className='fixed bg-black/50 backdrop-blur-sm inset-0 z-50'>
      <div className="inset-0 min-h-lvh flex items-center justify-center z-49">
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quest-dialog-title"
          tabIndex="-1"
          className="bg-zinc-900 border border-red-600 rounded-3xl shadow-xl p-8 max-w-xl w-full text-center space-y-4"
        >
          <h2 id="quest-dialog-title" className="sr-only">Quest briefing</h2>
          <div className='flex items-center justify-center gap-4'>
            <img src={mnemaImage} alt="Mnema" className="w-10" />
            <p className="text-lg font-light text-amber-100 italic">
              "{tasks.hint}"
            </p>
          </div>
          <button
            ref={buttonRef}
            onClick={onContinue}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestsDialogues;
