import { catchError, of, throwError, map, Observable } from 'rxjs';
import { Component, OnInit, Input, ViewEncapsulation, Renderer2, importProvidersFrom } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule, Routes } from '@angular/router';
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
import { QuestionnaireService } from './evolution-questionnaire.service';
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
  templateUrl: './evolution-questionnaire.component.html',
  styleUrl: './evolution-questionnaire.component.scss'
})

export class EvaluationQuestionnaireComponent implements OnInit{
  id: any;
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
  formularioId: number;

  estimacionTrue:string = "enviada"
  estimacionFalse: string = "malaPractica"

  allForms: any[] = []

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private questionnaireService: QuestionnaireService,
    private router:Router
  ) {
    this.verticalStepperForm = this.fb.group({
      questionGroups: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getQuestions();
  }

  getQuestions() {
    this.questionnaireService.getQuestion().subscribe(groups => {
      console.log(groups)
      this.allForms = groups.data; // Guardamos todos los formularios
      this.selectForm(0); // Inicializamos con el primer formulario (índice 0)
    });
  }

  // Método para seleccionar un formulario por su índice en el array
selectForm(index: number) {
  const selectedForm = this.allForms[index]; // Obtenemos el formulario seleccionado
  
  this.formularioId = selectedForm.id; // Guardamos su ID
  this.allQuestions = selectedForm.questions.map((q: any) => ({
    ...q,
    respuesta: '', // Inicializamos respuesta en vacío
  }));

  // Inicializar el objeto de seguimiento de respuestas
  this.answeredQuestions = this.allQuestions.reduce((acc, q) => {
    acc[q.id] = false;
    return acc;
  }, {} as { [key: string]: boolean });

  // Agrupar preguntas en conjuntos del tamaño deseado
  this.allGroups = this.chunkArray(this.allQuestions, this.groupSize);

  // Cargar el primer grupo de preguntas
  this.loadGroup(this.currentGroupIndex);
}

  chunkArray(arr: any[], size: number): any[][] {
    if (!arr || size <= 0) return []; // Evita divisiones por 0 o valores inválidos
    const result = Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
      arr.slice(i * size, i * size + size)
    );
    return result;
  }  

  // Cargar un grupo específico
  loadGroup(index: number): void {
    if (index >= 0 && index < this.allGroups.length) {
      this.currentGroup = this.allGroups[index]; 
      this.currentGroupIndex = index; 
    } else {
      console.error("Índice de grupo fuera de rango");
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
      this.currentGroupIndex++; // Asegurar que el índice se actualice correctamente
      this.loadGroup(this.currentGroupIndex); // Cargar el grupo actualizado
    }
  }

  // Manejar cambios en las respuestas
  onAnswerChange(questionId: number, selectedOption: string) {
    this.answeredQuestions[questionId] = selectedOption;
  
    // Buscar la pregunta y actualizar su campo 'respuesta'
    const question = this.allQuestions.find(q => q.id === questionId);
    if (question) {
      question.respuesta = selectedOption;
    }
  }  

  // Calcular el número de pregunta correcto
  getQuestionNumber(indexInGroup: number): number {
    return (this.currentGroupIndex * this.groupSize) + (indexInGroup + 1);
  }

  get todasRespondidas(): boolean {
    return Object.values(this.answeredQuestions).every(value => value);
  }

  enviarFormulario(estimacion:any){
    const userId: any = localStorage.getItem('Iduser')
    const idQuestions = this.allQuestions.map(q => q.id);  // Extraer los IDs de las preguntas
    const idAnswers = this.allQuestions.map(q => q.respuesta === "si" ? 1 : 2); // Extraer las respuestas seleccionadas

    console.log(this.formularioId)
    console.log(idQuestions)
    console.log(idAnswers)
    // setTimeout(() => {
    //   this.alert();
    //}, 3000);
    this.questionnaireService.enviarCuestionario(this.formularioId, userId, idAnswers, idQuestions,this.id, 1, estimacion).subscribe(
      response => {
        console.log('Cuestionario enviado con éxito', response);
        setTimeout(() => {
          this.alert();
        }, 3000);
      }, error => {
        console.error('Error al enviar el cuestionario', error)
      }
    )
  }

  alert(){
    Swal.fire({
      icon: 'success',
      title: 'Registro Exitoso',
      text: `El Formulario se ah enviado exitosamente`,
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = './example';
    })
  }
}



