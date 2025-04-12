import { Component, inject, signal } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting',
  imports: [CoverComponent, FormsModule, CommonModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css'
})
export class MeetingComponent {
  private MeetingService = inject(MeetingService);

  filterMeeting = signal<any>([]);
  today = new Date().toISOString().split('T')[0];
  fromDate: string = this.today;
  toDate: string = this.today;
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.loading.set(true);
    this.MeetingService.getMeeting("", "", this.fromDate, this.toDate).subscribe(data => {
      this.filterMeeting.set([...data]); // Create new array reference
      this.loading.set(false);
    });
  }

  filterByDate() {
    console.log("Filtering by date:", this.fromDate, this.toDate);
    this.loadMeetings();
  }

  clearFilter() {
    this.fromDate = this.today;
    this.toDate = this.today;
    this.loadMeetings();
  }

}
