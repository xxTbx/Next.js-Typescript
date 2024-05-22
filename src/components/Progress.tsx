"use client"

import { useState, type MouseEvent } from "react";
import { type Task } from "../types/index";


  //ask chatgpt to fix the fault in the test base on my code reference site : https://chat.openai.com/
interface ProgressProps {
  tasks: Task[];
  isCorrectAnswer: boolean;
  currentTaskIndex: number;
  setCurrentTaskIndex: (index: number) => void;
}

export default function Progress({
  tasks,
  isCorrectAnswer,
  currentTaskIndex,
  setCurrentTaskIndex
}: ProgressProps) {

  const [lastQuestion, setLastQuestion] = useState(false)


  const next = (event: MouseEvent<HTMLButtonElement>) => {
    console.log(currentTaskIndex)
    console.log(tasks)

    if (currentTaskIndex + 1 === tasks.length) {
      setLastQuestion(true)
      return currentTaskIndex 
    }

    else {setCurrentTaskIndex(currentTaskIndex + 1);}
  };

  const prev = (event: MouseEvent<HTMLButtonElement>) => {
    if(currentTaskIndex== 0) {
      console.log("første spm")
      return currentTaskIndex;
    }
    else setCurrentTaskIndex(currentTaskIndex - 1);
  };

  return (
    <footer className="mt-4 border-t-slate-300">
       {lastQuestion && <p>Svar på siste spm</p>}
      <button onClick={prev} className="bg-purple-700 text-white mr-10">
        Forrige
      </button>
      {isCorrectAnswer && (
        <button onClick={next} className="bg-teal-700 text-white ml-20">
          Neste
        </button>
      )}
    </footer>
  );
}