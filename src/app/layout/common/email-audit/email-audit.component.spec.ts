import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAuditComponent } from './email-audit.component';

describe('EmailAuditComponent', () => {
  let component: EmailAuditComponent;
  let fixture: ComponentFixture<EmailAuditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailAuditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
