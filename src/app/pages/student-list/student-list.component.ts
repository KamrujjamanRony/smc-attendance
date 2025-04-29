import { Component, inject, signal } from '@angular/core';
import { StudentService } from '../../services/student.service';
import { CoverComponent } from "../../components/shared/cover/cover.component";
import { RouterLink } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-list',
  imports: [CoverComponent, RouterLink, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  private studentService = inject(StudentService);
  private toastService = inject(ToastService);

  filterStudent = signal<any>([]);
  search: string = "";
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.filterData();
  }

  filterData() {
    this.loading.set(true);
    this.studentService.getStudent("", this.search).subscribe(data => {
      this.filterStudent.set(data);
      this.loading.set(false);
    });
  }

  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.studentService.deleteStudent(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Student deleted successfully!');
          this.filterStudent.set(this.filterStudent().filter((a: any) => a.id !== data.id));
        } else {
          console.error('Error deleting Student:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Student: ${data.message || data.error.message}`);
        }
      });
    };
  }

}
