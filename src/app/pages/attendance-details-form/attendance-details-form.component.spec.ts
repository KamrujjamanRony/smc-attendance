import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceDetailsFormComponent } from './attendance-details-form.component';

describe('AttendanceDetailsFormComponent', () => {
  let component: AttendanceDetailsFormComponent;
  let fixture: ComponentFixture<AttendanceDetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
