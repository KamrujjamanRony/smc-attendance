import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWiseSubjectReportComponent } from './student-wise-subject-report.component';

describe('StudentWiseSubjectReportComponent', () => {
  let component: StudentWiseSubjectReportComponent;
  let fixture: ComponentFixture<StudentWiseSubjectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentWiseSubjectReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentWiseSubjectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
