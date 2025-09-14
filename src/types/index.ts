export type Task = {
  id: string;          // ID interno
  code: string;        // Código estilo Jira, ex: COMPANI-1
  type: string;        // Tipo da task (Task, Bug, Feature, Doc ou customizado)
  title: string;       // Título da task
  description: string; // Descrição em Markdown
  status: string;      // ID da coluna em que está
};

export type Column = {
  id: string;    // ID interno
  title: string; // Nome da coluna
  color: string; // Cor personalizada do cabeçalho
};