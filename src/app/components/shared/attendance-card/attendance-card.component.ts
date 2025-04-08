import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-attendance-card',
  imports: [],
  templateUrl: './attendance-card.component.html',
  styleUrl: './attendance-card.component.css'
})
export class AttendanceCardComponent {
  @Input() student: any;
  @Input() selectedStatus: string = '';
  @Output() attendanceChange = new EventEmitter<{ id: number, status: string }>();

  setAttendance(status: string) {
    this.attendanceChange.emit({ id: this.student.id, status });
  }

}
