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
import { QuestionnaireService } from './evaluation-questionnaire.service';
import { CommonModule, NgForOf } from '@angular/common'; 
import {GenaralModalService} from '../../../modules/common/general-modal/general-modal.service';

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
    private router:Router,
    private genaralModalService: GenaralModalService,
  ) {
    this.verticalStepperForm = this.fb.group({
      questionGroups: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getQuestions();
    this.getRolesYUsuarios();
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



  dismissPractice(): void {
    if (!this.id) {
        Swal.fire({
            title: 'Error',
            text: 'No se puede cambiar el estado de la práctica porque no se encontró un ID válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const comiteTecnicoUser = this.comiteTecnicoUser; // Obtienes el nombre del comité técnico

    if (!comiteTecnicoUser) {
        Swal.fire({
            title: 'Error',
            text: 'No se encontró un usuario del comité técnico. No se puede realizar la actualización.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return; // Finaliza si no hay comiteTecnicoUser
    }

    // Convertir el id a número
    const idAsNumber = Number(this.id);

    const patchData = {
        actualizaciones: {
            estadoFlujo: 'descartada', // Actualizar el estado de flujo
        },
        sAMAccountName: comiteTecnicoUser, // Aquí se usa el nombre del comité técnico
        estadoFlujo: 'descartada', // Estado de flujo actualizado
        comentarioUsuario: 'Comentario estándar', // Comentario fijo
    };

    // Llamar al servicio de actualización con el nuevo formato
    this.resumenService.updateDataAsJson(idAsNumber, patchData).subscribe(
        (response) => {
            Swal.fire({
                title: '¡Práctica Desestimada!',
                text: 'El estado de la práctica ha sido actualizado correctamente a "desestimada".',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                window.location.href = './example'; // Redirigir a la página deseada
            });
        },
        (error) => {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el estado de la práctica. Intenta nuevamente.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    );
}

// ======================== Método para ver los datos del endpoint ======================== //
  comiteTecnicoUser: string | null = null; // Variable para almacenar el usuario del comité técnico

  getRolesYUsuarios() {
      this.genaralModalService.getDataAsJson({ rol: 'Administrador' }).subscribe(
          (response) => {
              console.log('Usuarios y roles obtenidos:', response);

              // Verificar si response tiene una propiedad `data` que es un array
              if (response && Array.isArray(response.data)) {
                  const comiteTecnico = response.data.find(user => user.cargo === "comiteTecnico");

                  if (comiteTecnico) {
                      this.comiteTecnicoUser = comiteTecnico.userName; // Guardamos el userName de comité técnico
                      console.log('Usuario del comité técnico encontrado:', this.comiteTecnicoUser);
                  } else {
                      console.warn("No se encontró un usuario con cargo 'comiteTecnico'.");
                  }
              } else {
                  console.error("La respuesta no es un array válido:", response);
              }
          },
          (error) => {
              console.error('Error al obtener roles y usuarios:', error);
          }
      );
  }

}
