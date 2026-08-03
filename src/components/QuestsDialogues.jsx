import React, { useEffect, useRef } from 'react';
import yoda from '/yoda.svg';

const QuestsDialogues = ({ tasks, onContinue }) => {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  return (
    <main className='fixed bg-black/50 backdrop-blur-sm inset-0 z-50'>
      <div className="inset-0 min-h-lvh flex items-center justify-center z-49">
        <div className="bg-zinc-900 border border-red-600 rounded-3xl shadow-xl p-8 max-w-xl w-full text-center space-y-4">
          <div className='flex items-center justify-center gap-4'>
            <img src={yoda} alt="yoda" className="w-10" />
            <p className="text-lg font-light text-amber-100 italic">
              "{tasks.hint}"
            </p>
          </div>
          <button
            ref={buttonRef}
            onClick={onContinue}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-200 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
};

export default QuestsDialogues;
