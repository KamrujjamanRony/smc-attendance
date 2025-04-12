import { Component, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { SubjectService } from '../../services/subject.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SearchSelectEditComponent } from "../../components/primeng/search-select/search-select-edit.component";
import { StudentService } from '../../services/student.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-attendance-details-form',
  imports: [FormsModule, SearchSelectEditComponent],
  templateUrl: './attendance-details-form.component.html',
  styleUrl: './attendance-details-form.component.css'
})
export class AttendanceDetailsFormComponent {
  private AttendanceService = inject(AttendanceService);
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  formSubscription?: Subscription;
  loading = signal<boolean>(false);
  studentOption = signal<any[]>([]);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.onLoadOptions();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.AttendanceService.getAttendanceDetails(this.id, "")
            .subscribe({
              next: (response) => {
                if (response.length > 0) {
                  const data = response[0];
                  this.model = {
                    studentId: data.studentId,
                    status: data.status,
                  };
                  // this.model = response[0];
                }
              }
            });
        }
      }
    });
  }

  onLoadOptions() {
    this.studentService.getStudent("", "").subscribe((data: any) => {
      if (data.length > 0) {
        this.studentOption.set(data.map((item: any) => ({ id: item.id, label: `${item.rollNo} - ${item.name} - ${item.rgeNo}` })));
      }
    });
  };

  handleStudentChange(data: any) {
    this.model.studentId = this.id ? data : data?.id;
  }

  setAttendance(status: number) {
    this.model.status = status;
  }

  onFormSubmit(): void {
    const { studentId, status } = this.model;
    this.loading.set(true);
    if (studentId && status) {

      if (this.id) {
        this.formSubscription = this.AttendanceService.updateAttendanceDetails(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Attendance Detail Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/attendance-details');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Attendance Detail: ${error.error.message || error.error.title}`);
              console.error('Error Update Attendance Detail:', error.error);
              this.loading.set(false);
            }
          });
      }
      // else {
      //   this.formSubscription = this.subjectService.addSubject(this.model)
      //     .subscribe({
      //       next: (response) => {
      //         this.toastService.showMessage('success', 'Success', 'Subject Add successfully');
      //         this.onReset();
      //         this.loading.set(false);
      //         this.router.navigateByUrl('/subject-list');
      //       },
      //       error: (error) => {
      //         this.toastService.showMessage('error', 'Error', `Error Add Subject: ${error.error.message || error.error.title}`);
      //         console.error('Error Add Subject:', error.error);
      //         this.loading.set(false);
      //       }
      //     });
      // }
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Required Field!');
      this.loading.set(false);
    }
  };

  onReset() {
    this.model = {
      studentId: "",
      status: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
  }

}
