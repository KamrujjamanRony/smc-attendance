import { Component, inject, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubjectService } from '../../services/subject.service';
import { SearchSelectEditComponent } from "../../components/primeng/search-select/search-select-edit.component";
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataService } from '../../services/data.service';
import { CoverComponent } from '../../components/shared/cover/cover.component';

@Component({
  selector: 'app-student-wise-subject-report',
  imports: [CoverComponent, CommonModule, FormsModule, SearchSelectEditComponent, FormsModule],
  templateUrl: './student-wise-subject-report.component.html',
  styleUrl: './student-wise-subject-report.component.css'
})
export class StudentWiseSubjectReportComponent {
  private AttendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
  private subjectService = inject(SubjectService);

  private dataService = inject(DataService);

  filterAttendanceDetails = signal<any>([]);
  loading = signal<boolean>(false);
  subjectOption = signal<any[]>([]);
  sessionOption = signal<any[]>([]);
  batchOption = signal<any[]>([]);
  header = signal<any>(null);
  marginTop = signal<any>(0);
  marginLeft = signal<any>(0);
  marginRight = signal<any>(0);
  marginBottom = signal<any>(0);
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
    this.dataService.getHeader().subscribe(data => {
      this.header.set(data);
      this.marginTop.set(data?.marginTop);
      this.marginLeft.set(data?.marginLeft);
      this.marginRight.set(data?.marginRight);
      this.marginBottom.set(data?.marginBottom);
    });
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
        console.log(this.subjectId)
        this.filterData();
      }
    });
  };

  filterData() {
    this.loading.set(true);
    this.AttendanceService.getStudentWiseAttendanceReport(this.subjectId, this.fromDate, this.toDate, this.search, this.session, this.batch).subscribe({
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

  clearFilter() {
    this.fromDate = this.today;
    this.toDate = this.today;
    this.search = "";
    this.subjectId = this.subjectOption()[0]?.id;
    this.session = this.sessionOption()[0];
    this.batch = this.batchOption()[0];
    this.filterData();
  }


  transform(value: any, args: any = 'dd/MM/yyyy'): any {
    if (!value) return null;
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(value, args);
  }

  public createPdf() {
    // Process data to group by student
    const selectSubject = this.subjectOption().find((d: any) => d.id == this.subjectId);

    // const doc = new jsPDF('landscape');


    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'A4' });
    const centerX = doc.internal.pageSize.getWidth() / 2;
    const marginLeft = this.marginLeft();
    const marginRight = this.marginRight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = (this.marginTop() || 0) + 10;

    // Header Section
    yPos = this.addPageHeader(doc, pageWidth, yPos);

    // Title
    doc.setFontSize(18);
    doc.text('Student Wise Attendance Report', centerX, yPos, { align: 'center' });
    yPos += 5;
    doc.setFontSize(12);
    doc.text(`Session: ${this.session}`, 15, yPos);
    doc.setFontSize(12);
    doc.text(`Subject: ${selectSubject?.label}`, centerX - 25, yPos);
    doc.setFontSize(12);
    doc.text(`Batch: ${this.batch}`, centerX + 100, yPos);
    yPos += 5;



    // Date Range
    doc.setFontSize(12);
    if (this.fromDate) {
      const dateRange = `From: ${this.transform(this.fromDate)} to: ${this.toDate ? this.transform(this.toDate) : this.transform(this.fromDate)}`;
      doc.text(dateRange, centerX, yPos, { align: 'center' });
      yPos += 5;
    }

    // Prepare data for the table
    const tableData = this.filterAttendanceDetails().map((item: any) => {
      return [item.rollNo, item.studentName, item.presentCount, item.absentCount, item.leaveCount, item.totalClasses]
    });
    console.log(tableData)

    // AutoTable
    autoTable(doc, {
      head: [['Roll No.', 'Student Name', 'Present', 'Absent', 'Leave', 'Total Classes']],
      body: tableData,
      startY: yPos,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        // lineWidth: 0.1,
        // lineColor: [0, 0, 0],
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle',
        cellWidth: 'wrap',
        minCellHeight: 10,
        minCellWidth: 10,
        font: 'helvetica',
        fontStyle: 'normal',
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      columnStyles: {
        0: { cellWidth: 20 }, // Roll No.
        1: { cellWidth: 'auto' }, // Student Name
        2: { cellWidth: 20 }, // Present
        3: { cellWidth: 20 }, // Absent
        4: { cellWidth: 20 }, // Leave
        5: { cellWidth: 30 }  // Total Classes
      }
    });

    // Show PDF
    const pdfOutput = doc.output('blob');
    window.open(URL.createObjectURL(pdfOutput));
  }


  // Helper method to add page header
  public addPageHeader(doc: jsPDF, pageWidth: number, yPos: number): any {
    // Header Section (on every page)
    if (this.header()?.name) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text(this.header()?.name, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(this.header()?.address, pageWidth / 2, yPos, { align: 'center' });
      yPos += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Contact: ${this.header()?.contact}`, pageWidth / 2, yPos, { align: 'center' });
      yPos += 2;
      doc.line(0, yPos, 560, yPos);
      yPos += 7;

      return yPos;
    }
  }

}
