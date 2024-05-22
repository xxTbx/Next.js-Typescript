import { useState, ChangeEvent, MouseEvent } from "react";
import { Task } from "@/types";

type AnswerProps = {
  task: Task;
  onSubmitCorrectAnswer: () => void;
  onSubmitWrongAnswer: () => void;
  numAttempts: number;
  numAttemptsLeft: number;
  onIncorrectAnswer: (operationType: string) => void;

};
  //ask chatgpt to fix the fault in the test base on my code reference site : https://chat.openai.com/
export default function Answer({
  task,
  onSubmitCorrectAnswer,
  onSubmitWrongAnswer,
  numAttemptsLeft,
  numAttempts,
  onIncorrectAnswer,

}: AnswerProps) {
  const [answer, setAnswer] = useState<string>("");
  const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [showNumAttempts, setShowNumAttempts] = useState<boolean>(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState<boolean>(false);

  const calculate_correct_answer = (task: Task): string | null => {
    const [num1, num2] = task.data.split("|").map(Number);

    let result: number | null = null;

    if (task.type === "add") {
      result = num1 + num2;
    } else if (task.type === "subtract") {
      result = num1 - num2;
    } else if (task.type === "multiply") {
      result = num1 * num2;
    } else if (task.type === "divide") {
      result = num1 / num2;
    }

    return result !== null ? result.toString() : null;
  };

  const correctAnswer = calculate_correct_answer(task);

  const sendAnswer = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const userAnswer = answer.trim() === "" ? NaN : Number(answer);

    if (isCorrectAnswer || isNaN(userAnswer)) {
      return;
    }

    const correctAnswerNumber = Number(correctAnswer);

    if (Math.abs(userAnswer - correctAnswerNumber) < 0.0001) {
      setMessage("Bra jobba!! Testen er fullført");
      setIsCorrectAnswer(true);
      onSubmitCorrectAnswer();
    } else {
      setMessage("Forsøk igjen");
      setShowNumAttempts(true);
      onSubmitWrongAnswer();
      onIncorrectAnswer(task.type)
    }
  };

  const update = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    const number = value === "" ? NaN : Number(value);

    setAnswer(value);

    if (!isNaN(number)) {
      const correctAnswerNumber = Number(correctAnswer);

      if (number === correctAnswerNumber) {
        setMessage("Bra jobba!! Testen er fullført");
      } else {
        setMessage("Forsøk igjen");
      }
    } else {
      setMessage("");
    }
  };

  const inputId = `answer-${task.id}-1`;

  return (
    <div className="flex flex-col justify-center items-center mt-1">
      <input
        id={inputId} name={"answer"} type="text" placeholder="Sett svar her" onChange={update} value={answer}/>
      <button onClick={sendAnswer} disabled={isCorrectAnswer}>Send</button>
      {showNumAttempts && (<div><p>{numAttemptsLeft} av {numAttempts} forsøk igjen</p></div>)}
      {!showCorrectAnswer && numAttemptsLeft === 0 && (<button onClick={() => setShowCorrectAnswer(true)}>Vis svaret</button>)}
      {showCorrectAnswer && correctAnswer !== null && (<div>Korrekt svar: {correctAnswer}</div>)}
      {isCorrectAnswer && message && <div>{message}</div>}
    </div>
  );
}
