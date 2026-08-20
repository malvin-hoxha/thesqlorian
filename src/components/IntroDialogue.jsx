import { dialogues } from '../data/data';
import meroxImage from '/merox.png';
import mnemaImage from '/mnema.png';
import { useState, useRef } from 'react';
import { useDialogFocus } from '../lib/useDialogFocus';
new Image().src = meroxImage;
new Image().src = mnemaImage;

const IntroDialogue = ({onFinish}) => {
    const dialogRef = useRef(null);
    const buttonRef = useRef(null);
    useDialogFocus(dialogRef, buttonRef);

    const [step, setStep] = useState(0);
    const current = dialogues[step];

    const handleContinue = () => {
        if (step < dialogues.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
      };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-5">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="intro-dialog-title"
                tabIndex="-1"
                className="bg-zinc-900 border border-red-600 rounded-3xl shadow-xl p-8 max-w-xl w-full text-center space-y-4"
            >
                <h2 id="intro-dialog-title" className="sr-only">Story introduction</h2>
                <div className={`flex items-center justify-center
                        ${current.speaker === 'mnema' ? 'flex-row-reverse' : ''} gap-4`}>
                    <img
                        src={current.speaker === "merox" ? meroxImage : mnemaImage}
                        alt={current.speaker === "merox" ? "Custodian Merox" : "Mnema"}
                        className="w-20"
                    />
                    <p className="text-lg font-light text-amber-100 italic">
                        "{current.text}"
                    </p>
                </div>
                <button
                    ref={buttonRef}
                    onClick={handleContinue}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                >
                    Continue
                </button>
            </div>
        </div>
  )
}



export default IntroDialogue;
