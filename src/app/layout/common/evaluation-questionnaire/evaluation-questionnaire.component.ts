import { catchError, of, throwError, map, Observable } from 'rxjs';
import { Component, OnInit, Input, ViewEncapsulation, Renderer2, importProvidersFrom } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
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
import { CommonModule, NgForOf } from '@angular/common'; 

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
        CommonModule
  ],
  templateUrl: './evaluation-questionnaire.component.html',
  styleUrl: './evaluation-questionnaire.component.scss'
})

export class EvaluationQuestionnaireComponent implements OnInit{
  id: string = '';
  data: any = {};
  questions: any[] = [];
  verticalStepperForm: FormGroup;

  questionsGroups$: Observable<any[]>;
  currentGroupIndex: number = 0; // Índice del grupo actual
  currentGroup: any[] = []; // Preguntas del grupo actual
  allGroups: any[] = []; // Lista de todos los grupos de preguntas
  allQuestions: any[] = []; // Lista de todas las preguntas (aplanadas)
  answeredQuestions: { [key: string]: string } = {}; // Respuestas guardadas
  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  groupSize: number = 2; // Número de preguntas por grupo

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private questionnaireService: QuestionnaireService
  ) {
    this.verticalStepperForm = this.fb.group({
      questionGroups: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.questionsGroups$ = this.questionnaireService.getQuestionsGroups();
    this.questionsGroups$.subscribe((groups) => {
      this.allGroups = groups; // Poblar allGroups con los grupos de preguntas
      this.allQuestions = this.allGroups.flatMap(group => group); // Aplanar los grupos en un solo array
      this.loadGroup(this.currentGroupIndex); // Cargar el primer grupo
    });
  }

  // Cargar un grupo específico
  loadGroup(index: number): void {
    if (index >= 0 && index < this.allGroups.length) {
      this.currentGroup = this.allGroups[index]; // Actualizar el grupo actual
      this.currentGroupIndex = index; // Actualizar el índice del grupo actual
    }
  }

  // Navegar a una pregunta específica
  goToQuestion(index: number): void {
    if (index >= 0 && index < this.allQuestions.length) {
      this.currentQuestionIndex = index; // Actualizar el índice de la pregunta actual
      const groupIndex = Math.floor(index / this.groupSize); // Calcular el grupo correspondiente
      this.loadGroup(groupIndex); // Cargar el grupo correspondiente
    }
  }

  // Navegar al grupo anterior
  previousGroup(): void {
    if (this.currentGroupIndex > 0) {
      this.loadGroup(this.currentGroupIndex - 1); // Cargar el grupo anterior
    }
  }

  // Navegar al siguiente grupo
  nextGroup(): void {
    if (this.currentGroupIndex < this.allGroups.length - 1) {
      this.loadGroup(this.currentGroupIndex + 1); // Cargar el siguiente grupo
    }
  }

  // Manejar cambios en las respuestas
  onAnswerChange(questionId: string, answer: string): void {
    this.answeredQuestions[questionId] = answer; // Guardar la respuesta
  }

  // Calcular el número de pregunta correcto
  getQuestionNumber(indexInGroup: number): number {
    return (this.currentGroupIndex * this.groupSize) + (indexInGroup + 1);
  }
}



