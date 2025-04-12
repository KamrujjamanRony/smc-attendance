import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceSubmitComponent } from './attendance-submit.component';

describe('AttendanceSubmitComponent', () => {
  let component: AttendanceSubmitComponent;
  let fixture: ComponentFixture<AttendanceSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceSubmitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
