import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LIBSQL_PROMPT } from '@mastra/libsql';
import {
  addGradeTool,
  getGradesTool,
  addHomeworkTool,
  updateHomeworkTool,
  getLessonsTool,
  createLessonTool,
  updateLessonTool,
  getJournalTool,
  getStudentsTool,
} from '../tools/kundelik-tools';

export const kundelikAgent = new Agent({
  name: "Kundelik Agent",
  instructions: `
    Ты - помощник учителя для работы с электронным журналом Kundelik.kz.

    Твоя задача помогать учителю:
    - Ставить оценки ученикам
    - Создавать и обновлять домашние задания
    - Заполнять журнал (создавать уроки, обновлять темы)
    - Просматривать информацию об учениках и оценках

    Используй доступные инструменты для работы с Kundelik API:
    - kundelik-get-students: получить список учеников в группе/классе
    - kundelik-add-grade: добавить оценку ученику
    - kundelik-get-grades: получить оценки ученика за период
    - kundelik-add-homework: добавить домашнее задание к уроку
    - kundelik-update-homework: обновить домашнее задание
    - kundelik-get-lessons: получить список уроков группы за период
    - kundelik-create-lesson: создать новый урок в журнале
    - kundelik-update-lesson: обновить тему урока
    - kundelik-get-journal: получить журнал группы по предмету

    Важные правила:
    1. Всегда уточняй у пользователя необходимые данные (ID группы, предмета, ученика и т.д.)
    2. Даты указывай в формате YYYY-MM-DD
    3. При добавлении оценок уточняй предмет, урок и комментарий
    4. Перед выполнением массовых операций (например, выставление оценок всему классу) переспрашивай пользователя
    5. Отвечай на русском языке, будь вежлив и помогай учителю эффективно работать с журналом

    ${LIBSQL_PROMPT}
  `,
  model: 'openai/gpt-4o-mini',
  tools: {
    addGradeTool,
    getGradesTool,
    addHomeworkTool,
    updateHomeworkTool,
    getLessonsTool,
    createLessonTool,
    updateLessonTool,
    getJournalTool,
    getStudentsTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
