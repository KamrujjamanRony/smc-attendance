import { Component, inject, signal } from '@angular/core';
import { AttendanceCardComponent } from '../../components/shared/attendance-card/attendance-card.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AttendanceService } from '../../services/attendance.service';
import { StudentWiseSubjectService } from '../../services/student-wise-subject.service';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-attendance-submit',
  imports: [AttendanceCardComponent, FormsModule],
  templateUrl: './attendance-submit.component.html',
  styleUrl: './attendance-submit.component.css'
})
export class AttendanceSubmitComponent {
  private authService = inject(AuthService);
  private AttendanceService = inject(AttendanceService);
  private studentWiseSubjectService = inject(StudentWiseSubjectService);
  private studentService = inject(StudentService);
  private subjectService = inject(SubjectService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  paramsSubscription?: Subscription;

  filterStudent = signal<any[]>([]);
  attendanceMap = signal<Map<number, number>>(new Map());
  loading = signal<boolean>(false);
  subjectId: any = null;
  subjectName: any = null;
  today = new Date().toISOString().split('T')[0];
  selectedDate: string = this.today;
  user: any = null;

  ngOnInit(): void {
    this.loading.set(true);
    this.user = this.authService.getUser();
    this.paramsSubscription = this.route.paramMap.subscribe({
      next: (params) => {
        this.subjectId = params.get('subjectId')?.split('+');
        if (this.subjectId) {
          this.studentWiseSubjectService.getStuWiseSub("", this.subjectId[0], this.subjectId[1], this.subjectId[2]).subscribe(data => {
            // Fetch student details for each studentId in the response
            this.fetchStudentDetails(data);
          });
          this.subjectService.getSubject(this.subjectId[0], "").subscribe((data: any) => {
            if (data.length > 0) {
              this.subjectName = data[0].subName;
            }
          });
        }
      }
    });
  }

  /** 
   * Fetch student details (including name) for each student in the `getStuWiseSub` response.
   * Then update `filterStudent()` with the merged data.
   */
  fetchStudentDetails(studentsWithSubjects: any[]) {
    if (studentsWithSubjects.length === 0) {
      this.filterStudent.set([]);
      this.loading.set(false);
      return;
    }

    // Create an array of observables to fetch each student
    const studentObservables = studentsWithSubjects.map(sws =>
      this.studentService.getStudent(sws.studentId.toString(), "")
    );

    // Fetch all students in parallel
    forkJoin(studentObservables).subscribe({
      next: (studentsResponses) => {
        // Merge student details with the original data
        const mergedData = studentsWithSubjects.map((sws, index) => {
          const studentResponse = studentsResponses[index];
          // Assuming the response is an array with at least one student
          const student = studentResponse[0]; // Get the first student in the response
          return {
            ...sws,
            name: student ? student.name : 'Unknown', // Include student name
            rollNo: student ? student.rollNo : 'Unknown',
            rgeNo: student ? student.rgeNo : 'Unknown',
          };
        });
        this.filterStudent.set(mergedData);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching student details:', err);
        this.loading.set(false);
      }
    });
  }

  handleAttendanceChange(data: { id: number, status: number }) {
    const map = new Map(this.attendanceMap());
    map.set(data.id, data.status);
    this.attendanceMap.set(map);
  }

  selectAll(status: number) {
    const newMap = new Map<number, number>();
    this.filterStudent().forEach(student => {
      newMap.set(student.id, status);
    });
    this.attendanceMap.set(newMap);
  }

  submitAttendance() {
    const attendanceList = this.filterStudent().map(student => ({
      id: student.studentId,
      name: student.name,
      status: this.attendanceMap().get(student.id) || 0,
    }));
    const notSelectedCount = attendanceList.filter(item => item.status === 0);
    if (notSelectedCount.length > 0) {
      const notSelectedNames = notSelectedCount.map(item => item.name).join(', ');
      this.toastService.showMessage('error', `Please select attendance for ${notSelectedNames} students.`, ``);
      return;
    }
    if (this.selectedDate > this.today) {
      this.toastService.showMessage('error', 'Error', 'Attendance cannot be submitted for future dates.');
      return;
    }
    const requstBody = {
      subjectId: +this.subjectId[0],
      date: this.selectedDate,
      postBy: this.user.userName,
      createStudentAttendanceDetailDto: attendanceList.map(item => {
        return {
          studentId: item.id,
          status: item.status,
        };
      })
    };

    if (requstBody) {
      this.loading.set(true);
      this.AttendanceService.addAttendance(requstBody).subscribe({
        next: () => {
          this.toastService.showMessage('success', 'Success', 'Attendance submitted successfully!');
          this.router.navigateByUrl('/attendance-details');
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Error submitting attendance:', error);
          this.toastService.showMessage('error', 'Error', 'Failed to submit attendance. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }

}
