import { Component, inject, signal } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { Subscription } from 'rxjs';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-attendance-category',
  imports: [ReactiveFormsModule],
  templateUrl: './attendance-category.component.html',
  styleUrl: './attendance-category.component.css'
})
export class AttendanceCategoryComponent {
  private dataService = inject(DataService);
  private subjectService = inject(SubjectService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loginSubscription?: Subscription;
  semesterOption = signal<any[]>([]);
  subjectOption = signal<any[]>([]);
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;

  form = this.fb.group({
    year: ['', Validators.required],
    subject: ['', Validators.required],
  });

  // Simplified method to get form controls
  getControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  ngOnInit() {
    this.onLoadOptions();
  };

  onLoadOptions() {
    this.dataService.getOptions().subscribe((data: any) => {
      this.semesterOption.set(data.semesterOption);
    })
  }

  onInputChanged(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const id = target.value;
    this.subjectService.getSubject("", id).subscribe((data: any) => {
      this.subjectOption.set(data);
    })
    // this.dataService.getOptions().subscribe((data: any) => {
    //   this.subjectOption.set(data.subjectOption.filter((s: any) => s.parentId == id));
    // })
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      const formData = this.form.value;
      this.isSubmitted = true;
      this.router.navigateByUrl('/attendance-list/' + formData.subject);
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
    }
  };

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
