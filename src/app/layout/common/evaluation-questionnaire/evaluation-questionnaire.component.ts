import { catchError, of, throwError, map } from 'rxjs';
import { Component, OnInit, Input, ViewEncapsulation, Renderer2, importProvidersFrom } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import {FormBuilder, FormGroup, FormsModule,ReactiveFormsModule,UntypedFormBuilder,UntypedFormGroup,Validators,FormArray, Form, FormControl
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResumenComponent } from 'app/modules/resumen/resumen.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckbox } from '@angular/material/checkbox';
import { QuestionnaireService } from './evaluation-questionnaire.service';
import { NgForOf } from '@angular/common'; 

@Component({
  selector: 'app-evaluation-questionnaire',
  standalone: true,
  imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule,
        MatButtonModule,
        MatDialogModule,
        FormsModule,
        ResumenComponent,
        MatStepperModule,
        MatSelectModule,
        MatRadioModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        FormsModule,
        ReactiveFormsModule,
        MatCheckbox,
        NgForOf,
          
  ],
  templateUrl: './evaluation-questionnaire.component.html',
  styleUrl: './evaluation-questionnaire.component.scss'
})

export class EvaluationQuestionnaireComponent{
  id: string = '';
  data: any = {};
  questions: any[] = [];
  verticalStepperForm: FormGroup;

  constructor(
      private resumenService: ResumenService,
      private route: ActivatedRoute,
      private fb: FormBuilder,
      private questionnaireService: QuestionnaireService
  ) {
      this.verticalStepperForm = this.fb.group({
          questionGroups: this.fb.array([])
      });
  }


  ngOnInit(): void {
      this.id = this.route.snapshot.paramMap.get('id');
      this.resumenService.getDataAsJson(this.id).subscribe(
          (response) => {
              this.data = response;
              console.log('Práctica:', this.data);
          },
          (error) => {
              Swal.fire({
                  title: 'Error',
                  text: `No se pudo abrir la práctica. ${error}`,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
              });
          }
      );

      // Obtener preguntas
      this.questionnaireService.getQuestionsGroups().pipe(
          catchError((error) => {
              Swal.fire({
                  title: 'Error',
                  text: `No se pudo abrir el cuestionario. ${error.message}`,
                  icon: 'error',
                  confirmButtonText: 'Aceptar',
              });
              return of([]);
          })
      ).subscribe((groups) => {
          if (!groups || groups.length === 0) {
              console.warn('No se recibieron grupos de preguntas.');
              return;
          }
          this.questions = groups;
          console.log('Preguntas', this.questions);
          this.populateForm();
      });
  }
  get questionsArray(): FormArray {
    return this.verticalStepperForm.get('questionGroups') as FormArray;
  }

  populateForm():void {
    this.questions.forEach((group, groupIndex)=>{
        const groupFromArray = this.fb.array([]);
        group.forEach((question:any)=>{
            const optionsFormArray = this.fb.array([]);
            question.options.map(()=> this.fb.control(false));
            });
            const questionFormGroup = this.fb.group({
                question:  this.questions
            })
            this.questionsArray.push(groupFromArray);
        });
    };
  }
  // getQuestions(index: number): FormArray {
  //   return this.verticalStepperForm.get(`step${index + 1}.questions`) as FormArray;
  // }
  
  // checkFormValidity(form: FormGroup): boolean {
  //   let isValid = true;
  
  //   Object.keys(form.controls).forEach((step) => {
  //     const group = form.get(step) as FormGroup;
  //     if (group) {
  //       Object.keys(group.controls).forEach((control) => {
  //         const formControl = group.get(control);
  //         if (formControl && formControl.enabled && formControl.invalid) {
  //           isValid = false;
  //         }
  //       });
  //     }
  //   });
  
  //   return isValid;
  // }



