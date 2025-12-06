import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { useState } from 'react';
import './KundelikDashboard.css';

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
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Kundelik.kz - Электронный журнал</h1>
        <p>Используйте помощника справа для работы с журналом</p>
      </header>

      <div className="dashboard-content">
        <section className="section">
          <h2>Ученики</h2>
          {selectedGroup ? (
            <div className="students-list">
              {students.length > 0 ? (
                students.map((student) => (
                  <div key={student.id} className="student-card">
                    <span className="student-name">
                      {student.lastName} {student.firstName}
                    </span>
                    <span className="student-id">ID: {student.id}</span>
                  </div>
                ))
              ) : (
                <p className="empty-state">Список учеников пуст</p>
              )}
            </div>
          ) : (
            <p className="empty-state">
              Выберите группу через помощника
            </p>
          )}
        </section>

        <section className="section">
          <h2>Оценки</h2>
          <div className="grades-list">
            {grades.length > 0 ? (
              grades.map((grade) => (
                <div key={grade.id} className="grade-card">
                  <span className="grade-value">{grade.value}</span>
                  <span className="grade-date">{grade.date}</span>
                  {grade.comment && (
                    <span className="grade-comment">{grade.comment}</span>
                  )}
                </div>
              ))
            ) : (
              <p className="empty-state">Оценок пока нет</p>
            )}
          </div>
        </section>

        <section className="section">
          <h2>Уроки</h2>
          <div className="lessons-list">
            {lessons.length > 0 ? (
              lessons.map((lesson) => (
                <div key={lesson.id} className="lesson-card">
                  <span className="lesson-date">{lesson.date}</span>
                  <span className="lesson-topic">{lesson.topic || 'Без темы'}</span>
                </div>
              ))
            ) : (
              <p className="empty-state">Уроков пока нет</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default KundelikDashboard;
