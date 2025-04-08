import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SubjectService } from '../../services/subject.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-subject-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './subject-form.component.html',
  styleUrl: './subject-form.component.css'
})
export class SubjectFormComponent {
  private subjectService = inject(SubjectService);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  subjectSubscription?: Subscription;
  loading = signal<boolean>(false);
  semesterOption = signal<any[]>([]);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.onLoadOptions();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.subjectService.getSubject(this.id, "")
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
  }

  onLoadOptions() {
    this.dataService.getOptions().subscribe((data: any) => {
      this.semesterOption.set(data.semesterOption);
    })
  }

  onFormSubmit(): void {
    const { subName, semester } = this.model;
    this.loading.set(true);
    if (subName && semester) {

      if (this.id) {
        this.subjectSubscription = this.subjectService.updateSubject(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Subject Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/subject-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Subject: ${error.error.message || error.error.title}`);
              console.error('Error Update Subject:', error.error);
              this.loading.set(false);
            }
          });
      } else {
        this.subjectSubscription = this.subjectService.addSubject(this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Subject Add successfully');
              this.onReset();
              this.loading.set(false);
              this.router.navigateByUrl('/subject-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Add Subject: ${error.error.message || error.error.title}`);
              console.error('Error Add Subject:', error.error);
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
      subName: "",
      semester: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.subjectSubscription?.unsubscribe();
  }

}
