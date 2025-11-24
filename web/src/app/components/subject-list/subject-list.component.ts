import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject as SubjectModel, Grade } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';
import { SubjectFormComponent } from '../subject-form/subject-form.component';

@Component({
  selector: 'app-subject-list',
  standalone: true,
  imports: [CommonModule, SubjectFormComponent],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.scss'
})
export class SubjectListComponent implements OnInit {
  private readonly subjectService = inject(SubjectService);

  subjects: SubjectModel[] = [];
  averageGrade: number = 0;
  showForm: boolean = false;
  editingSubject: SubjectModel | null = null;
  loading: boolean = false;
  error: string | null = null;

  readonly Grade = Grade;

  ngOnInit(): void {
    this.loadSubjects();
    this.loadAverageGrade();
  }

  loadSubjects(): void {
    this.loading = true;
    this.error = null;
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects.map(subject => ({
          ...subject,
          examDate: new Date(subject.examDate)
        }));
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load subjects. Please try again.';
        this.loading = false;
        console.error('Error loading subjects:', err);
      }
    });
  }

  loadAverageGrade(): void {
    this.subjectService.getAverageGrade().subscribe({
      next: (response) => {
        this.averageGrade = response.averageGrade;
      },
      error: (err) => {
        console.error('Error loading average grade:', err);
      }
    });
  }

  showCreateForm(): void {
    this.editingSubject = null;
    this.showForm = true;
  }

  showEditForm(subject: SubjectModel): void {
    this.editingSubject = { ...subject };
    this.showForm = true;
  }

  hideForm(): void {
    this.showForm = false;
    this.editingSubject = null;
  }

  onFormSubmitted(): void {
    this.hideForm();
    this.loadSubjects();
    this.loadAverageGrade();
  }

  deleteSubject(id: number): void {
    if (!confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.subjectService.deleteSubject(id).subscribe({
      next: () => {
        this.loadSubjects();
        this.loadAverageGrade();
      },
      error: (err) => {
        this.error = 'Failed to delete subject. Please try again.';
        this.loading = false;
        console.error('Error deleting subject:', err);
      }
    });
  }

  getGradeText(grade: Grade): string {
    return grade.toString();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-EN');
  }
}

