import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationQuestionnaireComponent } from './evaluation-questionnaire.component';

describe('EvaluationQuestionnaireComponent', () => {
  let component: EvaluationQuestionnaireComponent;
  let fixture: ComponentFixture<EvaluationQuestionnaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationQuestionnaireComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EvaluationQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
