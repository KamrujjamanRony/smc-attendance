import { Component, inject, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchSelectComponent } from "../../components/primeng/search-select/search-select.component";
import { SubjectService } from '../../services/subject.service';
import { SearchSelectEditComponent } from "../../components/primeng/search-select/search-select-edit.component";
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-attendance-details',
  imports: [CoverComponent, RouterLink, CommonModule, FormsModule, SearchSelectComponent, SearchSelectEditComponent],
  templateUrl: './attendance-details.component.html',
  styleUrl: './attendance-details.component.css'
})
export class AttendanceDetailsComponent {
  private AttendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
  private subjectService = inject(SubjectService);
  private studentService = inject(StudentService);

  filterAttendanceDetails = signal<any>([]);
  loading = signal<boolean>(false);
  subjectOption = signal<any[]>([]);
  studentOption = signal<any[]>([]);
  today = new Date().toISOString().split('T')[0];
  fromDate: string = this.today;
  toDate: string = this.today;
  subjectId: string = "";
  studentId: string = "";
  search: string = "";
  auth: any = null;


  ngOnInit(): void {
    this.auth = this.authService.getUser();
    this.onLoadOptions();
  }

  onLoadOptions() {
    this.subjectService.getSubject("", "").subscribe((data: any) => {
      if (data.length > 0) {
        this.subjectOption.set(data.map((item: any) => ({ id: item.id, label: `${item.subName} (Phase ${item.semester.slice(-1)})` })));
        this.subjectId = data[0]?.id;
      }
      this.filterData();
    });
    this.studentService.getStudent("", "").subscribe((data: any) => {
      if (data.length > 0) {
        this.studentOption.set(data.map((item: any) => ({ id: item.id, label: `${item.rollNo} - ${item.name} - ${item.rgeNo}` })));
      }
    });
  };

  filterData() {
    this.loading.set(true);
    this.AttendanceService.getAttendanceDetails("", this.subjectId, this.studentId, this.search, this.fromDate, this.toDate).subscribe(data => {
      this.filterAttendanceDetails.set([...data]);
      this.loading.set(false);
    });
  }

  handleSubjectChange(data: any) {
    this.subjectId = data;
    this.filterData();
  }

  handleStudentChange(data: any) {
    this.studentId = data?.id;
    this.filterData();
  }

  clearFilter() {
    this.fromDate = this.today;
    this.toDate = this.today;
    this.subjectId = this.subjectOption()[0]?.id;
    this.studentId = "";
    this.search = "";
    this.filterData();
  }

  exportToPDF() {
    throw new Error('Method not implemented.');
  }

}
