import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject as SubjectModel, CreateSubjectDto, UpdateSubjectDto, Grade } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subject-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.scss'
})
export class SubjectFormComponent implements OnInit {
  @Input() subject: SubjectModel | null = null;
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  loading: boolean = false;
  error: string | null = null;

  readonly Grade = Grade;
  readonly grades = [
    { value: Grade.One, label: '1' },
    { value: Grade.Two, label: '2' },
    { value: Grade.Three, label: '3' },
    { value: Grade.Four, label: '4' },
    { value: Grade.Five, label: '5' }
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    if (this.subject) {
      this.populateForm();
    }
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      examDate: ['', Validators.required],
      grade: ['', [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  private populateForm(): void {
    if (this.subject) {
      const examDate = new Date(this.subject.examDate);
      const dateString = examDate.toISOString().split('T')[0];
      
      this.form.patchValue({
        name: this.subject.name,
        examDate: dateString,
        grade: this.subject.grade
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.form.value;
    const examDate = new Date(formValue.examDate + 'T00:00:00');

    if (this.subject) {
      const updateDto: UpdateSubjectDto = {
        name: formValue.name,
        examDate: examDate,
        grade: Number(formValue.grade) as Grade
      };

      this.subjectService.updateSubject(this.subject.id, updateDto).subscribe({
        next: () => {
          this.loading = false;
          this.submitted.emit();
        },
        error: (err) => {
          this.error = 'Failed to update subject. Please try again.';
          this.loading = false;
          console.error('Error updating subject:', err);
        }
      });
    } else {
      const createDto: CreateSubjectDto = {
        name: formValue.name,
        examDate: examDate,
        grade: Number(formValue.grade) as Grade
      };

      this.subjectService.createSubject(createDto).subscribe({
        next: () => {
          this.loading = false;
          this.submitted.emit();
        },
        error: (err) => {
          this.error = 'Failed to create subject. Please try again.';
          this.loading = false;
          console.error('Error creating subject:', err);
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  hasError(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }
    if (control?.hasError('maxlength')) {
      return `${this.getFieldLabel(fieldName)} cannot exceed 200 characters`;
    }
    if (control?.hasError('min') || control?.hasError('max')) {
      return 'Grade must be between 1 and 5';
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Subject name',
      examDate: 'Exam date',
      grade: 'Grade'
    };
    return labels[fieldName] || fieldName;
  }
}

