import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffusionComponent } from './diffusion.component';

describe('DiffusionComponent', () => {
  let component: DiffusionComponent;
  let fixture: ComponentFixture<DiffusionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiffusionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiffusionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
