import { Component, inject, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance-details',
  imports: [CoverComponent, RouterLink, CommonModule, FormsModule],
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css'
})
export class AttendanceDetailsComponent {
  private AttendanceService = inject(AttendanceService);

  filterAttendanceDetails = signal<any>([]);
  loading = signal<boolean>(false);
  today = new Date().toISOString().split('T')[0];
  fromDate: string = this.today;
  toDate: string = this.today;
  subjectId: string = "";
  studentId: string = "";
  search: string = "";


  ngOnInit(): void {
    this.filterData();
  }

  filterData() {
    this.loading.set(true);
    this.AttendanceService.getAttendanceDetails("", this.subjectId, this.studentId, this.search, this.fromDate, this.toDate).subscribe(data => {
      this.filterAttendanceDetails.set([...data]);
      this.loading.set(false);
    });
  }

  clearFilter() {
    this.fromDate = this.today;
    this.toDate = this.today;
    this.filterData();
  }

}
