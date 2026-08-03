import { dialogues } from '../data/data';
import darthVader from '/darth-vader.svg';
import yoda from '/yoda.svg';
import { useState, useRef, useEffect } from 'react';
new Image().src = darthVader;
new Image().src = yoda;

const IntroDialogue = ({onFinish}) => {
    const buttonRef = useRef(null);
    
    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.focus();
        }
    }, []);

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
            <div className="bg-zinc-900 border border-red-600 rounded-3xl shadow-xl p-8 max-w-xl w-full text-center space-y-4">
                <div className={`flex items-center justify-center
                        ${current.speaker === 'yoda' ? 'flex-row-reverse' : ''} gap-4`}>
                    <img
                        src={current.speaker === "vader" ? darthVader : yoda}
                        alt={current.speaker}
                        className="w-20"
                    />
                    <p className="text-lg font-light text-amber-100 italic">
                        "{current.text}"
                    </p>
                </div>
                <button
                    ref={buttonRef}
                    onClick={handleContinue}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-xl shadow-lg hover:bg-red-700 transition-all duration-200 cursor-pointer"
                >
                    Continue
                </button>
            </div>
        </div>
  )
}



export default IntroDialogue;