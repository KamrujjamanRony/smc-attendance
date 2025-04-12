import { Component, inject, signal } from '@angular/core';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { MeetingService } from '../../services/meeting.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting-list',
  imports: [CoverComponent, RouterLink, CommonModule],
  templateUrl: './meeting-list.component.html',
  styleUrl: './meeting-list.component.css'
})
export class MeetingListComponent {
  private MeetingService = inject(MeetingService);
  private toastService = inject(ToastService);

  filterMeeting = signal<any>([]);
  selectedRole: any = '';
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.MeetingService.getMeeting("", "", "", "").subscribe(data => {
      this.filterMeeting.set(data);
      this.loading.set(false);
    });
  }
  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.MeetingService.deleteMeeting(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Meeting deleted successfully!');
          this.filterMeeting.set(this.filterMeeting().filter((a: any) => a.id !== data.id));
        } else {
          console.error('Error deleting Meeting:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Meeting: ${data.message || data.error.message}`);
        }
      });
    };
  }

}
