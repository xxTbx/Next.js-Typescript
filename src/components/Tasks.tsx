import { ReactNode } from "react";
import { Task } from "@/types";
import TaskText from "@/components/Text";

export default function Tasks({
  tasks,
  children,
  currentTaskIndex,
}: {
  tasks: Task[];
  children: ReactNode;
  currentTaskIndex: number;
}) {
  if (tasks.length === 0) return null;

  const task = tasks[currentTaskIndex];
  return (
    <section  className= "flex flex-col justify-center items-center gap-10">
      <article key={task.id} className="flex flex-col gap-2">
        <TaskText text={"Hva blir resultatet av regneoperasjonen?"} />
        <p>{task.type}</p>
        <p>{task.data}</p>
        <h3>{task.text}</h3>
        {children}
      </article>
    </section>
  );
}
