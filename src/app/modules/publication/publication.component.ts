import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../../modules/optionsDropdown/characterization/characterization.component';
import { ResumenService } from '../resumen/resumen.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { QuestionnaireService } from 'app/layout/common/evaluation-questionnaire/evaluation-questionnaire.service';
import { PublicactionService } from 'app/modules/publication/publication.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';


// Definición de rutas
const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' } // Ruta por defecto
];

@Component({
    selector     : 'publication',
    standalone   : true,
    templateUrl  : './publication.component.html',
    styleUrl     : './publication.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        RouterModule,
        CommonModule,
        FormsModule,
        MatIconModule,
        ReactiveFormsModule
    ]
})
export class PublicationComponent {

  questionsGroups: Observable<any[]>;
  currentGroup: any[] = [];
  activeTab: 'allQuestions' | 'customForm' = 'allQuestions';

  totalPagesArray: number[] = [];

  allQuestions: any[] = [];
  customFormQuestions: any[] = [];


   // Variables de paginación
  currentPageAllQuestions = 1;
  currentPageCustomForm = 1;
  itemsPerPage = 6;
  totalPagesArrayAllQuestions: number[] = [];
  totalPagesArrayCustomForm: number[] = [];

  showModal = false;  // Controla la visibilidad del modal
  questionForm: FormGroup;  // Formulario para la pregunta

  showSaveModal = false; // Estado para mostrar el modal
  saveForm: FormGroup; // Formulario Reactivo

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private publicationService: PublicactionService
  ) {
    this.questionForm = this.fb.group({
      enunciado: ['', Validators.required],
      correctAnswer: ['', Validators.required]
    });
    this.saveForm = this.fb.group({
      nombreCuestionario: ['', Validators.required] // Campo obligatorio
    });
  }

  openSaveModal() {
    this.showSaveModal = true;
  }

  closeSaveModal() {
    this.showSaveModal = false;
    this.saveForm.reset(); // Limpiar formulario al cerrar
  }

  submitForm() {
    if (this.saveForm.valid) {
      const nombreCuestionario = this.saveForm.value.nombreCuestionario;
      
      // Aquí podrías enviar el cuestionario a la base de datos o hacer lo que necesites
      console.log('Guardando cuestionario:', nombreCuestionario);

      this.closeSaveModal(); // Cerrar modal después de guardar
    } else {
      // Marcar el campo como tocado para que muestre el mensaje de error
      this.saveForm.controls['nombreCuestionario'].markAsTouched();
    }
  }

  // Abrir modal
  openModal() {
    this.showModal = true;
  }

  // Cerrar modal
  closeModal() {
    this.showModal = false;
    this.questionForm.reset();
  }

  // Guardar pregunta y agregarla al formulario personalizado
  saveQuestion() {
  if (this.questionForm.valid) {
    const newQuestionData = {
      enunciado: this.questionForm.value.enunciado,
      tipoPregunta: this.questionForm.value.tipoPregunta, // Asegúrate de tener este campo en el formulario
      enabled: 1, // Se puede hacer dinámico si lo necesitas
      peso: this.questionForm.value.peso, // Debe existir en el formulario
      forms: null, // Si se usa, ajusta el valor correcto
      answers: this.questionForm.value.answers // Asegúrate de que sea un array adecuado
    };

    this.publicationService.createQuestion(
      newQuestionData.enunciado,
      newQuestionData.tipoPregunta,
      newQuestionData.enabled,
      newQuestionData.peso,
      newQuestionData.forms,
      newQuestionData.answers
    ).subscribe(
      (response) => {
        console.log('Pregunta guardada con éxito:', response);
        this.customFormQuestions.push(response); // Agregar la respuesta del backend al array
        this.updateTotalPagesArray();
        this.closeModal();
      },
      (error) => {
        console.error('Error al guardar la pregunta:', error);
      });
    }
  }

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(){
    this.publicationService.getQuestion().subscribe(groups => {
      console.log(groups);
      this.allQuestions = groups.data;
      this.updateTotalPagesArray();
    });
  }

  // Métodos de paginación
  getPaginatedQuestions(questions: any[], tab: string): any[] {
    let currentPage = tab === 'allQuestions' ? this.currentPageAllQuestions : this.currentPageCustomForm;
    const start = (currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return questions.slice(start, end);
  }
  

  getTotalPages(questions: any[]): number {
    return Math.ceil(questions.length / this.itemsPerPage);
  }

  updateTotalPagesArray(): void {
    this.totalPagesArrayAllQuestions = Array.from({ length: this.getTotalPages(this.allQuestions) }, (_, i) => i + 1);
    this.totalPagesArrayCustomForm = Array.from({ length: this.getTotalPages(this.customFormQuestions) }, (_, i) => i + 1);
  }

  goToPage(event: any, tab: string) {
    const page = Number(event.target.value);
    if (tab === 'allQuestions') {
      this.currentPageAllQuestions = page;
    } else if (tab === 'customForm') {
      this.currentPageCustomForm = page;
    }
  }

  nextPage(tab: string) {
    if (tab === 'allQuestions' && this.currentPageAllQuestions < this.getTotalPages(this.allQuestions)) {
      this.currentPageAllQuestions++;
    } else if (tab === 'customForm' && this.currentPageCustomForm < this.getTotalPages(this.customFormQuestions)) {
      this.currentPageCustomForm++;
    }
  }
  
  previousPage(tab: string) {
    if (tab === 'allQuestions' && this.currentPageAllQuestions > 1) {
      this.currentPageAllQuestions--;
    } else if (tab === 'customForm' && this.currentPageCustomForm > 1) {
      this.currentPageCustomForm--;
    }
  }

  // Cambiar de pestaña
  changeTab(tab: 'allQuestions' | 'customForm'): void {
    this.activeTab = tab;
    this.updateTotalPagesArray(); 
  }

  addToCustomForm(question: any) {
    const index = this.customFormQuestions.findIndex(q => q.id === question.id);
    if (index !== -1) {
      // Si la pregunta ya está en customFormQuestions, la quitamos y la volvemos a allQuestions
      this.customFormQuestions.splice(index, 1);
      this.allQuestions.push(question);
    } else {
      // Si no está en customFormQuestions, la agregamos y la quitamos de allQuestions
      this.customFormQuestions.push(question);
      this.allQuestions = this.allQuestions.filter(q => q.id !== question.id);
    }
    console.log(this.customFormQuestions)
  }  

  // Eliminar una pregunta del formulario personalizado
  removeFromCustomForm(index: number): void {
    this.customFormQuestions.splice(index, 1);
    this.updateTotalPagesArray(); // Actualiza totalPagesArray después de eliminar una pregunta
  }

  // Editar una pregunta en el array original (allQuestions)
  editQuestion(question: any): void {
    const newQuestionText = prompt('Editar pregunta:', question.question);
    if (newQuestionText) {
      const editedQuestion = this.deepCloneQuestion(question);
      editedQuestion.question = newQuestionText;
      this.addToCustomForm(editedQuestion);
    }
  }

  // Editar una pregunta en el formulario personalizado (customFormQuestions)
  editQuestionInCustomForm(question: any): void {
    const newQuestionText = prompt('Editar pregunta:', question.question);
    if (newQuestionText) {
      question.question = newQuestionText;
    }
  }

  // Método para clonar profundamente una pregunta
  private deepCloneQuestion(question: any): any {
    return {
      ...question,
      options: question.options.map((opt: any) => ({ ...opt })), // Clonar las opciones
    };
  }
}
