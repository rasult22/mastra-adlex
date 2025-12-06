import axios, { AxiosInstance } from 'axios';

export interface KundelikConfig {
  accessToken: string;
  baseUrl?: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Grade {
  id?: number;
  studentId: number;
  subjectId: number;
  lessonId: number;
  value: string;
  date: string;
  comment?: string;
}

export interface Homework {
  id?: number;
  lessonId: number;
  description: string;
  attachments?: string[];
  dueDate: string;
}

export interface Lesson {
  id: number;
  date: string;
  subjectId: number;
  groupId: number;
  topic?: string;
}

export class KundelikClient {
  private client: AxiosInstance;
  private accessToken: string;

  constructor(config: KundelikConfig) {
    this.accessToken = config.accessToken;
    const baseUrl = config.baseUrl || 'https://api.kundelik.kz/v1';

    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Access-Token': this.accessToken,
        'Content-Type': 'application/json',
      },
    });
  }

  async getStudents(groupId: number): Promise<Student[]> {
    const response = await this.client.get(`/edu-groups/${groupId}/persons`);
    return response.data;
  }

  async addGrade(grade: Grade): Promise<Grade> {
    const response = await this.client.post('/marks', {
      lesson: grade.lessonId,
      person: grade.studentId,
      mood: 'None',
      value: grade.value,
      date: grade.date,
      comment: grade.comment || '',
    });
    return response.data;
  }

  async updateGrade(gradeId: number, grade: Partial<Grade>): Promise<Grade> {
    const response = await this.client.put(`/marks/${gradeId}`, {
      value: grade.value,
      comment: grade.comment,
    });
    return response.data;
  }

  async deleteGrade(gradeId: number): Promise<void> {
    await this.client.delete(`/marks/${gradeId}`);
  }

  async getGrades(studentId: number, from: string, to: string): Promise<Grade[]> {
    const response = await this.client.get(`/persons/${studentId}/marks/${from}/${to}`);
    return response.data;
  }

  async addHomework(homework: Homework): Promise<Homework> {
    const response = await this.client.post('/works', {
      lesson: homework.lessonId,
      text: homework.description,
      attachments: homework.attachments || [],
    });
    return response.data;
  }

  async updateHomework(homeworkId: number, homework: Partial<Homework>): Promise<Homework> {
    const response = await this.client.put(`/works/${homeworkId}`, {
      text: homework.description,
      attachments: homework.attachments,
    });
    return response.data;
  }

  async deleteHomework(homeworkId: number): Promise<void> {
    await this.client.delete(`/works/${homeworkId}`);
  }

  async getLessons(groupId: number, from: string, to: string): Promise<Lesson[]> {
    const response = await this.client.get(`/edu-groups/${groupId}/lessons/${from}/${to}`);
    return response.data;
  }

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
    const response = await this.client.post('/lessons', {
      date: lesson.date,
      subject: lesson.subjectId,
      group: lesson.groupId,
      topic: lesson.topic || '',
    });
    return response.data;
  }

  async updateLesson(lessonId: number, lesson: Partial<Lesson>): Promise<Lesson> {
    const response = await this.client.put(`/lessons/${lessonId}`, {
      topic: lesson.topic,
    });
    return response.data;
  }

  async getJournal(groupId: number, subjectId: number, from: string, to: string) {
    const response = await this.client.get(`/lessons/journal/${groupId}/${subjectId}/${from}/${to}`);
    return response.data;
  }
}
