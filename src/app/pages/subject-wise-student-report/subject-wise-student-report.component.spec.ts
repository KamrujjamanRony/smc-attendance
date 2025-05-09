import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWiseStudentReportComponent } from './subject-wise-student-report.component';

describe('SubjectWiseStudentReportComponent', () => {
  let component: SubjectWiseStudentReportComponent;
  let fixture: ComponentFixture<SubjectWiseStudentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectWiseStudentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectWiseStudentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
