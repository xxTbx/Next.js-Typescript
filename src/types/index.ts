export type Task = {
  id: string
  text: string
  type: "add" | "divide" | "multiply" | "subtract"
  data: `${number}|${number}`
}

export type Type = "add" | "subtract" | "multiply" | "divide"

export interface RandomTaskQueryParams {
  taskType?: string;
  count?: number;
}

export interface TaskQueryParams {
  taskType?: string;
  count?: string;
}

export interface TaskAttempts {
  [taskId: string]: number;

}