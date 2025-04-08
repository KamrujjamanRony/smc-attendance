import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceCategoryComponent } from './attendance-category.component';

describe('AttendanceCategoryComponent', () => {
  let component: AttendanceCategoryComponent;
  let fixture: ComponentFixture<AttendanceCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
