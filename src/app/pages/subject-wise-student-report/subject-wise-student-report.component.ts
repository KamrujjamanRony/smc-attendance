import { Component, inject, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchSelectComponent } from "../../components/primeng/search-select/search-select.component";
import { SubjectService } from '../../services/subject.service';
import { SearchSelectEditComponent } from "../../components/primeng/search-select/search-select-edit.component";
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataService } from '../../services/data.service';
import { CoverComponent } from '../../components/shared/cover/cover.component';

@Component({
  selector: 'app-subject-wise-student-report',
  imports: [CoverComponent, RouterLink, CommonModule, FormsModule, SearchSelectComponent, SearchSelectEditComponent, FormsModule],
  templateUrl: './subject-wise-student-report.component.html',
  styleUrl: './subject-wise-student-report.component.css'
})
export class SubjectWiseStudentReportComponent {
  private AttendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
  private subjectService = inject(SubjectService);

  private dataService = inject(DataService);

  filterAttendanceDetails = signal<any>([]);
  loading = signal<boolean>(false);
  subjectOption = signal<any[]>([]);
  sessionOption = signal<any[]>([]);
  batchOption = signal<any[]>([]);
  today = new Date().toISOString().split('T')[0];
  fromDate: string = this.today;
  toDate: string = this.today;
  subjectId: any = "";
  studentId: string = "";
  session: string = "";
  batch: string = "";
  search: string = "";
  auth: any = null;


  ngOnInit(): void {
    this.auth = this.authService.getUser();
    this.onLoadOptions();
  }

  onLoadOptions() {
    this.dataService.getOptions().subscribe((data: any) => {
      this.sessionOption.set(data.sessionOption);
      this.batchOption.set(data.batchOption);
      this.session = this.sessionOption()[0];
      this.batch = this.batchOption()[0];
    });
    this.subjectService.getSubject("", "").subscribe((data: any) => {
      if (data.length > 0) {
        // this.subjectOption.set(data.map((item: any) => ({ id: item.id, label: `${item.subName} (Phase ${item.semester.slice(-1)})` })));
        this.subjectOption.set(data.map((item: any) => ({ id: item.id, label: item.subName })));
        this.subjectId = data[0]?.id;
      }
      this.filterData();
    });
  };

  filterData() {
    this.loading.set(true);
    this.AttendanceService.getAttendanceDetails("", this.subjectId, this.studentId, this.search, this.fromDate, this.toDate, this.session, this.batch).subscribe({
      next: (data) => {
        this.filterAttendanceDetails.set([...data]);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching attendance details:', err);
        this.loading.set(false);
      }
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
    this.search = "";
    this.subjectId = this.subjectOption()[0]?.id;
    this.session = this.sessionOption()[0];
    this.batch = this.batchOption()[0];
    this.filterData();
  }

  public createPdf() {
    // Process data to group by student
    const studentData = this.processAttendanceData(this.filterAttendanceDetails());
    const selectSubject = this.subjectOption().find((d: any) => d.id == this.subjectId);

    const doc = new jsPDF('landscape');

    // Title
    doc.setFontSize(18);
    doc.text('Monthly Attendance Report - April 2025', 14, 20);
    doc.setFontSize(12);
    doc.text(`Subject: ${selectSubject?.label}`, 14, 28);

    // Prepare data for the table
    const { tableData, dayHeaders } = this.prepareTableData(studentData);

    // AutoTable
    autoTable(doc, {
      head: [['Roll No.', 'Student Name', ...dayHeaders, 'T/P', 'T/A', 'T/L']],
      body: tableData,
      startY: 35,
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [22, 160, 133]
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Roll No.
        1: { cellWidth: 40 }, // Student Name
        // Days columns will auto-size
        [dayHeaders.length + 2]: { cellWidth: 15 }, // Total P
        [dayHeaders.length + 3]: { cellWidth: 15 }, // Total A
        [dayHeaders.length + 4]: { cellWidth: 15 }  // Total L
      }
    });

    // Show PDF
    const pdfOutput = doc.output('blob');
    window.open(URL.createObjectURL(pdfOutput));
  }

  private processAttendanceData(data: any[]) {
    const students: { [key: number]: any } = {};

    data.forEach(record => {
      if (!students[record.studentId]) {
        students[record.studentId] = {
          studentId: record.studentId,
          rollNo: record.rollNo,
          studentName: record.studentName || 'Unknown',
          attendance: {},
          totals: { P: 0, A: 0, L: 0 }
        };
      }

      const date = new Date(record.date);
      const dayNumber = date.getDate(); // Get day of month (1-31)

      // Only keep the latest record if there are duplicates for the same day
      if (!students[record.studentId].attendance[dayNumber] ||
        date > new Date(students[record.studentId].attendance[dayNumber].date)) {
        students[record.studentId].attendance[dayNumber] = {
          status: this.getStatusText(record.status),
          date: record.date
        };
      }
    });

    // Calculate totals
    Object.values(students).forEach((student: any) => {
      Object.values(student.attendance).forEach((att: any) => {
        if (att.status === 'P') student.totals.P++;
        else if (att.status === 'A') student.totals.A++;
        else if (att.status === 'L') student.totals.L++;
      });
    });

    return students;
  }

  private prepareTableData(studentData: any) {
    const tableData = [];
    const uniqueDays = this.getUniqueDays(studentData);
    const dayHeaders = uniqueDays.map(day => day.toString());

    for (const studentId in studentData) {
      const student = studentData[studentId];
      const row: any[] = [
        student.rollNo,
        student.studentName
      ];

      // Add attendance for each day
      uniqueDays.forEach(day => {
        row.push(student.attendance[day]?.status || '-');
      });

      // Add totals
      row.push(student.totals.P);
      row.push(student.totals.A);
      row.push(student.totals.L);

      tableData.push(row);
    }

    return { tableData, dayHeaders };
  }

  private getUniqueDays(studentData: any) {
    const days = new Set<number>();

    for (const studentId in studentData) {
      for (const day in studentData[studentId].attendance) {
        days.add(parseInt(day));
      }
    }

    return Array.from(days).sort((a, b) => a - b);
  }

  private getStatusText(statusCode: number): string {
    switch (statusCode) {
      case 1: return 'P';
      case 2: return 'A';
      case 3: return 'L';
      default: return '-';
    }
  }

}
