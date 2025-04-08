import { Component, inject, signal } from '@angular/core';
import { MeetingService } from '../../services/meeting.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meeting',
  imports: [CoverComponent, FormsModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css'
})
export class MeetingComponent {
  private MeetingService = inject(MeetingService);

  filterMeeting = signal<any>([]);
  fromDate: any = '';
  toDate: any = '';
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loading.set(true);
    this.MeetingService.getMeeting("", "", "", "").subscribe(data => {
      this.filterMeeting.set(data);
      this.loading.set(false);
    });
  }

}
