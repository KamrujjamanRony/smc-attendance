import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-attendance-card',
  imports: [],
  templateUrl: './attendance-card.component.html',
  styleUrl: './attendance-card.component.css'
})
export class AttendanceCardComponent {
  @Input() student: any;
  @Input() selectedStatus: number = 0;
  @Output() attendanceChange = new EventEmitter<{ id: number, status: number }>();

  setAttendance(status: number) {
    this.attendanceChange.emit({ id: this.student.id, status });
  }

}
