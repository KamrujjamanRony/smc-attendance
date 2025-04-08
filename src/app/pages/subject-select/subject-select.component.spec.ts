import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSelectComponent } from './subject-select.component';

describe('SubjectSelectComponent', () => {
  let component: SubjectSelectComponent;
  let fixture: ComponentFixture<SubjectSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
