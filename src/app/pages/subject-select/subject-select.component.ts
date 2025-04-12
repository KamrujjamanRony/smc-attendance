import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { Subscription, map } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from "../../components/primeng/mult-select/multi-select.component";
import { SearchSelectComponent } from "../../components/primeng/search-select/search-select.component";
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { StudentWiseSubjectService } from '../../services/student-wise-subject.service';
import { SearchSelectEditComponent } from "../../components/primeng/search-select/search-select-edit.component";
import { MultiSelectEditComponent } from "../../components/primeng/mult-select/multi-select-edit.component";

@Component({
  selector: 'app-subject-select',
  imports: [FormsModule, MultiSelectComponent, SearchSelectComponent, SearchSelectEditComponent, MultiSelectEditComponent],
  templateUrl: './subject-select.component.html',
  styleUrl: './subject-select.component.css'
})
export class SubjectSelectComponent {
  private studentWiseSubjectService = inject(StudentWiseSubjectService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private formSubscription?: Subscription;
  private paramsSubscription?: Subscription;
  id: any = null;
  studentOption = signal<any[]>([]);
  semesterOption = signal<any[]>([]);
  subjectOption = signal<any[]>([]);
  loading = signal<boolean>(false);
  model?: any;

  constructor() {
    this.onReset();
  }

  ngOnInit() {
    this.onLoadOptions();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.studentWiseSubjectService.getStuWiseSub(this.id, "")
            .subscribe({
              next: (response) => {
                if (response.length > 0) {
                  this.model = response[0];
                }
              }
            });
        }
      }
    });
  };

  onLoadOptions() {
    this.subjectService.getSubject("", "").subscribe((data: any) => {
      this.subjectOption.set(data.map((item: any) => ({ id: item.id, label: `${item.subName} (Phase ${item.semester.slice(-1)})` })));
    });
    this.studentService.getStudent("", "").subscribe((data: any) => {
      if (data.length > 0) {
        this.studentOption.set(data.map((item: any) => ({ id: item.id, label: `${item.rollNo} - ${item.name} - ${item.rgeNo}` })));
      }
    });
  };

  handleStudentChange(data: any) {
    this.model.studentId = this.id ? data : data?.id;
  }

  handleSubjectChange(data: any) {
    const ids = this.id ? data : data.map((s: any) => s.id);
    this.model.subjectIds = ids;
  }


  onFormSubmit(): void {
    this.loading.set(true);
    const { studentId, subjectIds } = this.model;
    // console.log(this.model)
    if (studentId && subjectIds) {

      if (this.id) {
        this.formSubscription = this.studentWiseSubjectService.updateStuWiseSub(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Student Wise Subject Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/subject-selection');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Subject: ${error.error.message || error.error.title}`);
              console.error('Error Update Subject:', error.error);
              this.loading.set(false);
            }
          });
      } else {
        this.formSubscription = this.studentWiseSubjectService.addStuWiseSub(this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Student Wise Subject Add successfully');
              this.onReset();
              this.loading.set(false);
              this.router.navigateByUrl('/subject-selection');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Add Subject: ${error.error.message || error.error.title}`);
              console.error('Error Add Subject:', error.error);
              this.loading.set(false);
            }
          });
      }
    } else {
      this.toastService.showMessage('warn', 'Warning', 'Form is invalid! Please Fill All Recommended Field!');
      this.loading.set(false);
    }
  };

  onReset() {
    this.model = {
      studentId: "",
      subjectIds: [],
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.formSubscription?.unsubscribe();
  }

}
