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
import { DialogOverviewExampleDialog } from '../../../modules/common/general-modal/general-modal.component';
import { forkJoin } from 'rxjs';

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
        CommonModule,
        DialogOverviewExampleDialog,
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

  allForms: any[] = [];

  selectedUserFromModal: any = null;
  selectedUsersFromModal: any[] = [];
  additionalInfoFromModal: string = '';
  showButton: boolean;

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private questionnaireService: QuestionnaireService,
    private router:Router,
    private genaralModalService: GenaralModalService,
    private dialog: MatDialog
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
        this.dismissPractice();
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

  dismissPractice() {
    if (!this.id) {
        console.error("No se encontró un ID válido para identity.");
        return;
    }

    const fechaActual = this.formatDate(new Date());
    const comentario = this.additionalInfoFromModal || ""; // Obtener comentario desde el modal
{}
    // Crear lista de peticiones a enviar
    const traceabilityRequests = [];

    // ✅ Enviar trazabilidad a TODOS los comités técnicos (ahora en un array)
    if (this.comiteTecnicoUserIds.length > 0) {
        this.comiteTecnicoUserIds.forEach(id => {
            traceabilityRequests.push(this.createTraceabilityRequest(String(id), fechaActual, comentario));
        });
    } else {
        console.warn("No se encontraron usuarios con cargo 'comiteTecnico' para enviar trazabilidad.");
    }

    // ✅ Agregar cada evaluador seleccionado a la lista de envíos
    this.selectedUsersFromModal.forEach(evaluador => {
        traceabilityRequests.push(this.createTraceabilityRequest(evaluador.idUser, fechaActual, comentario));
    });

    // ✅ Ejecutar todas las peticiones en paralelo
    forkJoin(traceabilityRequests).subscribe({
        next: (responses) => {
            console.log('Trazabilidad enviada con éxito para todos:', responses);
        },
        error: (error) => {
            console.error('Error al enviar trazabilidad:', error);
        }
    });
}


// Método para crear la petición de trazabilidad con comentario
private createTraceabilityRequest(userId: string, fecha: string, comentario: string) {
    const requestBody = {
        user: userId, // ID del usuario (puede ser comité técnico o evaluador)
        identity: this.id, // Tomamos el ID dinámicamente
        stateFlow: "evaluacion",
        fechaDiligenciamiento: fecha, // Fecha actual en formato YYYY-MM-DD
        comentarioUsuario: comentario // Comentario obtenido del modal
    };

    return this.questionnaireService.sendTraceability(requestBody);
}

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

// ======================== Método para ver los datos del endpoint ======================== //
comiteTecnicoUserIds: number[] = []; // Cambiar a un array para múltiples IDs

getRolesYUsuarios() {
    this.genaralModalService.getDataAsJson({ rol: 'Administrador' }).subscribe(
        (response) => {
            console.log('Usuarios y roles obtenidos:', response);

            if (response && Array.isArray(response.data)) {
                // Filtrar TODOS los usuarios con cargo "comiteTecnico"
                const comiteTecnicoUsers = response.data.filter(user => user.cargo === "comiteTecnico");

                if (comiteTecnicoUsers.length > 0) {
                    this.comiteTecnicoUserIds = comiteTecnicoUsers.map(user => user.idUser);
                    console.log('IDs de los usuarios del comité técnico encontrados:', this.comiteTecnicoUserIds);
                } else {
                    console.warn("No se encontraron usuarios con cargo 'comiteTecnico'.");
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


  // ======================== Logica que muestra el modal en la vista ======================== //
  openCaracterizationModal(): void {
    const roles = localStorage.getItem('accessRoles');
    const currentRole = roles ? JSON.parse(roles)[0].toLowerCase() : 'registro';

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '500px',
      data: {
        role: currentRole,
        selectedUser: this.selectedUserFromModal,
        selectedUsers: this.selectedUsersFromModal,
        additionalInfo: this.additionalInfoFromModal
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedUserFromModal = result.selectedUser || null;
        this.selectedUsersFromModal = result.selectedUsers || [];
        this.additionalInfoFromModal = result.additionalInfo || '';

        if (this.selectedUsersFromModal.length > 0) {
          localStorage.setItem('selectedUser', JSON.stringify(this.selectedUsersFromModal));
        } else {
          localStorage.removeItem('selectedUser');
        }

        console.log('Usuarios seleccionados:', this.selectedUsersFromModal);
        console.log('Información adicional:', this.additionalInfoFromModal);
      }
    });
  }
}
