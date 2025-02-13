import { Component, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, Router, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { ResumenService } from '../resumen/resumen.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from 'app/layout/common/evaluation-questionnaire/evaluation-questionnaire.service';
import { PublicactionService } from 'app/modules/publication/publication.service';
import { Observable } from 'rxjs';
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
      DragDropModule
  ]
})
export class PublicationComponent {

  preguntas = [
    { id: 1, enunciado: '¿Necesita un Aumento de recursos?', respuesta: '', comentario: '' },
    { id: 2, enunciado: '¿?', respuesta: '', comentario: '' },
    { id: 3, enunciado: '¿El sistema es accesible para todos los usuarios?', respuesta: '', comentario: '' },
    { id: 4, enunciado: '¿Las pruebas han sido correctamente implementadas?', respuesta: '', comentario: '' },
    { id: 5, enunciado: '¿El rendimiento es óptimo?', respuesta: '', comentario: '' }
  ];

  palabraCount = 0;
  evolucion:string = ''; 
  currentGroupIndex = 0;
  preguntasPorPagina = 3;
  currentGroup: any[] = [];
  preguntasSeleccionadas: any[] = [];


  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private publicationQuestion: PublicactionQuestionService,
    private router:Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getQuestions();
    this.preguntasSeleccionadas = []; // Inicializar la lista de preguntas seleccionadas
    console.log('preguntas :', this.preguntasSeleccionadas)

    const token:any = localStorage.getItem('accessToken')
    console.log(token)
    const preguntas = this.publicationQuestion.getQuestionAll(token).subscribe(
      response => {
        console.log(response)
      }
    )
    console.log(preguntas)
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
  }      

  agregarNuevaPregunta() {
    const nuevaPregunta = { id: Date.now(), enunciado: 'Nueva Pregunta...', respuesta: '', comentario: '' };
    this.preguntas.push(nuevaPregunta);
    
    this.cdr.detectChanges(); // Forzar detección de cambios en Angular
  }  

  enviarFormulario() {
    if (!this.todasRespondidas()) return;

    Swal.fire({
      icon: 'success',
      title: 'Registro Exitoso',
      text: 'El Formulario se ha enviado exitosamente',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = './example';
    });
  }

  onAnswerChange(question: any, answer: string) {
    question.respuesta = answer;
  }
}