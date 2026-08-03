import { outroDialogues } from '../data/data';
import darthVader from '/darth-vader.svg';
import yoda from '/yoda.svg';
import { useState, useRef, useEffect } from 'react';
new Image().src = darthVader;
new Image().src = yoda;

const OutroDialogue = ({onClose}) => {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    if (buttonRef.current) {
        buttonRef.current.focus();
    }
  }, []);

  const [step, setStep] = useState(0);
  const [finishedButton, setFinishedButton] = useState(0);
  const current = outroDialogues[step];

  const handleContinue = () => {
    const isLastStep = step === outroDialogues.length - 1;
  
    if (!isLastStep) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === outroDialogues.length - 1) {
        setFinishedButton(true);
      }
    } else {
      onClose();
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
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 cursor-pointer"
        >
          {!finishedButton ? 'Continue' : 'Finish'}
        </button>
      </div>
    </div>
  )
}

export default OutroDialogue;