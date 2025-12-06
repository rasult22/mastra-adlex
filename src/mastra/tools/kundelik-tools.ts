import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { KundelikClient } from '../integrations/kundelik/client';

const getKundelikClient = () => {
  const accessToken = process.env.KUNDELIK_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error('KUNDELIK_ACCESS_TOKEN is not set in environment variables');
  }
  return new KundelikClient({ accessToken });
};

export const addGradeTool = createTool({
  id: 'kundelik-add-grade',
  description: 'Добавить оценку ученику в Kundelik.kz',
  inputSchema: z.object({
    studentId: z.number().describe('ID ученика'),
    subjectId: z.number().describe('ID предмета'),
    lessonId: z.number().describe('ID урока'),
    value: z.string().describe('Значение оценки (например, "5", "4", "3")'),
    date: z.string().describe('Дата оценки в формате YYYY-MM-DD'),
    comment: z.string().optional().describe('Комментарий к оценке'),
  }),
  outputSchema: z.object({
    id: z.number(),
    studentId: z.number(),
    value: z.string(),
    date: z.string(),
    comment: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.addGrade({
      studentId: context.studentId,
      subjectId: context.subjectId,
      lessonId: context.lessonId,
      value: context.value,
      date: context.date,
      comment: context.comment,
    });
    return result;
  },
});

export const getGradesTool = createTool({
  id: 'kundelik-get-grades',
  description: 'Получить оценки ученика за период',
  inputSchema: z.object({
    studentId: z.number().describe('ID ученика'),
    from: z.string().describe('Начальная дата в формате YYYY-MM-DD'),
    to: z.string().describe('Конечная дата в формате YYYY-MM-DD'),
  }),
  outputSchema: z.array(z.object({
    id: z.number(),
    studentId: z.number(),
    value: z.string(),
    date: z.string(),
  })),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.getGrades(context.studentId, context.from, context.to);
    return result;
  },
});

export const addHomeworkTool = createTool({
  id: 'kundelik-add-homework',
  description: 'Добавить домашнее задание к уроку',
  inputSchema: z.object({
    lessonId: z.number().describe('ID урока'),
    description: z.string().describe('Описание домашнего задания'),
    attachments: z.array(z.string()).optional().describe('Ссылки на прикрепленные файлы'),
    dueDate: z.string().describe('Срок сдачи в формате YYYY-MM-DD'),
  }),
  outputSchema: z.object({
    id: z.number(),
    lessonId: z.number(),
    description: z.string(),
    dueDate: z.string(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.addHomework({
      lessonId: context.lessonId,
      description: context.description,
      attachments: context.attachments,
      dueDate: context.dueDate,
    });
    return result;
  },
});

export const updateHomeworkTool = createTool({
  id: 'kundelik-update-homework',
  description: 'Обновить домашнее задание',
  inputSchema: z.object({
    homeworkId: z.number().describe('ID домашнего задания'),
    description: z.string().optional().describe('Новое описание'),
    attachments: z.array(z.string()).optional().describe('Новые прикрепленные файлы'),
  }),
  outputSchema: z.object({
    id: z.number(),
    description: z.string(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.updateHomework(context.homeworkId, {
      description: context.description,
      attachments: context.attachments,
    });
    return result;
  },
});

export const getLessonsTool = createTool({
  id: 'kundelik-get-lessons',
  description: 'Получить список уроков группы за период',
  inputSchema: z.object({
    groupId: z.number().describe('ID группы/класса'),
    from: z.string().describe('Начальная дата в формате YYYY-MM-DD'),
    to: z.string().describe('Конечная дата в формате YYYY-MM-DD'),
  }),
  outputSchema: z.array(z.object({
    id: z.number(),
    date: z.string(),
    subjectId: z.number(),
    groupId: z.number(),
    topic: z.string().optional(),
  })),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.getLessons(context.groupId, context.from, context.to);
    return result;
  },
});

export const createLessonTool = createTool({
  id: 'kundelik-create-lesson',
  description: 'Создать новый урок в журнале',
  inputSchema: z.object({
    date: z.string().describe('Дата урока в формате YYYY-MM-DD'),
    subjectId: z.number().describe('ID предмета'),
    groupId: z.number().describe('ID группы/класса'),
    topic: z.string().optional().describe('Тема урока'),
  }),
  outputSchema: z.object({
    id: z.number(),
    date: z.string(),
    subjectId: z.number(),
    groupId: z.number(),
    topic: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.createLesson({
      date: context.date,
      subjectId: context.subjectId,
      groupId: context.groupId,
      topic: context.topic,
    });
    return result;
  },
});

export const updateLessonTool = createTool({
  id: 'kundelik-update-lesson',
  description: 'Обновить тему урока',
  inputSchema: z.object({
    lessonId: z.number().describe('ID урока'),
    topic: z.string().describe('Новая тема урока'),
  }),
  outputSchema: z.object({
    id: z.number(),
    topic: z.string(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.updateLesson(context.lessonId, {
      topic: context.topic,
    });
    return result;
  },
});

export const getJournalTool = createTool({
  id: 'kundelik-get-journal',
  description: 'Получить журнал группы по предмету за период',
  inputSchema: z.object({
    groupId: z.number().describe('ID группы/класса'),
    subjectId: z.number().describe('ID предмета'),
    from: z.string().describe('Начальная дата в формате YYYY-MM-DD'),
    to: z.string().describe('Конечная дата в формате YYYY-MM-DD'),
  }),
  outputSchema: z.object({
    journal: z.any(),
  }),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.getJournal(
      context.groupId,
      context.subjectId,
      context.from,
      context.to
    );
    return { journal: result };
  },
});

export const getStudentsTool = createTool({
  id: 'kundelik-get-students',
  description: 'Получить список учеников в группе/классе',
  inputSchema: z.object({
    groupId: z.number().describe('ID группы/класса'),
  }),
  outputSchema: z.array(z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  })),
  execute: async ({ context }) => {
    const client = getKundelikClient();
    const result = await client.getStudents(context.groupId);
    return result;
  },
});
