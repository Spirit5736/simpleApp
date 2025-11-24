import { Grade } from "./grade.enum";

export { Grade };

export interface Subject {
  id: number;
  name: string;
  examDate: Date;
  grade: Grade;
}

export interface CreateSubjectDto {
  name: string;
  examDate: Date;
  grade: Grade;
}

export interface UpdateSubjectDto {
  name: string;
  examDate: Date;
  grade: Grade;
}

