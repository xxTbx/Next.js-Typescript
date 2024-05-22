"use client"
import Answer from "@/components/Answer";
import Header from "@/components/Header";
import Progress from "@/components/Progress";
import Tasks from "@/components/Tasks";
import NumberOfTask from "@/components/NumberOfTask";
import { type Task, type TaskAttempts } from "@/types"
import React, { useState, useEffect } from 'react'
import { taskFetch} from '../controller/taskController'



const Home = () => {


  const [tasks, setTasks] = useState<Task[]>([])
  const [taskCount, setTaskCount] = useState<string>('')
  const [onCurrentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [onAttempts, setAttempts] = useState<TaskAttempts>({})
  const [taskDone, setTaskDone] = useState(false);
  const [points, setPoints] = useState(0);

  const [random, setRandomType]= useState('')
  const [feedback, setFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<String>('')

  const [message, setMessage] = useState<string>('');
  const [showPoints, setShowPoints] = useState(false)
  
  const [incorrectAnswers, setIncorrectAnswers] = useState<{ [operationType: string]: number }>({});

  const onIncorrectAnswer = (operationType: string) => {
    setIncorrectAnswers((prevIncorrectAnswers) => ({
      ...prevIncorrectAnswers,
      [operationType]: (prevIncorrectAnswers[operationType] || 0) + 1,
    }));
  };


  //Some code in here from Chatgpt, reference site: https://chat.openai.com/
  useEffect(() => {
    if (showPoints) {
      const mostErrorOperation = Object.keys(incorrectAnswers).reduce((a, b) =>
        incorrectAnswers[a] > incorrectAnswers[b] ? a : b
      );
      setFeedback(true)
      setFeedbackMessage(`Du burde øve mer på: ${mostErrorOperation}`)
      console.log(`Øv mer på ${mostErrorOperation}`);
    }
  }, [showPoints]);
  
  useEffect(() => {
    console.log("kjører");
    const operationTypes = ['add', 'multiply', 'subtract', 'divide'];
    if (!taskCount) {
      return; 
    }  
    const randomOperationType = operationTypes[Math.floor(Math.random() * operationTypes.length)];

    setRandomType(randomOperationType);
  
    //ask chatgpt to fix the fault in the test base on my code reference site : https://chat.openai.com/
    const getTasks = async () => {
      try {
        console.log("kjører2");
    
        const fetchedTaskIds: Set<string> = new Set();
        const tasksPerType = Math.ceil(parseInt(taskCount) / operationTypes.length);
    
        const fetchedTasks = await Promise.all(
          operationTypes.map(async (operationType) => {
            const randomTasks = await taskFetch(operationType, tasksPerType.toString());
            
            const uniqueTasks = randomTasks.filter((task) => !fetchedTaskIds.has(task.id));
            
            uniqueTasks.forEach((task) => fetchedTaskIds.add(task.id));
    
            return uniqueTasks;
          })
        );
    
        const allTasks = fetchedTasks.flat().slice(0, parseInt(taskCount));
        setTasks(allTasks);
    
        const initialAttempts = Object.fromEntries(
          allTasks.map((task: Task) => [task.id, 3])
        );
    
        setAttempts(initialAttempts);
      } catch (errorFetchingTasks) {
        console.error("Error fetching tasks:", errorFetchingTasks);
      }
    };
    
    void getTasks();
    }, [taskCount]);
    


const onCorrectAnswer = () => {
  setCurrentTaskIndex(prevIndex => {
    
    if (prevIndex + 1 === tasks.length) {
      setShowPoints(true);
      setPoints((prevPoints) => prevPoints + 0.5);
      return prevIndex
    }

    else {
      setTaskDone(true) 
      setPoints((prevPoints) => prevPoints + 0.5);
      setMessage('Bra jobba!!');
      return prevIndex + 1
    };
  });
};


  const reduceNumAttempts = (taskId: string) => {
    console.log("triggered")
    setAttempts((prevAttempts: { [x: string]: number; }) => ({
      ...prevAttempts,
      [taskId]: prevAttempts[taskId] > 0 ? prevAttempts[taskId] - 1 : 0
    }));
  };
  

  const reset = () => {
    setTasks([]);
    setTaskCount('');
    setCurrentTaskIndex(0);
    setAttempts({});
    setTaskDone(false);
    setPoints(0);
    setMessage('');
    setShowPoints(false);
  };

  return (
    <main>
      <Header />
      <NumberOfTask countValue={taskCount} onCountChange={setTaskCount} />
      <Tasks tasks={tasks} currentTaskIndex={onCurrentTaskIndex}>
        {tasks.length > 0 && onCurrentTaskIndex < tasks.length && (
          <>
            <Answer task={tasks[onCurrentTaskIndex]} onSubmitCorrectAnswer={onCorrectAnswer} onSubmitWrongAnswer={() => { reduceNumAttempts(tasks[onCurrentTaskIndex].id); }}
              numAttemptsLeft={onAttempts[tasks[onCurrentTaskIndex].id]} numAttempts={3}
              onIncorrectAnswer={onIncorrectAnswer}
            />
            {taskDone && <div>{message}</div>}
            <Progress tasks={tasks} isCorrectAnswer={onCurrentTaskIndex > 0} currentTaskIndex={onCurrentTaskIndex}setCurrentTaskIndex={setCurrentTaskIndex} />
          </>
        )}
        {showPoints && <div>{"Poengscore:  " + points + " points!"}</div>}
        {feedback && <div>{feedbackMessage}</div>}
        <button onClick={reset}>Start på nytt</button>
      </Tasks>

    </main>
  );
};

export default Home;