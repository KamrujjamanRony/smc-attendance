import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MeetingService } from '../../services/meeting.service';

@Component({
  selector: 'app-meeting-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './meeting-form.component.html',
  styleUrl: './meeting-form.component.css'
})
export class MeetingFormComponent {
  private MeetingService = inject(MeetingService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  id: any = null;
  model?: any;
  paramsSubscription?: Subscription;
  MeetingSubscription?: Subscription;
  loading = signal<boolean>(false);

  constructor() {
    this.onReset();
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.id = params.get('id');
        if (this.id) {
          this.MeetingService.getMeeting(this.id, "", "", "")
            .subscribe({
              next: (response) => {
                if (response) {
                  this.model = { ...response[0], date: response[0].date.split('T')[0] };
                  console.log(this.model)
                }
              }
            });
        }
      }
    });
  }

  onFormSubmit(): void {
    const { date, subj, desc, link } = this.model;
    this.loading.set(true);
    if (date && subj && desc && link) {

      if (this.id) {
        this.MeetingSubscription = this.MeetingService.updateMeeting(this.id, this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Meeting Update successfully');
              this.onReset();
              this.id = null;
              this.loading.set(false);
              this.router.navigateByUrl('/meeting-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Update Meeting: ${error.error.message || error.error.title}`);
              console.error('Error Update Meeting:', error.error);
              this.loading.set(false);
            }
          });
      } else {
        this.MeetingSubscription = this.MeetingService.addMeeting(this.model)
          .subscribe({
            next: (response) => {
              this.toastService.showMessage('success', 'Success', 'Meeting Add successfully');
              this.onReset();
              this.loading.set(false);
              this.router.navigateByUrl('/meeting-list');
            },
            error: (error) => {
              this.toastService.showMessage('error', 'Error', `Error Add Meeting: ${error.error.message || error.error.title}`);
              console.error('Error Add Meeting:', error.error);
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
      date: "",
      subj: "",
      desc: "",
      link: "",
    };
  }

  ngOnDestroy(): void {
    this.paramsSubscription?.unsubscribe();
    this.MeetingSubscription?.unsubscribe();
  }

}
