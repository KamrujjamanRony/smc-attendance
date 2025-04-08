import { Component, inject, signal } from '@angular/core';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../components/primeng/toast/toast.service';
import { SubjectService } from '../../services/subject.service';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-subject-list',
  imports: [CoverComponent, RouterLink],
  templateUrl: './subject-list.component.html',
  styleUrl: './subject-list.component.css'
})
export class SubjectListComponent {
  private subjectService = inject(SubjectService);
  private dataService = inject(DataService);
  private toastService = inject(ToastService);

  filterSubject = signal<any>([]);
  loading = signal<boolean>(false);
  semesterOption: any;

  ngOnInit(): void {
    this.loading.set(true);
    this.dataService.getOptions().subscribe((data: any) => {
      this.semesterOption = data.semesterOption;
    });
    this.subjectService.getSubject("", "").subscribe(data => {
      this.filterSubject.set(data);
      this.loading.set(false);
    });
  }
  onDelete(id: any) {
    if (confirm("Are you sure you want to delete?")) {
      this.subjectService.deleteSubject(id).subscribe(data => {
        if (data.id) {
          this.toastService.showMessage('success', 'Success', 'Subject deleted successfully!');
          this.filterSubject.set(this.filterSubject().filter((a: any) => a.id !== data.id));
        } else {
          console.error('Error deleting Subject:', data);
          this.toastService.showMessage('error', 'Error', `Error deleting Subject: ${data.message || data.error.message}`);
        }
      });
    };
  }
  onDisplaySemester(id: any) {
    const semester = this.semesterOption.find((option: any) => option.id == id);
    return semester ? semester.name : id;
  }
}
