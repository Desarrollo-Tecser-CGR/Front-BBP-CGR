import { Component, ViewEncapsulation } from '@angular/core';
import { CreateService } from './create.service'; 
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { CharacterizationComponent } from '../optionsDropdown/characterization/characterization.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import Swal from 'sweetalert2';


const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' }
];

@Component({
    selector     : 'create',
    standalone   : true,
    templateUrl  : './create.component.html',
    styleUrl     : './create.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        MatTableModule,
        MatMenuModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,
        CommonModule,
        FormsModule,
        RouterModule,
        HttpClientModule 
    ]
})
export class CreateComponent {
    showModal = false;
    showSubModal = false;
    formEntries: { id: number; question: string; type: string; subQuestions?: string[] }[] = [];
    subQuestions: string[] = [];
    question: string = '';
    questionType: string = '';
    formTitle: string = '';
    currentEntryId: number | null = null;

    constructor(private createService: CreateService) {} 

    closeModal(): void {
        this.showModal = false;
    }

    closeSubModal(): void {
        this.showSubModal = false;
        this.subQuestions = [];
        this.currentEntryId = null;
    }

    saveFormEntry(): void {
        if (this.question.trim() && this.questionType.trim()) {
            this.formEntries.push({
                id: this.formEntries.length + 1,
                question: this.question,
                type: this.questionType,
            });

            this.question = '';
            this.questionType = '';
            this.closeModal();
        } else {
            alert('Por favor complete todos los campos.');
        }
    }

    openSubModal(entryId: number): void {
        const entry = this.formEntries.find(entry => entry.id === entryId);
        if (entry) {
            this.currentEntryId = entryId;
            this.subQuestions = entry.subQuestions ? [...entry.subQuestions] : [];
            this.showSubModal = true;
        }
    }

    addSubQuestion(): void {
        this.subQuestions.push('');
    }

    removeSubQuestion(index: number): void {
        this.subQuestions.splice(index, 1);
    }

    saveSubEntry(): void {
        if (this.subQuestions.every(sub => sub.trim())) {
            const entry = this.formEntries.find(entry => entry.id === this.currentEntryId);
            if (entry) {
                entry.subQuestions = [...this.subQuestions];
            }
            this.closeSubModal();
        } else {
            alert('Por favor complete todos los subcriterios.');
        }
    }

    shouldShowPlusIcon(type: string): boolean {
        return type === 'opcion-unica' || type === 'opcion-multiple';
    }

    hasSubQuestions(entryId: number): boolean {
        const entry = this.formEntries.find(entry => entry.id === entryId);
        return entry?.subQuestions && entry.subQuestions.length > 0;
    }

    getSubQuestionsTooltip(entryId: number): string {
        const entry = this.formEntries.find(entry => entry.id === entryId);
        return entry?.subQuestions?.join(', ') || 'No hay subcriterios';
    }

    deleteFormEntry(id: number): void {
        this.formEntries = this.formEntries.filter(entry => entry.id !== id);
        this.formEntries.forEach((entry, index) => {
            entry.id = index + 1; 
        });
    }

    trackByFn(index: number, item: string): number {
        return index;
    }

    submitForm(): void {
        // Valid Data
        if (this.formEntries.length === 0) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, agregue al menos una pregunta.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
            return;
        }
    
        // Build question object
        const questionsObject = this.formEntries.reduce((acc, entry) => {
            acc[entry.question] = entry.subQuestions && entry.subQuestions.length > 0 
                ? { type: entry.type, // Incluir el tipo de criterio
                    subQuestions: entry.subQuestions } 
                : entry.type;
            return acc;
        }, {} as Record<string, any>);

        const serializedQuestions = JSON.stringify(questionsObject);
    
        // add to send questions
        const formData = {
            questions: serializedQuestions, 
        };
    
        // Send Data 
        this.createService.saveFormData(formData).subscribe(
            (response) => {
                console.log('Formulario guardado con éxito:', response);
                // Show Alert
                Swal.fire({
                    title: '¡Formulario Guardado!',
                    text: 'El formulario se ha guardado correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    // Clean
                    this.formEntries = []; 
                    this.question = ''; 
                    this.questionType = ''; 
                    this.subQuestions = []; 
                });
            },
            (error) => {
                console.error('Error al guardar el formulario:', error);
                Swal.fire({
                    title: 'Error',
                    text: `Hubo un problema al guardar el formulario: ${error.error?.message || 'Error desconocido'}`,
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        );
    }    
}
