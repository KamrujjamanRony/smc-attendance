import { Component, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { Subscription, map } from 'rxjs';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectComponent } from "../../components/primeng/mult-select/multi-select.component";
import { SearchSelectComponent } from "../../components/primeng/search-select/search-select.component";
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-subject-select',
  imports: [ReactiveFormsModule, MultiSelectComponent, SearchSelectComponent],
  templateUrl: './subject-select.component.html',
  styleUrl: './subject-select.component.css'
})
export class SubjectSelectComponent {
  private dataService = inject(DataService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loginSubscription?: Subscription;
  studentOption = signal<any[]>([]);
  semesterOption = signal<any[]>([]);
  subjectOption = signal<any[]>([]);
  fb = inject(NonNullableFormBuilder);
  isSubmitted = false;

  form = this.fb.group({
    student: ['', Validators.required],
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
    this.subjectService.getSubject("", "").subscribe((data: any) => {
      this.subjectOption.set(data);
    })
    // this.dataService.getOptions().subscribe((data: any) => {
    //   this.subjectOption.set(data.subjectOption);
    // })
    this.studentService.getStudent("", "").subscribe(data => {
      this.studentOption.set(data);
    });
  }

  onInputChanged(e: Event) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const id = target.value;
    this.dataService.getOptions().subscribe((data: any) => {
      this.subjectOption.set(data.subjectOption.filter((s: any) => s.parentId == id));
    })
  }

  handleStudentChange(data: any) {
    this.getControl('student').setValue(data?.id);
  }

  handleSubjectChange(data: any) {
    const ids = data.map((s: any) => s.id);
    this.getControl('subject').setValue(ids);
  }


  onSubmit(): void {
    this.isSubmitted = true;
    if (this.form.valid) {
      const formData = this.form.value;
      console.log(formData)
      this.isSubmitted = true;
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
    }
  };

  ngOnDestroy(): void {
    this.loginSubscription?.unsubscribe();
  }

}
