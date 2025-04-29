import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-student-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})
export class StudentFormComponent {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private dataService = inject(DataService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  studentSubscription?: Subscription;
  sessionOption = signal<any[]>([]);
  batchOption = signal<any[]>([]);
  loading = signal<boolean>(false);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.onLoadOptions();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.studentService.getStudent(this.id, "")
            .subscribe({
              next: (response) => {
                if (response) {
                  this.model = response[0];
                }
              }
            });
        }
      }
    });
  }

  onLoadOptions() {
    this.dataService.getOptions().subscribe((data: any) => {
      this.sessionOption.set(data.sessionOption);
      this.batchOption.set(data.batchOption);
    })
  }

  onFormSubmit(): void {
    const { name, rollNo, sOthers1, sOthers2 } = this.model;
    this.loading.set(true);
    if (name && rollNo && sOthers1 && sOthers2) {

      if (this.id) {
        this.studentSubscription = this.studentService.updateStudent(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Student Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/student-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Student: ${error.error.message || error.error.title}`);
              console.error('Error Update Student:', error.error);
              this.loading.set(false);
            }
          });
      } else {
        this.studentSubscription = this.studentService.addStudent(this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Student Add successfully');
              this.onReset();
              this.loading.set(false);
              this.router.navigateByUrl('/student-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Add Student: ${error.error.message || error.error.title}`);
              console.error('Error Add Student:', error.error);
              this.loading.set(false);
            }
          });
      }
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Required Field!');
      this.loading.set(false);
    }
  };

  onReset() {
    this.model = {
      name: "",
      rollNo: "",
      rgeNo: "",
      conNo: "",
      guCoNo: "",
      address: "",
      postBy: "",
      sOthers1: "",
      sOthers2: "",
      sOthers3: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.studentSubscription?.unsubscribe();
  }

}
