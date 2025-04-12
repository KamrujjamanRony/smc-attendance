import { Component, inject, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { StudentWiseSubjectService } from '../../services/student-wise-subject.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';

@Component({
  selector: 'app-student-wise-subject-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './student-wise-subject-list.component.html',
  styleUrl: './student-wise-subject-list.component.css'
})
export class StudentWiseSubjectListComponent {
  private studentWiseSubjectService = inject(StudentWiseSubjectService);
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);
  private subjectService = inject(SubjectService);

  filterStuWiseSub = signal<any>([]);
  loading = signal<boolean>(false);
  studentsMap = signal<Map<string, string>>(new Map());
  subjectsMap = signal<Map<string, string>>(new Map());

  ngOnInit(): void {
    this.loading.set(true);
    this.studentWiseSubjectService.getStuWiseSub("", "").subscribe(data => {
      this.filterStuWiseSub.set(data);
      this.loadStudentsAndSubjects(data);
      this.loading.set(false);
    });
  }

  loadStudentsAndSubjects(data: any[]) {
    // Get unique student IDs
    const studentIds = [...new Set(data.map(item => item.studentId))];

    // Get all subject IDs (they might be arrays)
    const subjectIds = data.flatMap(item =>
      Array.isArray(item.subjectIds) ? item.subjectIds : [item.subjectIds]
    );
    const uniqueSubjectIds = [...new Set(subjectIds)];

    // Load students
    studentIds.forEach(id => {
      this.studentService.getStudent(id.toString(), "").subscribe(studentData => {
        if (studentData && studentData.length > 0) {
          const map = this.studentsMap();
          map.set(id, studentData[0].name);
          this.studentsMap.set(map);
        }
      });
    });

    // Load subjects
    uniqueSubjectIds.forEach(id => {
      this.subjectService.getSubject(id.toString(), "").subscribe(subjectData => {
        if (subjectData && subjectData.length > 0) {
          const map = this.subjectsMap();
          map.set(id, subjectData[0].subName);
          this.subjectsMap.set(map);
        }
      });
    });
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.studentWiseSubjectService.deleteStuWiseSub(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Student Wise Subject deleted successfully!');
          this.filterStuWiseSub.set(this.filterStuWiseSub().filter((a: any) => a.id !== data.id));
        } else {
          console.error('Error deleting Student Wise Subject:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Student Wise Subject: ${data.message || data.error.message}`);
        }
      });
    };
  };

  onDisplayStudent(id: string): string {
    return this.studentsMap().get(id) || 'Unknown';
  }

  onDisplaySubjects(ids: string | string[]): string {
    const subjectIds = Array.isArray(ids) ? ids : [ids];
    return subjectIds.map(id => this.subjectsMap().get(id) || 'Unknown').join(', ');
  }
}
