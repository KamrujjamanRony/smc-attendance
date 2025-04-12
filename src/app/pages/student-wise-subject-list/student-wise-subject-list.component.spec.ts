import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentWiseSubjectListComponent } from './student-wise-subject-list.component';

describe('StudentWiseSubjectListComponent', () => {
  let component: StudentWiseSubjectListComponent;
  let fixture: ComponentFixture<StudentWiseSubjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentWiseSubjectListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentWiseSubjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
