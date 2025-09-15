export type Task = {
  id: string;
  code: string;        // ex: COMPANI-1
  title: string;
  description: string;
  type: string;        // ex: Task | Bug | Feature
};

export type Column = {
  id: string;
  title: string;
  color: string;
  tasks: Task[];       // sempre array
};