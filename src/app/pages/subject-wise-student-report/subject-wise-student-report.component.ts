import { Component, inject, signal } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataService } from '../../services/data.service';
import { CoverComponent } from '../../components/shared/cover/cover.component';
import { StudentService } from '../../services/student.service';
import { SearchSelectComponent } from "../../components/primeng/search-select/search-select.component";

@Component({
  selector: 'app-subject-wise-student-report',
  imports: [CoverComponent, CommonModule, FormsModule, FormsModule, SearchSelectComponent],
  templateUrl: './subject-wise-student-report.component.html',
  styleUrl: './subject-wise-student-report.component.css'
})
export class SubjectWiseStudentReportComponent {
  private AttendanceService = inject(AttendanceService);
  private authService = inject(AuthService);
  private studentService = inject(StudentService);
  private dataService = inject(DataService);

  filterAttendanceDetails = signal<any>([]);
  loading = signal<boolean>(false);
  studentOption = signal<any[]>([]);
  sessionOption = signal<any[]>([]);
  batchOption = signal<any[]>([]);
  today = new Date().toISOString().split('T')[0];
  fromDate: string = this.today;
  toDate: string = this.today;
  studentId: any = null;
  session: string = "";
  batch: string = "";
  search: string = "";
  auth: any = null;
  header = signal<any>(null);
  marginTop = signal<any>(0);
  marginLeft = signal<any>(0);
  marginRight = signal<any>(0);
  marginBottom = signal<any>(0);


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
    this.AttendanceService.getSubjectWiseAttendanceReport(this.studentId, this.fromDate, this.toDate, this.search, this.session, this.batch).subscribe({
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

  handleStudentChange(data: any) {
    this.studentId = data?.id;
    this.filterData();
  }

  clearFilter() {
    this.fromDate = this.today;
    this.toDate = this.today;
    this.search = "";
    this.studentId = null;
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
    yPos = this.addPageTitle(doc, centerX, yPos);


    // Prepare data for the table
    const tableBodyData = this.filterAttendanceDetails().map((item: any) => {
      return [item.subjectName, item.presentCount, item.absentCount, item.leaveCount, item.totalClasses]
    });

    const tableHeaders = ['Subject Name', 'Present', 'Absent', 'Leave', 'Total Classes'];

    // AutoTable
    autoTable(doc, {
      head: [tableHeaders],
      body: tableBodyData,
      startY: yPos,
      styles: {
        fontSize: 10,
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
        fontSize: 12,
      },
      columnStyles: {
        0: { cellWidth: 'auto', halign: 'left' }, // Subject Name
        1: { cellWidth: 20 }, // Present
        2: { cellWidth: 20 }, // Absent
        3: { cellWidth: 20 }, // Leave
        4: { cellWidth: 30 }  // Total Classes
      },
      didParseCell: (data) => {
        if (data.section === 'head' && data.column.index === 0) {
          data.cell.styles.halign = 'left';
        }
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
  // Helper method to add page Title
  public addPageTitle(doc: jsPDF, centerX: number, yPos: number): any {
    const selectStudent = this.studentOption().find((d: any) => d.id == this.studentId);
    // Title Section
    doc.setFontSize(18);
    doc.text('Subject Wise Attendance Report', centerX, yPos, { align: 'center' });
    if (selectStudent) {
      yPos += 5;
      doc.setFontSize(12);
      doc.text(`Student Name: ${selectStudent?.label?.split(" - ")[1]}`, 15, yPos);
      doc.setFontSize(12);
      doc.text(`Reg: ${selectStudent?.label?.split(" - ")[2]}`, centerX + 25, yPos);
      doc.setFontSize(12);
      doc.text(`Roll: ${selectStudent?.label?.split(" - ")[0]}`, centerX + 100, yPos);
    }


    yPos += 5;
    doc.setFontSize(12);
    doc.text(`Session: ${this.session}`, 15, yPos);
    doc.setFontSize(12);
    doc.text(`Batch: ${this.batch}`, centerX + 100, yPos);



    // Date Range
    doc.setFontSize(12);
    if (this.fromDate) {
      const dateRange = `From: ${this.transform(this.fromDate)} to: ${this.toDate ? this.transform(this.toDate) : this.transform(this.fromDate)}`;
      doc.text(dateRange, centerX, yPos, { align: 'center' });
      yPos += 5;
    }

    return yPos;
  }

}
