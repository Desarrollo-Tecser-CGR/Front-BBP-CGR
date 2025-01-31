import { throwError } from 'rxjs';
import { Component, OnInit, Input, ViewEncapsulation, Renderer2 } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import {FormBuilder, FormGroup, FormsModule,ReactiveFormsModule,UntypedFormBuilder,UntypedFormGroup,Validators,FormArray, Form
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
        MatCheckbox
  ],
  templateUrl: './evaluation-questionnaire.component.html',
  styleUrl: './evaluation-questionnaire.component.scss'
})

export class EvaluationQuestionnaireComponent{
    id: string='';
    formData: any = {};
    data: any = {};
    questions : any = [];
    verticalStepperForm: FormGroup;
    
    constructor(
      private resumenService: ResumenService, 
      private route: ActivatedRoute,
      private fb:FormBuilder,
      private questionnaireService: QuestionnaireService
      ){
    }

    ngOnInit(): void{
      //traer hoja de vida por id
      this.id=this.route.snapshot.paramMap.get('id');
      this.resumenService.getDataAsJson(this.id).subscribe(
      (response)=>{
          this.data = response;
          console.log('Practica:', this.data);
          return this.data;
      },
      (error)=>{
        Swal.fire({
        title: 'Error',
        text: `No se pudo abrir la practica.${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        });
      }
    );

    this.questionnaireService.getQuestionsGroups().subscribe(
      (groups)=>{
        this.questions = groups;
        console.log('Preguntas en el ts:', this.questions);
        this.verticalStepperForm = this.fb.group(
          this.questions.reduce((steps, group, index)=>{
            steps[`step${index + 1}`]= this.fb.group({
              questions: this.fb.array(
                group.map(()=> this.fb.control(false))
              )
          });
          return steps;
        },
      (error)=>{
        Swal.fire({
          title: 'Error',
          text: `No se pudo abrir el cuestionario.${error}`,
          icon: 'error',
          confirmButtonText: 'Aceptar',
          });
      }
      ));
    });
  }
  
  getQuestions(index: number):FormArray{
    return this.verticalStepperForm.get(`step${index}.questions`) as FormArray;
  }

      //incluir formulario de evaluación 
      checkFormValidity(form: FormGroup): boolean {
        let isValid = true;

        Object.keys(form.controls).forEach((step) => {
            const group = form.get(step) as FormGroup;
            if (group) {
                Object.keys(group.controls).forEach((control) => {
                    const formControl = group.get(control);
                    if (formControl && formControl.enabled && formControl.invalid) {
                        isValid = false;
                    }
                });
            }
        });

        return isValid;
    }
    

}


