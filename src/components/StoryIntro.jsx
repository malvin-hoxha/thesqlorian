import { useState, useEffect, useRef } from "react";
import table from "../data/table";
import data from "../data/data";
import pause_icon from '../assets/pause_icon.png';
import play_icon from '../assets/play_icon.png';

import IntroDialogue from "./IntroDialogue";
import RightAside from "./RightAside";
import LeftAside from "./LeftAside";
import QuestsDialogues from "./QuestsDialogues";
import OutroDialogue from "./OutroDialogue";

import Credits from "./Credits";

const StoryIntro = () => {
  const [showStory, setShowStory] = useState(() => {
    const hasSeenStory = localStorage.getItem('hasSeenStory');
    return hasSeenStory ? false : true;
  });

  const [showOutro, setShowOutro] = useState(false);

  const [tableIndex, setTableIndex] = useState(0);
  const [showQuestDialogue, setShowQuestDialogue] = useState(true);
  const tasks = data[tableIndex];  
  const [showCredits, setShowCredits] = useState(false);
  const [gameResetTrigger, setGameResetTrigger] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const ChangePage = (direction) => {
    setTableIndex(prevIndex => {
      if (direction === 'next') return prevIndex < data.length - 1 ? prevIndex + 1 : prevIndex;
      else if (direction === 'previous') return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      return prevIndex;
    });
    setShowQuestDialogue(true);
  }

  useEffect(() => {
    if (gameResetTrigger) {
      setShowStory(false);
    }
  }, [gameResetTrigger]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
  
    setIsPlaying((prev) => {
      if (prev) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      return !prev;
    });
  };
  

  return (
    <section className="w-full min-h-screen bg-gradient-to-b text-white bg-black/50 backdrop-blur-sm">
      <div className="fixed top-0 right-0 flex items-center z-51">
        <audio ref={audioRef} src="/music.mp3" loop/>
        <div>
          <button
            onClick={toggleAudio}
            className="text-black font-bold transition-all w-15 cursor-pointer"
          >
            {isPlaying ? <img src={pause_icon} alt="Pause Icon" className="inline"/> : <img src={play_icon} alt="Play Icon" className="inline"/>}
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowCredits(true)}
            className="text-black font-bold bg-white/70 px-4 py-2 mr-2 rounded-lg shadow transition hover:bg-white cursor-pointer"
          >
            Credits
          </button>
        </div>
      </div>

      {showCredits && <Credits onClick={() => setShowCredits(false)}/>}
      
      {showStory && (
        <IntroDialogue onFinish={() => {
          localStorage.setItem('hasSeenStory', 'true');
          setShowStory(false);
        }} />
      )}

      {!showStory && !showOutro && (
        <main className="w-full min-h-screen flex flex-col lg:flex-row gap-4 p-6">

          {showQuestDialogue && (
            <QuestsDialogues 
              tasks={tasks} 
              onContinue={() => setShowQuestDialogue(false)} 
            />
          )}
          
          {/* Left Panel */}
          <aside className="flex-1 bg-zinc-800 rounded-2xl p-6 shadow-lg space-y-4">
            <LeftAside
              tableIndex={tableIndex}
              tasks={tasks}
              ChangePage={ChangePage}
              onCompleteLastTask={() => {
                setShowOutro(true);
                setShowStory(false);
              }}
              gameResetTrigger={gameResetTrigger}
            />
          </aside>

          <aside className="flex-1 bg-zinc-800 rounded-2xl p-6 shadow-lg">
            <RightAside tableIndex={tableIndex} tasks={tasks} table={table}/>
          </aside>
        </main>
      )}
      {showOutro && (
        <OutroDialogue
          onClose={() => {
            setShowOutro(false);
            setTableIndex(0);
            setShowQuestDialogue(true);
            setGameResetTrigger(prev => !prev);
          }}
        />
      )}
    </section>
  );
};

export default StoryIntro;
