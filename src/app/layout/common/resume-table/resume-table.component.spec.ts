import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeTableComponent } from './resume-table.component';

describe('ResumeTableComponent', () => {
  let component: ResumeTableComponent;
  let fixture: ComponentFixture<ResumeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResumeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
