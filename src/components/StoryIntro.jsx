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

import {
  createDefaultProgress,
  loadProgress,
  markChallengeCompleted,
  resetProgress,
  saveProgress,
} from "../lib/progressStorage.js";

const StoryIntro = () => {
  const [showStory, setShowStory] = useState(() => {
    const hasSeenStory = localStorage.getItem('hasSeenStory');
    return hasSeenStory ? false : true;
  });

  const [showOutro, setShowOutro] = useState(false);

  const [progress, setProgress] = useState(() => loadProgress(data.length));

  const tableIndex = progress.currentChallengeIndex;

  const [showQuestDialogue, setShowQuestDialogue] = useState(true);
  const tasks = data[tableIndex];  
  const [showCredits, setShowCredits] = useState(false);
  const [gameResetTrigger, setGameResetTrigger] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const persistProgress = (nextProgress) => {
    const savedProgress = saveProgress(nextProgress, data.length);
    setProgress(savedProgress);
  };

  const ChangePage = (direction) => {
    let nextIndex = tableIndex;

    if (direction === 'next' && tableIndex < data.length - 1) {
      nextIndex = tableIndex + 1;
    } else if (direction === 'previous' && tableIndex > 0) {
      nextIndex = tableIndex -1;
    }

    persistProgress({
      ...progress,
      currentChallengeIndex: nextIndex
    });

    setShowQuestDialogue(true);
  }

  const handleChallengeCompleted = (challengeIndex) => {
    const nextProgress = markChallengeCompleted(
      progress,
      challengeIndex,
      data.length,
    );

    persistProgress(nextProgress);
  }

  useEffect(() => {
    if (gameResetTrigger) {
      setShowStory(false);
    }
  }, [gameResetTrigger]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };
  

  return (
    <section className="w-full min-h-screen bg-gradient-to-b text-white bg-black/50 backdrop-blur-sm">
      <div className="fixed top-0 right-0 flex flex-wrap items-center justify-end gap-1 z-40 mt-2 max-w-full">
        <audio
          ref={audioRef}
          src={`${import.meta.env.BASE_URL}music.mp3`}
          loop
        />
        <div>
          <button
            onClick={toggleAudio}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            aria-pressed={isPlaying}
            className="text-black font-bold transition-all w-19 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            {isPlaying ? <img src={pause_icon} alt="" className="inline"/> : <img src={play_icon} alt="" className="inline"/>}
          </button>
        </div>

        <div>
          <button
            onClick={() => setShowCredits(true)}
            className="text-black font-bold bg-white/70 px-4 py-2 mr-2 rounded-lg shadow transition hover:bg-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
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
        <main className="w-full min-h-screen flex flex-col lg:flex-row gap-4 p-3 pt-16 sm:p-6 lg:pt-6">

          {showQuestDialogue && (
            <QuestsDialogues 
              tasks={tasks} 
              onContinue={() => setShowQuestDialogue(false)} 
            />
          )}
          
          {/* Left Panel */}
          <aside className="flex-1 min-w-0 bg-zinc-800 rounded-2xl p-4 sm:p-6 shadow-lg space-y-4">
            <LeftAside
              tableIndex={tableIndex}
              tasks={tasks}
              ChangePage={ChangePage}
              onCompleteLastTask={() => {
                setShowOutro(true);
                setShowStory(false);
              }}
              gameResetTrigger={gameResetTrigger}
              isChallengeCompleted={
                progress.completedChallengeIndexes.includes(tableIndex)
              }
              onChallengeCompleted={handleChallengeCompleted}
            />
          </aside>

          <aside className="flex-1 min-w-0 bg-zinc-800 rounded-2xl p-4 sm:p-6 shadow-lg">
            <RightAside tableIndex={tableIndex} tasks={tasks} table={table}/>
          </aside>
        </main>
      )}
      {showOutro && (
        <OutroDialogue
          onClose={() => {
            setShowOutro(false);
            
            resetProgress();
            setProgress(createDefaultProgress());

            setShowQuestDialogue(true);
            setGameResetTrigger(prev => !prev);
          }}
        />
      )}
    </section>
  );
};

export default StoryIntro;
