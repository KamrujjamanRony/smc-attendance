import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDetailsComponent } from './attendance-details.component';

describe('AttendanceDetailsComponent', () => {
  let component: AttendanceDetailsComponent;
  let fixture: ComponentFixture<AttendanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
