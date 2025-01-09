import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule, Routes } from '@angular/router';
import Swal from 'sweetalert2';
import { CharacterizationComponent } from '../../modules/optionsDropdown/characterization/characterization.component';
import { DialogOverviewExampleDialog } from '../common/general-modal/general-modal.component';
import { ResumenService } from './resumen.service';

// Definición de rutas
const routes: Routes = [
    { path: 'characterization', component: CharacterizationComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' }, // Ruta por defecto
];

@Component({
    selector: 'resumen',
    standalone: true,
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
    encapsulation: ViewEncapsulation.None,
    imports: [
        MatIconModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        RouterModule,
        MatIconModule,
        MatMenuModule,
        RouterModule,
        DialogOverviewExampleDialog,
    ],
    providers: [MatDatepickerModule],
})
export class ResumenComponent implements OnInit {
    horizontalStepperForm: UntypedFormGroup;
    selectedFiles: File[] = [];
    isLoading: boolean = true;
    progress: number = 0;
    isModalOpen: boolean = false;
    buttonText: string = 'Acción';
    fechaDiligenciamiento: string = this.formatDate(new Date());
    isDisabled: boolean = true;
    typeStrategyOptions: any[] = [];
    typePracticeOptions: any[] = [];
    typologyOptions: any[] = [];
    levelGoodPracticeOptions: any[] = [];
    objectiveMainPracticeOptions: any[] = [];
    expectedImpactOptions: any[] = [];
    stagesMethodologyOptions: any[] = [];
    durationImplementationOptions: any[] = [];
    typeMaterialProducedOptions: any[] = [];
    supportReceivedOptions: any[] = [];
    recognitionsNationalInternationalOptions: any[] = [];
    controlObjectOptions: any[] = [];
    taxonomyEventOptions: any[] = [];
    typePerformanceOptions: any[] = [];

    @Input() Id: number;
    @Input() isEdit: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private resumenService: ResumenService,
        private dialog: MatDialog
    ) {}

    toggleModal(): void {
        this.isModalOpen = !this.isModalOpen;
    }

    triggerFileInput(): void {
        const fileInput =
            document.querySelector<HTMLInputElement>('#fileInput');
        fileInput?.click();
    }

    onFilesSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            this.selectedFiles = Array.from(input.files);
            console.log('Archivo seleccionado:', this.selectedFiles);
        } else {
            console.log('No se seleccionó ningún archivo.');
        }
    }

    enviarNotificacion(): void {
        const progreso = this.calculateProgress();
        const mensaje = `Notificación creada: El progreso de la hoja de vida es del ${progreso}%.`;

        console.log(mensaje);

        console.log(`Color asociado al progreso: ${this.progressColor}`);
    }

    submitForm(): void {
        if (this.horizontalStepperForm.valid) {
            // Procesar los valores del formulario
            const multiSelectFields = [
                'supportReceived',
                'stagesMethodology',
                'expectedImpact',
                'taxonomyEvent',
                'typeMaterialProduced',
            ];

            const formValues = this.horizontalStepperForm.getRawValue();

            // Transformar los campos multiseleccionables
            multiSelectFields.forEach((field) => {
                Object.keys(formValues).forEach((step) => {
                    if (
                        formValues[step] &&
                        formValues[step][field] &&
                        Array.isArray(formValues[step][field])
                    ) {
                        formValues[step][field] =
                            formValues[step][field].join(',');
                    }
                });
            });

            // Aplanar los datos
            const flattenedValues = this.flattenObject(formValues);

            // Lógica para decidir si se crea o se actualiza
            if (this.isEdit && this.Id) {
                // Verificar y actualizar el estadoFlujo antes de enviar los datos
                if (flattenedValues.estadoFlujo === 'Candidata') {
                    flattenedValues.estadoFlujo = 'validación';
                }

                delete flattenedValues.fechaDiligenciamiento;
                // Llamar al servicio de actualización
                this.resumenService
                    .updateDataAsJson(this.Id, flattenedValues)
                    .subscribe(
                        (response) => {
                            Swal.fire({
                                title: '¡Actualización Exitosa!',
                                text: 'El formulario ha sido actualizado.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                            }).then(() => {
                                window.location.href = './example';
                            });
                        },
                        (error) => {
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo actualizar el formulario. Intenta nuevamente.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                            });
                        }
                    );
            } else {
                // Verificar y actualizar el estadoFlujo antes de crear los datos
                if (flattenedValues.estadoFlujo === 'Candidata') {
                    flattenedValues.estadoFlujo = 'validación';
                }
                // Llamar al servicio de creación
                this.resumenService
                    .sendFormDataAsJson(flattenedValues)
                    .subscribe(
                        (response) => {
                            Swal.fire({
                                title: '¡Formulario Enviado!',
                                text: 'Tu formulario ha sido enviado con éxito.',
                                icon: 'success',
                                confirmButtonText: 'Aceptar',
                            }).then(() => {
                                window.location.href = './example';
                            });
                            this.enviarNotificacion();
                        },
                        (error) => {
                            Swal.fire({
                                title: 'Error',
                                text: 'No se pudo enviar el formulario. Intenta nuevamente.',
                                icon: 'error',
                                confirmButtonText: 'Aceptar',
                            });
                        }
                    );
            }
        } else {
            console.warn('Formulario no válido');
        }
    }
    // validDate(){
    //     const fechaDiligenciamiento = this.fechaDiligenciamiento;
    //     const today = new Date();

    //     if (fechaDiligenciamiento.getTime() !== today.getTime()) {
    //         console.log('Valid date');
    //     } else {
    //         console.log('Dates are the same');
    //     }
    // }

    // Validacion de fecha: fecha actual
    ngOnInit(): void {
        console.log('Id Practica ' + this.Id);

        // Obtener el rol desde localStorage
        const roles = localStorage.getItem('accessRoles');
        const cargo = roles ? JSON.parse(roles)[0] : 'Rol';

        // Configurar el texto del botón basado en el rol
        if (cargo === 'validador') {
            this.buttonText = 'Caracterización';
        } else if (cargo === 'caracterizador') {
            this.buttonText = 'Evaluación';
        } else {
            this.buttonText = 'Acción';
        }

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                fechaDiligenciamiento: [
                    this.fechaDiligenciamiento,
                    Validators.required,
                ],
                nombreEntidad: ['', Validators.required],
                nombreDependenciaArea: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                nombre: ['', [Validators.required, Validators.maxLength(50)]],
                cargo: ['', [Validators.required, Validators.maxLength(50)]],
                correo: ['', [Validators.required, Validators.email]],
                contacto: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9]{10}$')],
                ],
            }),
            step3: this._formBuilder.group({
                typeStrategyIdentification: [],
                typePractice: [],
                codigoPractica: [{ value: '', disabled: true }],
                typology: [],
                estadoFlujo: [{ value: 'Candidata', disabled: true }],
                levelGoodPractice: [],
                nombreDescriptivoBuenaPractica: ['', Validators.maxLength(100)],
                propositoPractica: ['', Validators.maxLength(300)],
                objectiveMainPractice: [''],
            }),
            step4: this._formBuilder.group({
                expectedImpact: [[]],
                metodologiaUsada: ['', [Validators.maxLength(500)]],
                durationImplementation: [''],
                stagesMethodology: [[]],
                periodoDesarrolloInicio: [''],
                periodoDesarrolloFin: [''],
            }),
            step5: this._formBuilder.group({
                typeMaterialProduced: [[]],
                supportReceived: [[]],
                recognitionsNationalInternational: [''],
                controlObject: [''],
                taxonomyEvent: [[]],
                typePerformance: [''],
                descripcionResultados: [''],
            }),
            step6: this._formBuilder.group({
                documentoActuacion: [Validators.required],
            }),
        });
        this.horizontalStepperForm.valueChanges.subscribe(() => {
            this.progress = this.calculateProgress();
            console.log('Progreso actualizado:', this.progress);
        });
        this.resumenService.fetchAllTypes().subscribe(() => {
            this.typeStrategyOptions = this.resumenService.getTypeByKey(
                'typeStrategyIdentifications'
            );
            this.typePracticeOptions =
                this.resumenService.getTypeByKey('typePractices');
            this.typologyOptions =
                this.resumenService.getTypeByKey('typologies');
            this.levelGoodPracticeOptions =
                this.resumenService.getTypeByKey('levelGoodPractice');
            this.objectiveMainPracticeOptions =
                this.resumenService.getTypeByKey('objectiveMainPractices');
            this.expectedImpactOptions =
                this.resumenService.getTypeByKey('expectedImpacts');
                console.log(
                    'Opciones para expected:',
                    this.expectedImpactOptions);
            this.stagesMethodologyOptions =
                this.resumenService.getTypeByKey('stagesMethodologys');
            this.durationImplementationOptions =
                this.resumenService.getTypeByKey('durationImplementations');
            this.typeMaterialProducedOptions = this.resumenService.getTypeByKey(
                'typeMaterialProduceds'
            );
            this.supportReceivedOptions =
                this.resumenService.getTypeByKey('supportReceiveds');
            this.recognitionsNationalInternationalOptions =
                this.resumenService.getTypeByKey(
                    'recognitionsNationalInternationals'
                );
            this.controlObjectOptions =
                this.resumenService.getTypeByKey('controlObjects');
            this.taxonomyEventOptions =
                this.resumenService.getTypeByKey('taxonomyEvents');
            this.typePerformanceOptions =
                this.resumenService.getTypeByKey('typePerformances');

            console.log(
                'Opciones para typeStrategyIdentification:',
                this.typeStrategyOptions
            ); // Log para depurar
        });

        this.progress = this.calculateProgress();
        this.resumenService.getDataAsJson(this.Id.toString()).subscribe({
            next: (response) => {
                console.log('Datos recibidos:', response);

                // Asignar los datos al formulario usando patchValue
                this.horizontalStepperForm.patchValue({
                    step1: {
                        fechaDiligenciamiento: response.fechaDiligenciamiento || '',
                        nombreEntidad: response.nombreEntidad || '',
                        nombreDependenciaArea: response.nombreDependenciaArea || '',
                    },
                    step2: {
                        nombre: response.nombre || '',
                        cargo: response.cargo || '',
                        correo: response.correo || '',
                        contacto: response.contacto || '',
                    },
                    step3: {
                        typeStrategyIdentification: response.typeStrategyIdentification?.id || '',
                        typePractice: response.typePractice?.id || '',
                        codigoPractica: response.codigoPractica || '',
                        typology: response.typology?.id || '',
                        estadoFlujo: response.estadoFlujo || 'Candidata',
                        levelGoodPractice: response.levelGoodPractice?.id || '',
                        nombreDescriptivoBuenaPractica: response.nombreDescriptivoBuenaPractica || '',
                        propositoPractica: response.propositoPractica || '',
                        objectiveMainPractice: response.objectiveMainPractice?.id || '',
                    },
                    step4: {
                        expectedImpact: 1 || '',
                        metodologiaUsada: response.metodologiaUsada || '',
                        durationImplementation: response.durationImplementation?.id || '',
                        stagesMethodology: response.stagesMethodology?.id || '',
                        periodoDesarrolloInicio: response.periodoDesarrolloInicio || '',
                        periodoDesarrolloFin: response.periodoDesarrolloFin || '',
                    },
                    step5: {
                        typeMaterialProduced: response.typeMaterialProduced?.id || '',
                        supportReceived: response.supportReceived?.id || '',
                        recognitionsNationalInternational: response.recognitionsNationalInternational?.id || '',
                        controlObject: response.controlObject?.id || '',
                        taxonomyEvent: response.taxonomyEvent?.id || '',
                        typePerformance: response.typePerformance?.id || '',
                        descripcionResultados: response.descripcionResultados || '',
                    },
                    step6: {
                        documentoActuacion: response.documentoActuacion || '',
                    },
                });
            },
            error: (err) => {
                console.error('Error al obtener los datos:', err);
            },
            complete: () => {
                console.log('Datos cargados en el formulario');
            },
        });
    }
    onPracticaChange(event: any): void {
        const selectedValue = event.value;
        const step3Form = this.horizontalStepperForm.get('step3');

        if (selectedValue === 'BP') {
            step3Form?.get('tipologia')?.enable();
            step3Form
                ?.get('codigoPractica')
                ?.setValue('BP-' + this.generateConsecutive());
        } else {
            step3Form?.get('tipologia')?.disable();
            step3Form?.get('codigoPractica')?.setValue('');
        }
    }

    private generateConsecutive(): string {
        const random = Math.floor(1000 + Math.random() * 9000);
        return random.toString();
    }
    onDateChange(event: any, stepName: string, controlName: string): void {
        const date = event.value;
        const formattedDate = this.formatDate(date);
        this.horizontalStepperForm
            .get(`${stepName}.${controlName}`)
            ?.setValue(formattedDate);
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    flattenObject(obj: any): any {
        let result: any = {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    const temp = this.flattenObject(obj[key]);
                    for (const subKey in temp) {
                        if (temp.hasOwnProperty(subKey)) {
                            if (subKey.startsWith('step')) {
                                result[
                                    subKey.substring(subKey.indexOf('.') + 1)
                                ] = temp[subKey];
                            } else {
                                result[subKey] = temp[subKey];
                            }
                        }
                    }
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    }
    submitDocumentoActuacion(): void {
        console.log('Intentando enviar los documentos...');

        if (this.selectedFiles.length > 0) {
            const formData = new FormData();

            this.selectedFiles.forEach((file) => {
                formData.append('file', file, file.name);
            });

            console.log('FormData construido:', formData);

            // Enviamos los archivos al servicio
            this.resumenService.uploadFile(formData).subscribe(
                (response) => {
                    console.log('Documentos enviados con éxito:', response);
                    // Limpiamos la selección tras el envío exitoso
                    this.selectedFiles = [];
                },
                (error) => {
                    console.error('Error al enviar los documentos:', error);
                }
            );
        } else {
            console.warn('No hay archivos seleccionados.');
        }
    }

    onDragOver(event: DragEvent): void {
        event.preventDefault();
    }

    onDrop(event: DragEvent): void {
        event.preventDefault();
        if (event.dataTransfer?.files) {
            this.selectedFiles = Array.from(event.dataTransfer.files);
        }
    }
    calculateProgress(): number {
        const formGroups = Object.keys(this.horizontalStepperForm.controls);
        let totalControls = 0;
        let filledControls = 0;

        formGroups.forEach((step) => {
            const group = this.horizontalStepperForm.get(
                step
            ) as UntypedFormGroup;
            if (group) {
                const controls = group.controls;

                Object.values(controls).forEach((control) => {
                    if (!control.disabled) {
                        totalControls++;
                        // Considerar válido si tiene un valor (aunque no sea obligatorio)
                        if (
                            control.value &&
                            control.value.toString().trim() !== ''
                        ) {
                            filledControls++;
                        }
                    }
                });
            }
        });

        // Evitar dividir por cero
        if (totalControls === 0) {
            return 0;
        }

        // Calcular progreso
        const progressValue = Math.round(
            (filledControls / totalControls) * 100
        );
        console.log(
            `Total controles: ${totalControls}, Controles llenos: ${filledControls}, Progreso: ${progressValue}%`
        );
        return progressValue;
    }
    get progressColor(): string {
        if (this.progress <= 30) {
            return 'red'; // 0% - 30%: Rojo
        } else if (this.progress <= 62) {
            return 'yellow'; // 31% - 62%: Amarillo
        } else {
            return 'green'; // 63% - 100%: Verde
        }
    }

    // ======================== Logica que muestra el modal en la vista ======================== //

    openCaracterizationModal(): void {
        const roles = localStorage.getItem('accessRoles');
        const currentRole = roles
            ? JSON.parse(roles)[0].toLowerCase()
            : 'natural'; // Convertir a minúsculas

        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '500px',
            data: { role: currentRole }, // Pasa el rol al modal
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Usuario seleccionado:', result);
            }
        });
    }
}
