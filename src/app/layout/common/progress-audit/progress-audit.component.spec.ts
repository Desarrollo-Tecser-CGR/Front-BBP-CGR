import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressAuditComponent } from './progress-audit.component';

describe('ProgressAuditComponent', () => {
  let component: ProgressAuditComponent;
  let fixture: ComponentFixture<ProgressAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProgressAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
