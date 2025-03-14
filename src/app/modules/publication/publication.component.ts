import { Component, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActivatedRoute, RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../../modules/optionsDropdown/characterization/characterization.component';
import { ResumenService } from '../resumen/resumen.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicactionService } from 'app/modules/publication/publication.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatTooltipModule } from '@angular/material/tooltip';


// Definición de rutas
const routes: Routes = [
  { path: 'characterization', component: CharacterizationComponent },
  { path: '', redirectTo: '/users', pathMatch: 'full' } // Ruta por defecto
];

@Component({
  selector: 'publication',
  standalone: true,
  templateUrl: './publication.component.html',
  styleUrl: './publication.component.scss',
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
    MatTooltipModule
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

  selectAnswerModal = false;
  selectedQuestion: any;
  selectedAnswer: string = '';
  tempAnswers: any[] = [];
  showAnswerModal: boolean = false;

  idQuestionsWithComment: number[] = []; // Almacenar preguntas con comentario
  addCommentCheckbox: boolean = false;// Estado del checkbox

  constructor(
    private resumenService: ResumenService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private publicationService: PublicactionService
  ) {
    this.questionForm = this.fb.group({
      enunciado: ['', Validators.required]
    });
    this.saveForm = this.fb.group({
      nombreCuestionario: ['', Validators.required] // Campo obligatorio
    });
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getQuestions();
  }

  initializeForm() {
    this.questionForm = this.fb.group({
      enunciado: ['', Validators.required],
    });
  }

  getQuestionid(id: number) {
    const token: any = localStorage.getItem('accessToken');
    this.publicationService.getQuestionId(id, token).subscribe(response => {
      console.log('Pregunta del back:', response);

      if (response && response.data) {
        this.selectedQuestion = response.data; // Guardar la pregunta seleccionada
        this.customFormQuestions.push(response.data); // Agregar la pregunta al cuestionario personalizado
        console.log('customFormQuestions después de agregar:', this.customFormQuestions); // Verificar el array
        this.addCommentCheckbox = false; // 🔹 Siempre deseleccionar el checkbox al abrir
        this.showAnswerModal = true; // Mostrar el modal de respuestas
      }
    }, error => {
      console.error("Error obteniendo la pregunta:", error);
    });
  }

  submitForm() {
    if (this.saveForm.valid) {
      const nombreCuestionario = this.saveForm.value.nombreCuestionario;
      const roleFormId = 11; // Valor fijo
      const enabled = 1; // Valor fijo

      const idQuestions = this.customFormQuestions.map(question => question.id);
      const idAnswers = idQuestions.map(questionId => {
        const answer = this.tempAnswers.find(a => a.questionId === questionId);
      

        // Convertir "Sí" a 1 y "No" a 2
        if (answer) {
          return answer.answer === "Sí" ? 1 : 2;
        } else {
          return null; // Si no hay respuesta, devuelve null
        }
      });

      // NO eliminar preguntas con comentario innecesariamente
      const filteredQuestionsWithComment = this.idQuestionsWithComment.filter(id => 
        idQuestions.includes(id) || this.idQuestionsWithComment.includes(id)
      );

      // Construir el objeto JSON
      const formData = {
        formName: nombreCuestionario,
        roleFormId: roleFormId,
        enabled: enabled,
        idQuestions: idQuestions,
        idAnswers: idAnswers,
        idQuestionsWithComment: filteredQuestionsWithComment  
      };

      console.log('Datos del formulario a guardar:', formData);

      this.publicationService.saveQuestionary(formData).subscribe(
        response => {
          console.log('Formulario guardado con éxito:', response);
          this.closeSaveModal();
          setTimeout(() => {
            this.alert();
          }, 3000);
        },
        (error) => {
          console.error('Error al guardar el formulario:', error);
        });
    } else {
      // Marcar el campo como tocado para que muestre el mensaje de error
      this.saveForm.controls['nombreCuestionario'].markAsTouched();
    }
  }

  // Guardar pregunta y agregarla al formulario personalizado
  saveQuestion() {
    if (this.questionForm.valid) {
      const newQuestionData = {
        enunciado: this.questionForm.value.enunciado,
        tipoPregunta: "Seleccion multiple",
        enabled: 1,
        peso: 5,
        forms: null,
        answers: [1, 2]
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
          const id = response.data.id;
          this.getQuestionid(id);
          this.closeModal();
        },
        (error) => {
          console.error('Error al guardar la pregunta:', error);
        });
    }
  }

  saveAnswer(selectedAnswer: string) {
    if (this.selectedQuestion) {
      // Buscar si ya existe una respuesta para esta pregunta
      const existingAnswerIndex = this.tempAnswers.findIndex(a => a.questionId === this.selectedQuestion.id);

      if (existingAnswerIndex !== -1) {
        // Si ya existe, actualizar la respuesta
        this.tempAnswers[existingAnswerIndex].answer = selectedAnswer;
      } else {
        // Si no existe, agregar la nueva respuesta
        this.tempAnswers.push({
          questionId: this.selectedQuestion.id,
          answer: selectedAnswer
        });
      }

    // Obtener ID correcto basado en customFormQuestions
    const questionIndex = this.customFormQuestions.findIndex(q => q.id === this.selectedQuestion.id);
    if (questionIndex !== -1) {
      const newId = questionIndex + 1; // Para mantener la secuencia correcta
      if (this.addCommentCheckbox) {
        if (!this.idQuestionsWithComment.includes(newId)) {
          this.idQuestionsWithComment.push(newId);
        }
      } else {
        this.idQuestionsWithComment = this.idQuestionsWithComment.filter(id => id !== newId);
      }
    }


    console.log('Respuestas temporales:', this.tempAnswers);
    console.log('Preguntas con comentario:', this.idQuestionsWithComment);
    
    this.showAnswerModal = false; // Cerrar el modal después de guardar
    }
  }

  getSelectedAnswer(questionId: number): string {
    const answer = this.tempAnswers.find(a => a.questionId === questionId);
    return answer ? answer.answer : 'No seleccionada'; // Devuelve la respuesta o un mensaje por defecto
  }

  getQuestions() {
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

  addToCustomForm(questionId: number) {
    console.log('Agregando pregunta con ID:', questionId);
    const question = this.allQuestions.find(q => q.id === questionId); // Cambia q.questions.id a q.id
    if (question) {
      console.log('Pregunta encontrada:', question);
      this.allQuestions = this.allQuestions.filter(q => q.id !== questionId); // Cambia q.questions.id a q.id
      this.getQuestionid(questionId);
    }
    console.log('customFormQuestions después de agregar:', this.customFormQuestions);
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

  openSaveModal() {
    this.showSaveModal = true;
  }

  closeSaveModal() {
    this.showSaveModal = false;
    this.saveForm.reset(); // Limpiar formulario al cerrar
  }

  closeAnswerModal() {
    this.showAnswerModal = false;
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

  alert() {
    Swal.fire({
      icon: 'success',
      title: 'Creacion de Formulario',
      text: `El Formulario se ah creado Exitosamente`,
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      window.location.href = './example';
    })
  }

  pageLoad(): void {
    window.location.reload()
  }

  getCommentStatus(index: number): string {
    const questionNumber = (this.currentPageCustomForm - 1) * this.itemsPerPage + index + 1;
    return this.idQuestionsWithComment.includes(questionNumber) ? 'Sí' : 'No';
  }
  
}
