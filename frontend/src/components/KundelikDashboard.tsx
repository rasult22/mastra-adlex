import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useState } from 'react';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

interface Grade {
  id: number;
  studentId: number;
  value: string;
  date: string;
  comment?: string;
}

interface Lesson {
  id: number;
  date: string;
  topic?: string;
}

function KundelikDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  useCopilotReadable({
    description: 'Список учеников в выбранной группе',
    value: students,
  });

  useCopilotReadable({
    description: 'Список оценок',
    value: grades,
  });

  useCopilotReadable({
    description: 'Список уроков',
    value: lessons,
  });

  useCopilotAction({
    name: 'loadStudents',
    description: 'Загрузить список учеников группы',
    parameters: [
      {
        name: 'groupId',
        type: 'number',
        description: 'ID группы/класса',
        required: true,
      },
    ],
    handler: async ({ groupId }) => {
      const response = await fetch(`/api/mastra/agents/kundelikAgent/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Получи список учеников группы с ID ${groupId}`,
            },
          ],
        }),
      });
      const data = await response.json();
      if (data.students) {
        setStudents(data.students);
        setSelectedGroup(groupId);
      }
    },
  });

  useCopilotAction({
    name: 'addGrade',
    description: 'Добавить оценку ученику',
    parameters: [
      {
        name: 'studentId',
        type: 'number',
        description: 'ID ученика',
        required: true,
      },
      {
        name: 'value',
        type: 'string',
        description: 'Оценка',
        required: true,
      },
      {
        name: 'comment',
        type: 'string',
        description: 'Комментарий',
        required: false,
      },
    ],
    handler: async ({ studentId, value, comment }) => {
      const response = await fetch(`/api/mastra/agents/kundelikAgent/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Поставь оценку ${value} ученику с ID ${studentId}${comment ? ` с комментарием: ${comment}` : ''}`,
            },
          ],
        }),
      });
      const data = await response.json();
      console.log('Grade added:', data);
    },
  });

  useCopilotAction({
    name: 'addHomework',
    description: 'Добавить домашнее задание',
    parameters: [
      {
        name: 'lessonId',
        type: 'number',
        description: 'ID урока',
        required: true,
      },
      {
        name: 'description',
        type: 'string',
        description: 'Описание задания',
        required: true,
      },
      {
        name: 'dueDate',
        type: 'string',
        description: 'Срок сдачи (YYYY-MM-DD)',
        required: true,
      },
    ],
    handler: async ({ lessonId, description, dueDate }) => {
      const response = await fetch(`/api/mastra/agents/kundelikAgent/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Добавь домашнее задание к уроку ${lessonId}: ${description}, срок сдачи ${dueDate}`,
            },
          ],
        }),
      });
      const data = await response.json();
      console.log('Homework added:', data);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-secondary-500 p-8">
      <header className="text-center text-white mb-12">
        <h1 className="text-5xl font-bold mb-2">Kundelik.kz - Электронный журнал</h1>
        <p className="text-lg opacity-90">Используйте помощника справа для работы с журналом</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary-500 text-gray-800">
            Ученики
          </h2>
          {selectedGroup ? (
            <div className="flex flex-col gap-3">
              {students.length > 0 ? (
                students.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <span className="font-semibold text-gray-800">
                      {student.lastName} {student.firstName}
                    </span>
                    <span className="text-sm text-gray-500">ID: {student.id}</span>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-400 italic">Список учеников пуст</p>
              )}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-400 italic">
              Выберите группу через помощника
            </p>
          )}
        </section>

        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary-500 text-gray-800">
            Оценки
          </h2>
          <div className="flex flex-col gap-3">
            {grades.length > 0 ? (
              grades.map((grade) => (
                <div
                  key={grade.id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <span className="text-2xl font-bold text-primary-500">{grade.value}</span>
                  <span className="text-sm text-gray-500">{grade.date}</span>
                  {grade.comment && (
                    <span className="text-sm text-gray-500 italic">{grade.comment}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400 italic">Оценок пока нет</p>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b-2 border-primary-500 text-gray-800">
            Уроки
          </h2>
          <div className="flex flex-col gap-3">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 bg-gray-50 rounded-lg flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  <span className="font-semibold text-gray-800">{lesson.date}</span>
                  <span className="text-gray-600">{lesson.topic || 'Без темы'}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-gray-400 italic">Уроков пока нет</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default KundelikDashboard;
