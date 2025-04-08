import { Component, inject, signal } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { AttendanceCardComponent } from "../../components/shared/attendance-card/attendance-card.component";
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-attendance',
  imports: [AttendanceCardComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent {
  private studentService = inject(StudentService);
  private subjectService = inject(SubjectService);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;

  filterStudent = signal<any[]>([]);
  attendanceMap = signal<Map<number, string>>(new Map());
  loading = signal<boolean>(false);
  subjectId: any = null;
  subjectName: any = null;



  ngOnInit(): void {
    this.loading.set(true);
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.subjectId = params.get('subjectId');
        if (this.subjectId) {
          this.studentService.getStudent("", "").subscribe(data => {
            this.filterStudent.set(data);
            this.loading.set(false);
          });
          // Assuming you have a method to get the s
          this.subjectService.getSubject(this.subjectId, "").subscribe((data: any) => {
            if (data.length > 0) {
              this.subjectName = data[0].subName;
            }
          })
        }
      }
    });
  }

  handleAttendanceChange(data: { id: number, status: string }) {
    const map = new Map(this.attendanceMap());
    map.set(data.id, data.status);
    this.attendanceMap.set(map);
  }

  selectAll(status: string) {
    const newMap = new Map<number, string>();
    this.filterStudent().forEach(student => {
      newMap.set(student.id, status);
    });
    this.attendanceMap.set(newMap);
  }

  submitAttendance() {
    const attendanceList = this.filterStudent().map(student => ({
      id: student.id,
      name: student.name,
      status: this.attendanceMap().get(student.id) || 'Not Selected',
    }));
    const notSelectedCount = attendanceList.filter(item => item.status === 'Not Selected');
    if (notSelectedCount.length > 0) {
      const notSelectedNames = notSelectedCount.map(item => item.name).join(', ');
      // Optional: show a toast message or alert
      this.toastService.showMessage('error', `Please select attendance for ${notSelectedNames} students.`, ``);
      return;
    }
    console.log(attendanceList.map(item => {
      return {
        id: item.id,
        status: item.status
      };
    }));

    // Optional: send to server or show success toast
    this.toastService.showMessage('success', 'Success', 'Attendance submitted successfully!');
  }

}
