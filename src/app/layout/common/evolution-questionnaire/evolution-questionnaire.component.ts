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
  idIdentity: any;
  data: any = {};
  questions: any[] = [];
  verticalStepperForm: FormGroup;
  questionsGroups$: Observable<any[]>;
  currentGroupIndex: number = 0; // Índice del grupo actual
  currentGroup: any[] = []; // Preguntas del grupo actual
  allGroups: any[] = []; // Lista de todos los grupos de preguntas
  allQuestions: any[] = []; // Lista de todas las preguntas (aplanadas)
  answeredQuestions: { [key: number]: {evolution:string, use:string, benefit:string}} = {}; // Respuestas guardadas
  currentQuestionIndex: number = 0; // Índice de la pregunta actual
  groupSize: number = 3; // Número de preguntas por grupo
  formularioId: number;
  userId: string='';
  estimacionTrue:string = "enviada"
  estimacionFalse: string = "malaPractica"
  palabraCount = 0;
  idQuestions:number[] =[]; 
  preguntasPorPagina = 3;

  allForms: any;
  answerdEvolution: string[] = [];
  answerdUse: string[] = [];
  answerdBenefit: string[] = [];
  
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
  
  preguntas = [
      // { id: 1, enunciado: '¿Necesita un Aumento de recursos?', respuesta: '', comentario: '' },
      // { id: 2, enunciado: '¿Disminución, reducción o contención de gastos?', respuesta: '', comentario: '' },
      // { id: 3, enunciado: '¿El sistema es accesible para todos los usuarios?', respuesta: '', comentario: '' },
      // { id: 4, enunciado: '¿Las pruebas han sido correctamente implementadas?', respuesta: '', comentario: '' },
      // { id: 5, enunciado: '¿El rendimiento es óptimo?', respuesta: '', comentario: '' }
    ];
  
    //id preg untas
    ngOnInit(): void {
      this.idIdentity = Number(this.route.snapshot.paramMap.get('id'));
      this.updateGroup()
      this.getFormData(12);
      this.getUserAccessName();
      this.getIdQuestions();
      console.log('Ejecutando getFormData...');
    }
  
  getIdQuestions(){
    this.idQuestions = this.preguntas.map(question => question.id);
    console.log('Id de las preguntas', this.idQuestions);
    return this.idQuestions;
  }
  

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
  loadGroup(currentGroupIndex: number) {
    if (currentGroupIndex >= 0 && currentGroupIndex < this.allGroups.length) {
      this.currentGroup = this.allGroups[currentGroupIndex]; 
      this.currentGroupIndex = currentGroupIndex; 
    } else {
      console.error("Índice de grupo fuera de rango");
    }
  }
  chunkArray(allQuestions: any[], groupSize: number): any[] {
    if (!allQuestions || groupSize <= 0) return []; // Evita divisiones por 0 o valores inválidos
    const result = Array.from({ length: Math.ceil(allQuestions.length / groupSize) }, (_, i) =>
      allQuestions.slice(i * groupSize, i * groupSize + groupSize)
    );
    return result;
  }
  getForms(){
    this.questionnaireService.getForms().subscribe(
      (response)=>{
        console.log('Formularios de evaluador', response);
        this.allForms= response.data;
      }
    )
  }
  getQuestions() {
    this.questionnaireService.getQuestionsGroups().subscribe(
      (response)=>{
        console.log('preguntas en evolucion: ', response);
        this.preguntas = response;
      },
      (error)=>{
        Swal.fire({
          icon: 'error',
          title: 'Error al obtener las preguntas',
          text: 'Errpr al obtener las preguntas del formulario,',
          showConfirmButton: false,
          timer: 2000
        })
      }
    )
  }

  //obtener userId
  
  getUserAccessName(){
    this.userId =localStorage.getItem('Iduser');
  }
  updateGroup() {
    const start = this.currentGroupIndex * this.preguntasPorPagina;
    const end = start + this.preguntasPorPagina;
    this.currentGroup = this.preguntas.slice(start, end);
  }

  nextGroup() {
    if ((this.currentGroupIndex + 1) * this.preguntasPorPagina < this.preguntas.length) {
      this.currentGroupIndex++;
      this.updateGroup();
    }
  }

  previousGroup() {
    if (this.currentGroupIndex > 0) {
      this.currentGroupIndex--;
      this.updateGroup();
    }
  }

  todasRespondidas(): boolean {
    return this.preguntas.every(q => q.respuesta !== '');
  }

  onAnswerChange(question: any, answer: string) {
    question.respuesta = answer;
  }
  getQuestionAnswered(question: any) {
      console.log('Procesando pregunta:', question); 
      console.log('id:', question.id);
      if (question.respuesta === 'Sí') {
        this.answeredQuestions = {
          ...this.answeredQuestions, // Mantiene respuestas previas
          [question.id]: {
            evolution: question.evolution ?? 'null',
            use: question.use ?? 'null',
            benefit: question.benefit ?? 'null'
          }
        };
      }
      console.log('Preguntas respondidas:', this.answeredQuestions);
      return this.answeredQuestions;
  }
  
  saveData(){
    this.answerdEvolution = [];
    this.answerdUse = [];
    this.answerdBenefit = [];
  
    for (const pregunta of this.preguntas) {
      
      this.getQuestionAnswered(pregunta);

      const answerdSaved = this.answeredQuestions[pregunta.id];
      
      if (answerdSaved) { // Validar que exista en answeredQuestions
        const {evolution, use, benefit} = answerdSaved;

        this.answerdEvolution.push(`${evolution}-${pregunta.id}`);
        this.answerdUse.push(`${use}-${pregunta.id}`);
        this.answerdBenefit.push(`${benefit}-${pregunta.id}`);
      }
    }
    console.log("Datos guardados temporalmente:", this.answerdEvolution, this.answerdUse, this.answerdBenefit);

  }

  enviarFormulario() {
    this.saveData();

    if (this.answerdEvolution.length === 0 || this.answerdUse.length === 0 || this.answerdBenefit.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Asegúrate de guardar primero los datos antes de enviarlos.",
      });
      return;
    }

   
    const payload = {
      formEntity: 3,
      user: Number(this.userId),
      questionEntity: this.idQuestions,
      evolucion: this.answerdEvolution,
      uso: this.answerdUse,
      beneficio: this.answerdBenefit,
      comentario: [""],
      estimacion: "aprobado",
      identity: this.idIdentity,
      enabled: 1
    };
  
    console.log('Payload enviado:', payload);
  
    this.questionnaireService.saveEvaluation(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'El Formulario se ha enviado exitosamente',
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (error) => {
        console.error('Error al enviar formulario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al enviar el formulario',
        });
      }
    });
  }
  

  getFormData(id: number = 12) {
    console.log("Ejecutando getFormData con id:", id);
    this.questionnaireService.getFormById(id).subscribe({
        next: (data) => {
            console.log('Datos del formulario:', data);
            if (data && data.data.length > 0) {
                // Extraemos las preguntas del backend
                this.preguntas = data.data[0].questions.map(q => ({
                    id: q.id,
                    enunciado: q.enunciado,
                    respuesta: '',  // Inicializamos respuesta vacía
                    comentario: ''
                }));
                
                console.log('Preguntas obtenidas:', this.preguntas);
                
                // Actualizamos el grupo actual con las nuevas preguntas
                this.updateGroup();
                this.getIdQuestions();

            }
        },
        error: (error) => {
            console.error('Error al obtener el formulario:', error);
        }
    });
  }
}



