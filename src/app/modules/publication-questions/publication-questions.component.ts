import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { ResumenService } from '../resumen/resumen.service';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { QuestionnaireService } from 'app/layout/common/evaluation-questionnaire/evaluation-questionnaire.service';
import { PublicactionService } from 'app/modules/publication/publication.service';
import { Observable } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PublicactionQuestionService } from './publication-questions.service';
import { CdkDrag, CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'


// Definición de rutas
const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' } // Ruta por defecto
];

@Component({
  selector     : 'publication',
  standalone   : true,
  templateUrl  : './publication-questions.component.html',
  styleUrl     : './publication-questions.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [
      MatIconModule,
      MatTableModule,
      MatMenuModule,
      RouterModule,
      CommonModule,
      FormsModule,
      MatIconModule,
      ReactiveFormsModule,
      DragDropModule,
      MatInputModule,
      MatFormFieldModule
  ]
})
export class PublicationComponent {

  formCreateform : UntypedFormGroup;
  preguntas: any[] = [];
  preguntasOriginales: any[] = [];
  palabraCount = 0;
  evolucion:string = ''; 
  currentGroupIndex = 0;
  preguntasPorPagina = 3;
  currentGroup: any[] = [];
  modalAbierto: boolean = false; 
  nuevaPregunta: any = { enunciado: '' };
  preguntasSeleccionadas: any[] = [];
  formName:string = '';
  idQuestions: number[] = [];

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private publicationQuestion: PublicactionQuestionService,
    private router:Router,
    private cdr: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.getQuestions();
    this.preguntasSeleccionadas = []; // Inicializar la lista de preguntas seleccionadas
    console.log('preguntas :', this.preguntasSeleccionadas);
    this.preguntasOriginales = [...this.preguntas];

    const token:any = localStorage.getItem('accessToken')
    this.publicationQuestion.getQuestionAll(token).subscribe(
      response => {
        console.log(response)
        return this.preguntasOriginales = response.data;
      }
    )
    console.log('Preguntas despues del token',this.preguntas);
    this.formCreateform = this._formBuilder.group({
      formName: [this.formName],
      roleFormId :[12],
      enabled :[1],
      idQuestions: [this.idQuestions, Validators.required],
      idAnswers:[]

    })
  }

   // Método para abrir el modal
  abrirModal() {
    this.modalAbierto = true;
  }

  // Método para cerrar el modal
  cerrarModal() {
    this.modalAbierto = false;
    this.nuevaPregunta.enunciado = ''; // Limpiar el formulario al cerrar
  }

  getQuestions() {
    this.updateGroup();
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

  moverPregunta(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  
    this.cdr.detectChanges(); // Forzar actualización en la vista

    this.idQuestions = this.preguntasSeleccionadas.map((q)=> q.id);
    this.formCreateform.get('idQuestions').setValue(this.idQuestions);
    console.log('id questions:', this.idQuestions);
  }      

  guardarPregunta() {
    if (this.nuevaPregunta.enunciado) {
      this.preguntasSeleccionadas.push({ ...this.nuevaPregunta }); // Agregar la nueva pregunta al array
      this.cerrarModal(); // Cerrar el modal después de guardar
    }
  }

  limpiarLista(){
    this.preguntasOriginales = [...this.preguntasOriginales];

    // Limpiar el array de preguntas seleccionadas
    this.preguntasSeleccionadas = [];

    console.log("Filtro limpiado. Preguntas disponibles:", this.preguntas);
    console.log("Preguntas seleccionadas:", this.preguntasSeleccionadas);
  }

  generateFormPayload():any{
    const formValue = this.formCreateform.value;
    const payload = {
      formName : formValue.formName,
      roleFormId : Number(formValue.roleFormId),
      enabled : Number(formValue.enabled),
      idQuestions: formValue.idQuestions,
      idAnswers: formValue.idAnswers
    };
    console.log('Payload:',payload);
    return payload;
  }
  enviarFormulario() {
    return this.publicationQuestion.createForm(this.generateFormPayload()).subscribe(
      (response)=>{
        Swal.fire({
          icon: 'success',
          title: 'Registro Exitoso',
          text: 'El Formulario se ha enviado exitosamente',
          showConfirmButton: false,
          timer: 2000
        })
      },
      (error) =>{
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Error al crear formulario, ${error.data}`,
          showConfirmButton: false,
          timer: 2000
        })
      },
    )
    
  }

  onAnswerChange(question: any, answer: string) {
    question.respuesta = answer;
  }
}