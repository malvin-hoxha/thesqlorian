import React, { useRef } from 'react'
import { useDialogFocus } from '../lib/useDialogFocus';

const Credits = ({onClick}) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  useDialogFocus(dialogRef, closeButtonRef, { onEscape: onClick });

  return (
    <div className="fixed bg-black/50 backdrop-blur-sm inset-0 z-51">
        <div className="inset-0 min-h-lvh flex items-center justify-center z-49">
        <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="credits-dialog-title"
            tabIndex="-1"
            className="bg-gradient-to-br from-zinc-800 to-zinc-900 text-white p-8 rounded-3xl shadow-2xl max-w-xl w-full border border-zinc-700"
        >
            <h2 id="credits-dialog-title" className="text-3xl font-extrabold text-amber-400 tracking-wide mb-4">Credits</h2>

            <ul className="list-disc list-inside space-y-2 text-lg text-zinc-200">
                <li>
                    Created by{' '}
                    <a
                        href="https://github.com/malvin-hoxha"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-amber-300 hover:text-amber-200 underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                    >
                        Malvin Hoxha
                    </a>
                </li>
                <li>
                    <span className="text-amber-300">Music</span> by Luis Humanoide from Pixabay
                </li>
            </ul>

            <div className="flex justify-end mt-6">
                <button
                    ref={closeButtonRef}
                    onClick={onClick}
                    className="bg-amber-500 text-black px-6 py-2 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-200 shadow-md cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                    Close
                </button>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Credits
