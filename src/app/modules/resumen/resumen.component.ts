import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import {FormGroup, FormsModule,ReactiveFormsModule,UntypedFormBuilder,UntypedFormGroup,Validators
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { CharacterizationComponent } from '../../modules/optionsDropdown/characterization/characterization.component';
import { DialogOverviewExampleDialog } from '../common/general-modal/general-modal.component';
import { ResumenService } from './resumen.service';
import { GenericTableComponent } from '../common/generic-table/generic-table.component';
import { DataServices } from '../resumen-edit/resumen-edit.service';
import { Router } from '@angular/router';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { forkJoin } from 'rxjs';

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
        GenericTableComponent,
        MatAutocompleteModule,
    ],
    providers: [MatDatepickerModule],
})
export class ResumenComponent implements OnInit {
    roles: string[] = [];
    rol: string = '';

    fechaDiligenciamiento: string = this.formatDate(new Date());
    horizontalStepperForm: UntypedFormGroup;
    selectedFiles: File[] = [];
    isLoading: boolean = true;
    progress: number = 0;
    isModalOpen: boolean = false;
    buttonText: string = 'Acción';
    // cargo: string;
    cargo: string = '';
    isCaracterizationComplete: boolean = false;
    selectedUserFromModal: any = null;
    isDisabled: boolean = true;
    identityId: null=null;
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
    additionalInfoFromModal: string = '';
    entidades: any[] = [];
    filteredEntities$: Observable<any[]>;
    selectedUsersFromModal: any[] = [];

    @Input() Id: number;
    @Input() isEdit: boolean = false;
    @Input() isReadOnly: boolean = false;

    data: any[] = [];
    columns: { key: string; label: string }[] = [];
    buttons = [
        {
            icon: 'heroicons_outline:arrow-down-tray',
            color:'accent',
            action: (row: any) => this.downloadFile(row),
        },
        {
            icon: 'heroicons_outline:magnifying-glass-circle',
            color:'primary',
            action: (row: any) => this.visualizeFile(row),
        }
    ]
    showButton: boolean;
    fullName: string = '';

    constructor(private _formBuilder: UntypedFormBuilder,
        private resumenService: ResumenService, private dialog: MatDialog,
        private dataService: DataServices, private router: Router,
        private notificationService: NotificationsService
    ) { }

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
        } else {
        }
    }

    downloadFile(row: any):void{
        this.dataService.downloadFile(row.id)
        //Método para descargar un archivo
    }

    visualizeFile(row: any):void{
        this.dataService.viewFile(row.id);
        //Método para visualizar en el navegador un archivo
    }


    sendNotification(resumeId:number, type:number): void {
        const fullName = localStorage.getItem('accessName') || 'Usuario';
        console.log('Username',fullName);
        const progreso = this.calculateProgress();
        const mensaje = `Notificación creada: El progreso de la hoja de vida es del ${progreso}%.`;

        // this.notificationService.sendNotification(resumeId, fullName, type);
        console.log(mensaje);

    }


    submitForm(): void {
        this.fullName = localStorage.getItem('accessName') || 'Usuario';

        const isFormValid = this.checkFormValidity(this.horizontalStepperForm);

        if (isFormValid) {
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

            // Comentario que se guarde en trasability
            flattenedValues.comentarioUsuario = this.additionalInfoFromModal || '';

            // Transformar valores vacíos a null
            Object.keys(flattenedValues).forEach((key) => {
                if (flattenedValues[key] === '' || flattenedValues[key] === undefined) {
                    flattenedValues[key] = null;
                }
            });

            // Verificar el rol
            const roles = localStorage.getItem('accessRoles');
            const currentRole = roles ? JSON.parse(roles)[0].toLowerCase(): 'registro'; // Obtener el rol actual

            // Lógica para decidir si se crea o se actualiza

            // if (this.isEdit && this.Id) {

            if (this.isEdit || this.isReadOnly && this.Id) {
                // Verificar si el flujo está en "validación" y el rol es "validador"
                if (flattenedValues.estadoFlujo === 'validacion' && currentRole === 'validador') {
                    const nuevoEstadoFlujo = 'caracterizada'; // Cambiar estado de flujo
                    flattenedValues.estadoFlujo = nuevoEstadoFlujo;

                    // Funcionalidad para enviar datos adicionales (accesName)
                    this.handleUpdateRequest(this.Id, nuevoEstadoFlujo, 'El formulario ha sido actualizado.');
                    // this.notificationService.sendNotification(this.Id, this.fullName, 2)
                    return; // Salir después de manejar el flujo
                }

            // Lógica para cambiar el estado de flujo si el rol es 'caracterizador'
            if (currentRole === 'caracterizador') {
                const storedUser = localStorage.getItem('selectedUser');
                const selectedUsers = storedUser ? JSON.parse(storedUser) : null;
            
                if (!selectedUsers || !Array.isArray(selectedUsers) || selectedUsers.length === 0) {
                    console.warn('No se encontraron usuarios seleccionados.');
                    return;
                }
            
                const evaluadores = selectedUsers.filter(user => user.cargo?.trim().toLowerCase() === 'evaluador');
                const jefesUnidad = selectedUsers.filter(user => user.cargo?.trim().toLowerCase() === 'jefeunidad');
            
                console.log('Evaluadores seleccionados:', evaluadores);
                console.log('Jefe de Unidad seleccionado:', jefesUnidad);
            
                const patchRequests = [];
            
                if (evaluadores.length > 0) {
                    patchRequests.push(this.handleEvaluadoresUpdate(evaluadores, flattenedValues));
                }
            
                if (jefesUnidad.length > 0) {
                    patchRequests.push(this.handleJefeUnidadUpdate(jefesUnidad[0], flattenedValues));
                }
            
                if (patchRequests.length > 0) {
                    return; // IMPORTANTE: Salir para evitar la llamada extra a updateDataAsJson
                }
            }

                //Lógica para jefeUnidad cambiar el estado de flujo si el rol es 'caracterizador_JU'
                if (currentRole === 'jefeunidad' && flattenedValues.estadoFlujo === 'caracterizada_JU') {
                    console.log('Cambiando estado de caracterizada_JU a caracterizada para Jefe de Unidad');
                
                    // Se actualiza el estado de flujo
                    flattenedValues.estadoFlujo = 'caracterizada';
                
                    // Se obtiene el formulario completo
                    const formValues = this.horizontalStepperForm.getRawValue();
                
                    // Se construyen los datos que se enviarán
                    const patchData = {
                        actualizaciones: {
                            entityCgr: formValues.step1.entityCgr || null,
                            nombreDependenciaArea: formValues.step1.nombreDependenciaArea || null,
                            nombre: formValues.step2.nombre || '',
                            cargo: formValues.step2.cargo || '',
                            correo: formValues.step2.correo || '',
                            contacto: formValues.step2.contacto || '',
                            typeStrategyIdentification: formValues.step3.typeStrategyIdentification || null,
                            typePractice: formValues.step3.typePractice || null,
                            typology: formValues.step3.typology || null,
                            estadoFlujo: 'caracterizada',  
                            levelGoodPractice: formValues.step3.levelGoodPractice || null,
                            nombreDescriptivoBuenaPractica: formValues.step3.nombreDescriptivoBuenaPractica || '',
                            propositoPractica: formValues.step3.propositoPractica || '',
                            objectiveMainPractice: formValues.step3.objectiveMainPractice || null,
                            expectedImpact: formValues.step4.expectedImpact || [],
                            metodologiaUsada: formValues.step4.metodologiaUsada || '',
                            durationImplementation: formValues.step4.durationImplementation || null,
                            stagesMethodology: formValues.step4.stagesMethodology || [],
                            periodoDesarrolloInicio: formValues.step4.periodoDesarrolloInicio || '',
                            periodoDesarrolloFin: formValues.step4.periodoDesarrolloFin || '',
                            typeMaterialProduced: formValues.step5.typeMaterialProduced || [],
                            supportReceived: formValues.step5.supportReceived || [],
                            recognitionsNationalInternational: formValues.step5.recognitionsNationalInternational || null,
                            controlObject: formValues.step5.controlObject || null,
                            taxonomyEvent: formValues.step5.taxonomyEvent || [],
                            typePerformance: formValues.step5.typePerformance || null,
                            documentoActuacion: formValues.step6.documentoActuacion || '',
                            descripcionResultados: formValues.step5.descripcionResultados || ''
                        },
                        sAMAccountName: '', // Se asignará después con el userName del endpoint
                        estadoFlujo: 'caracterizada',  
                        comentarioUsuario: '', 
                    };
                
                    // Llamada al servicio para obtener los datos de trazabilidad
                    this.resumenService.getTraceabilityData(this.Id, 4).subscribe(
                        data => {
                            console.log('Datos de trazabilidad recibidos:', data);
                
                            if (!data.data || !data.data.userName) {
                                console.error('Error: userName no disponible en la trazabilidad.');
                                return; // Evitar el envío con datos incorrectos
                            }
                
                            // Asignamos el userName del endpoint al campo sAMAccountName
                            patchData.sAMAccountName = data.data.userName; 
                
                            console.log("Enviando datos a updateDataAsJson:", JSON.stringify(patchData, null, 2));
                
                            // Ahora que tenemos el userName, podemos continuar con la actualización
                            this.resumenService.updateDataAsJson(this.Id, patchData).subscribe(
                                () => {
                                    Swal.fire({
                                        title: '¡Actualización Exitosa!',
                                        text: 'El formulario ha sido actualizado correctamente.',
                                        icon: 'success',
                                        confirmButtonText: 'Aceptar',
                                    }).then(() => window.location.href = './example');
                                },
                                (error) => {
                                    console.error('Error en updateDataAsJson:', error);
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'No se pudo actualizar el formulario.',
                                        icon: 'error',
                                        confirmButtonText: 'Aceptar',
                                    });
                                }
                            );
                
                            // Se envía la notificación
                            this.notificationService.sendNotification(this.Id, patchData.sAMAccountName, 6);
                
                            console.log('Estado de flujo actualizado para Jefe de Unidad:', flattenedValues.estadoFlujo);
                        },
                        error => {
                            console.error('Error en la solicitud de trazabilidad:', error);
                        }
                    );
                
                    return; // Salir para evitar llamada extra a updateDataAsJson
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
                if (flattenedValues.estadoFlujo === 'candidata') {
                    flattenedValues.estadoFlujo = 'candidata';
                }
                // Verificar si el rol es caracterizador y cambiar el estado de flujo a caracterizada_JU

                 // Obtener el nombre del usuario desde el localStorage
                 const sAMAccountName = localStorage.getItem('accessName') || 'defaultUser';

                 // Llamar al servicio de creación
                 this.resumenService.sendFormDataAsJson(flattenedValues, sAMAccountName).subscribe(
                     (response) => {
                         Swal.fire({
                             title: '¡Formulario Enviado!',
                             text: 'Tu formulario ha sido enviado con éxito.',
                             icon: 'success',
                             confirmButtonText: 'Aceptar',
                         }).then(() => {
                             this.isDisabled = false;
                             this.sendNotification(response.data.id, 1);
                         });
                         this.identityId = response.data.id;
                         console.log('Id de la hv en creacion:', response.data.id);
                     },
                     (error) => {
                         Swal.fire({
                             title: 'Error',
                             text: 'No se pudo enviar el formulario. Intenta nuevamente.',
                             icon: 'error',
                             confirmButtonText: 'Aceptar',
                         });
                         console.log('Datos enviados al servidor:', flattenedValues);

                        }
                    );
            }
        } else {
        }
    }

    ngOnInit(): void {
        this.roles = JSON.parse(localStorage.getItem('accessRoles'));
        this.rol = this.roles[0]
        this.dataTrazability();


        this.dataService.getFileByIdResumen(this.Id).subscribe(
            (response)=>{
                this.data = response;
            },
            (e) =>{
            }
        )

        // Logica de agregar campos seleccionables
        this.entityOptions = [
            { id: 1, name: 'Contraloría General de la República' },
            { id: 2, name: 'Registraduría Nacional del Estado Civil' },
            { id: 3, name: 'Ministerio de Hacienda' },
        ];

        //this.data = this.dataService.getDataFiles();
        this.columns = this.dataService.getColumns();
        // Obtener el rol desde localStorage
        const roles = localStorage.getItem('accessRoles');
        this.cargo = roles ? JSON.parse(roles)[0] : 'Rol';

        // Configurar el texto del botón basado en el rol
        if (this.cargo === 'validador') {
            this.buttonText = 'Caracterización';
        } else if (this.cargo === 'caracterizador') {
            this.buttonText = 'Evaluación';
        } else {
            this.buttonText = 'Acción';
        }

         // Lógica adicional para manejar la visibilidad del botón (nuevo)
        this.showButton = this.cargo !== 'jefeUnidad';
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                fechaDiligenciamiento: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }],
                entityCgr: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, Validators.required],
                nombreDependenciaArea: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, Validators.required],
            }),  
            step2: this._formBuilder.group({
                nombre: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, [Validators.required, Validators.maxLength(50)]],
                cargo: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, [Validators.required, Validators.maxLength(50)]],
                correo: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, [Validators.required, Validators.email]],
                contacto: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }, [Validators.required, Validators.pattern('^[0-9]{10}$')],],
            }),
            step3: this._formBuilder.group({
                typeStrategyIdentification: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }],
                typePractice: [{ value: '', disabled: this.cargo === 'validador' || this.cargo === 'evaluador' }],
                codigoPractica: [{ value: '', disabled: true }],
                typology: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                estadoFlujo: [{ value: 'candidata', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                levelGoodPractice: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                nombreDescriptivoBuenaPractica: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }, Validators.maxLength(100)],
                propositoPractica: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }, Validators.maxLength(300)],
                objectiveMainPractice: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }]
            }),
            step4: this._formBuilder.group({
                expectedImpact: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                metodologiaUsada: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }, [Validators.maxLength(500)]],
                durationImplementation: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                stagesMethodology: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                periodoDesarrolloInicio: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                periodoDesarrolloFin: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
            }),
            step5: this._formBuilder.group({
                typeMaterialProduced: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                supportReceived: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                recognitionsNationalInternational: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                controlObject: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                taxonomyEvent: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                typePerformance: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
                descripcionResultados: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador' }],
            }),
            step6: this._formBuilder.group({
                documentoActuacion: [{ value: '', disabled: true || this.cargo === 'validador' || this.cargo === 'evaluador'  },Validators.required],
            }),
        });
        this.horizontalStepperForm.valueChanges.subscribe(() => {
            this.progress = this.calculateProgress();
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
            this.horizontalStepperForm.get('step4.periodoDesarrolloInicio')?.valueChanges.subscribe(() => {
                this.validateFechas();});
            this.horizontalStepperForm.get('step4.periodoDesarrolloFin')?.valueChanges.subscribe(() => {
                this.validateFechas();});
        });

        this.progress = this.calculateProgress();
        this.resumenService.getDataAsJson(this.Id.toString()).subscribe({
            next: (response) => {

                // Transformar el expectedImpact si viene como array de objetos
                const expectedImpactIds = response.expectedImpact
                    ? response.expectedImpact.map((item: any) => item.id) // Extraer solo los IDs
                    : [];

                    const stagesMethodologyIds = response.stagesMethodology
                    ? response.expectedImpact.map((item: any) => item.id) // Extraer solo los IDs
                    : [];

                    const typeMaterialProducedIds = response.typeMaterialProduced
                    ? response.expectedImpact.map((item: any) => item.id) // Extraer solo los IDs
                    : [];

                    const supportReceivedIds = response.supportReceived
                    ? response.expectedImpact.map((item: any) => item.id) // Extraer solo los IDs
                    : [];

                    const taxonomyEventIds = response.taxonomyEvent
                    ? response.expectedImpact.map((item: any) => item.id) // Extraer solo los IDs
                    : [];


                // Asignar los datos al formulario usando patchValue
                this.horizontalStepperForm.patchValue({
                    step1: {
                        fechaDiligenciamiento: response.fechaDiligenciamiento || '',
                        entityCgr: response.entityCgr.id || '',
                        nombreDependenciaArea: response.nombreDependenciaArea || '',
                    },
                    step2: {
                        nombre: response.nombre || '',
                        cargo: response.cargo || '',
                        correo: response.correo || '',
                        contacto: response.contacto || '',
                    },
                    step3: {
                        typeStrategyIdentification:
                            response.typeStrategyIdentification?.id || '',
                        typePractice: response.typePractice?.id || '',
                        codigoPractica: response.codigoPractica || '',
                        typology: response.typology?.id || '',
                        estadoFlujo: response.estadoFlujo || 'Candidata',
                        levelGoodPractice: response.levelGoodPractice?.id || '',
                        nombreDescriptivoBuenaPractica:
                            response.nombreDescriptivoBuenaPractica || '',
                        propositoPractica: response.propositoPractica || '',
                        objectiveMainPractice:
                            response.objectiveMainPractice?.id || '',
                    },
                    step4: {
                        expectedImpact: expectedImpactIds,
                        metodologiaUsada: response.metodologiaUsada || '',
                        durationImplementation: response.durationImplementation?.id || '',
                        stagesMethodology: stagesMethodologyIds,
                        periodoDesarrolloInicio: response.periodoDesarrolloInicio || '',
                        periodoDesarrolloFin: response.periodoDesarrolloFin || '',
                    },
                    step5: {
                        typeMaterialProduced: typeMaterialProducedIds,
                        supportReceived: supportReceivedIds,
                        recognitionsNationalInternational: response.recognitionsNationalInternational?.id || '',
                        controlObject: response.controlObject?.id || '',
                        taxonomyEvent: taxonomyEventIds,
                        typePerformance: response.typePerformance?.id || '',
                        descripcionResultados:
                            response.descripcionResultados || '',
                    },
                    step6: {
                        documentoActuacion: response.documentoActuacion || '',
                    },
                });
                if (this.cargo === 'caracterizador'|| this.cargo === 'jefeUnidad') {
                    const typePracticeValue = response.typePractice?.id || '';
                    this.onPracticaChange({ value: typePracticeValue });
                }
            },
            error: (err) => {
            },
            complete: () => {
            },
        });
    }
    private setupAutocomplete(): void {
        const entityCgrControl = this.horizontalStepperForm.get('step1.entityCgr');
        if (entityCgrControl) {
            this.filteredEntities$ = entityCgrControl.valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged(),
                switchMap((query: string) =>
                    this.resumenService.fetchEntities(query).pipe(
                        map((response: any) => response.data || [])
                    )
                )
            );
        }
    }
    onEntitySelected(entity: any): void {
        const entityCgrControl = this.horizontalStepperForm.get('step1.entityCgr');
        if (entityCgrControl) {
            entityCgrControl.setValue(entity.name);
        }
    }

    onPracticaChange(event: any): void {
        const selectedValue = event.value;
        const step3Form = this.horizontalStepperForm.get('step3');
        const step4Form = this.horizontalStepperForm.get('step4');
        const step5Form = this.horizontalStepperForm.get('step5');
        const propositoPracticaControl = step3Form?.get('propositoPractica');

        if (selectedValue.toString() === '4') {
            step3Form?.get('typology')?.enable();
            step3Form?.get('levelGoodPractice')?.enable();
            step3Form?.get('nombreDescriptivoBuenaPractica')?.enable();
            propositoPracticaControl?.enable();
            step3Form?.get('objectiveMainPractice')?.enable();
            step4Form?.get('expectedImpact')?.enable();
            step4Form?.get('metodologiaUsada')?.enable();
            step4Form?.get('durationImplementation')?.enable();
            step4Form?.get('stagesMethodology')?.enable();
            step4Form?.get('durationImplementation')?.enable();
            step4Form?.get('stagesMethodology')?.enable();
            step4Form?.get('periodoDesarrolloInicio')?.enable();
            step4Form?.get('periodoDesarrolloFin')?.enable();
            step5Form?.get('typeMaterialProduced')?.enable();
            step5Form?.get('supportReceived')?.enable();
            step5Form?.get('recognitionsNationalInternational')?.enable();
            step5Form?.get('controlObject')?.enable();
            step5Form?.get('taxonomyEvent')?.enable();
            step5Form?.get('typePerformance')?.enable();
            step5Form?.get('typeMaterialProduced')?.enable();
            step5Form?.get('supportReceived')?.enable();
            step5Form?.get('recognitionsNationalInternational')?.enable();
            step5Form?.get('controlObject')?.enable();
            step5Form?.get('taxonomyEvent')?.enable();
            step5Form?.get('typePerformance')?.enable();
            step5Form?.get('descripcionResultados')?.enable();
            step3Form?.get('codigoPractica')?.setValue('BP-' + this.generateConsecutive());

            propositoPracticaControl?.setValidators([
                Validators.required,
                Validators.maxLength(300),
            ]);
        } else {
            step3Form?.get('typology')?.disable();
            step3Form?.get('levelGoodPractice')?.disable();
            step3Form?.get('typology')?.disable();
            step3Form?.get('levelGoodPractice')?.disable();
            step3Form?.get('nombreDescriptivoBuenaPractica')?.disable();
            propositoPracticaControl?.disable();
            step3Form?.get('objectiveMainPractice')?.disable();
            step4Form?.get('expectedImpact')?.disable();
            step4Form?.get('metodologiaUsada')?.disable();
            step4Form?.get('durationImplementation')?.disable();
            step4Form?.get('stagesMethodology')?.disable();
            step4Form?.get('durationImplementation')?.disable();
            step4Form?.get('stagesMethodology')?.disable();
            step4Form?.get('periodoDesarrolloInicio')?.disable();
            step4Form?.get('periodoDesarrolloFin')?.disable();
            step5Form?.get('typeMaterialProduced')?.disable();
            step5Form?.get('supportReceived')?.disable();
            step5Form
                ?.get('recognitionsNationalInternational')
                ?.disable();
            step5Form?.get('controlObject')?.disable();
            step5Form?.get('taxonomyEvent')?.disable();
            step5Form?.get('typePerformance')?.disable();
            step5Form?.get('typeMaterialProduced')?.disable();
            step5Form?.get('supportReceived')?.disable();
            step5Form?.get('recognitionsNationalInternational')?.disable();
            step5Form?.get('controlObject')?.disable();
            step5Form?.get('taxonomyEvent')?.disable();
            step5Form?.get('typePerformance')?.disable();
            step5Form?.get('descripcionResultados')?.disable();
            step3Form?.get('objetivoPrincipalPractica')?.setValue('');

            propositoPracticaControl?.clearValidators();
        }
        propositoPracticaControl?.updateValueAndValidity();
    }

    private generateConsecutive(): string {
        const random = Math.floor(1000 + Math.random() * 9000);
        return random.toString();
    }
    onDateChange(event: any, stepName: string, controlName: string): void {
        const date = event.value;
        const formattedDate = this.formatDate(date);

        const control = this.horizontalStepperForm.get(`${stepName}.${controlName}`);
        control?.setValue(formattedDate);

        // Validación específica para las fechas de inicio y fin
        if (controlName === 'periodoDesarrolloInicio' || controlName === 'periodoDesarrolloFin') {
            this.validateFechas();
        }
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // aplanar datos a json / listas array
    flattenObject(input: any): any {
        const output = {};
        const multiselectFields = [
            'expectedImpact',
            'typeMaterialProduced',
            'supportReceived',
            'taxonomyEvent',
            'stagesMethodology',
        ];

        for (const step in input) {
            const stepData = input[step];
            for (const key in stepData) {
                if (multiselectFields.includes(key)) {
                    if (
                        typeof stepData[key] === 'string' &&
                        stepData[key].includes(',')
                    ) {
                        // Convertir cadenas con comas a listas de números
                        output[key] = stepData[key].split(',').map(Number);
                    } else if (
                        typeof stepData[key] === 'string' &&
                        stepData[key] !== ''
                    ) {
                        // Convertir cadenas individuales a una lista con un solo número
                        output[key] = [Number(stepData[key])];
                    } else {
                        // Si está vacío, enviar una lista vacía
                        output[key] = [];
                    }
                } else {
                    // Mantener el resto de las propiedades sin cambios
                    output[key] = stepData[key];
                }
            }
        }

        return output;
    }

    onExpectedImpactChange(): void {
    }

    submitDocumentoActuacion(identityId:number): void {

        if (this.selectedFiles.length > 0) {
            const formData = new FormData();

          this.selectedFiles.forEach((file) => {
            // formData.append('files', file, file.name);
            formData.append('files', file);
          });


            // Enviamos los archivos al servicio
            this.resumenService.uploadFile(identityId,formData).subscribe(
                (response) => {
                    Swal.fire({
                        title: '¡Actualización Exitosa!',
                        text: 'Documentos cargados correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                    })
                    // Limpiamos la selección tras el envío exitoso
                    this.selectedFiles = [];
                },
                (error) => {
                    Swal.fire({
                        title:  'Error',
                        text: 'Error al cargar los documentos.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar',
                    })
                }
            );
        } else {
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

    private shouldExcludeControl(controlName: string): boolean {
        const excludedControls = []; // Lista de controles a excluir aqui irian estas cosas 'estadoFlujo', 'codigoPractica', 'documentoActuacion' pero ya no se deben excluir
        
        return excludedControls.includes(controlName);
    }

    calculateProgress(): number {
        const formGroups = Object.keys(this.horizontalStepperForm.controls);
        let totalControls = 0;
        let filledControls = 0;
    
        //console.log("📌 Iniciando cálculo de progreso...");
    
        formGroups.forEach((step) => {
            const group = this.horizontalStepperForm.get(step) as UntypedFormGroup;
            if (group) {
                const controls = group.controls;
    
                Object.entries(controls).forEach(([controlName, control]) => {
                    // Excluir controles específicos SOLO para el caracterizador
                    if (this.shouldExcludeControl(controlName)) {
                        //console.log(` Excluyendo: ${controlName}`);
                        return;
                    }
    
                    // 🔥 Contar controles aunque estén deshabilitados (pero sin cambiar su estado)
                    totalControls++;
                    //console.log(`✅ Contando: ${controlName} - Valor: "${control.value}" - Deshabilitado: ${control.disabled}`);
    
                    // Contar como lleno si tiene un valor
                    if (control.value && control.value.toString().trim() !== '') {
                        filledControls++;
                        //console.log(`✔️ Lleno: ${controlName}`);
                    }
                });
            }
        });
    
        // Evitar dividir por cero
        if (totalControls === 0) {
            //console.log("⚠️ No hay controles a contar. Progreso: 0%");
            return 0;
        }
    
        // Calcular progreso
        const progressValue = Math.round((filledControls / totalControls) * 100);
        //console.log(`📊 Total controles: ${totalControls}, Llenos: ${filledControls}, Progreso: ${progressValue}%`);
    
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

    /**
     * Verifica si el rol actual es "validador".
     */
    private isValidatorRole(): boolean {
        const roles = localStorage.getItem('accessRoles');
        const currentRole = roles ? JSON.parse(roles)[0].toLowerCase() : 'registro';
        return currentRole === 'validador';
    }


// ======================== Logica envio de datos estructurados por PATCH de Evaluadores y Jefe Unidad seperados ======================== //
    dataTrazability(): void {
        const id = this.Id; // Asegúrate de que this.Id tiene un valor válido
        const idState = 4; // Puedes cambiarlo si necesitas otro estado
    
        this.resumenService.getTraceabilityData(id, idState).subscribe(
            (data) => {
                console.log(' Datos de trazabilidad:', data);
            },
            (error) => {
                console.error(' Error al obtener trazabilidad:', error);
            }
        );
    }

// ======================== Logica envio de datos estructurados por PATCH de Evaluadores y Jefe Unidad seperados ======================== //
// Función para manejar la actualización de evaluadores
private handleEvaluadoresUpdate(evaluadores: any[], flattenedValues: any): void {
    console.log('Cambiando estado a evaluación');
    flattenedValues.estadoFlujo = 'evaluacion';
    this.sendNotification(this.Id, 7);

    const formValues = this.horizontalStepperForm.getRawValue();

    const patchRequests = evaluadores.map(evaluador => {
        const patchData = {
            actualizaciones: {
                entityCgr: formValues.step1.entityCgr || null,
                nombreDependenciaArea: formValues.step1.nombreDependenciaArea || null,
                nombre: formValues.step2.nombre || '',
                cargo: formValues.step2.cargo || '',
                correo: formValues.step2.correo || '',
                contacto: formValues.step2.contacto || '',
                typeStrategyIdentification: formValues.step3.typeStrategyIdentification || null,
                typePractice: formValues.step3.typePractice || null,
                typology: formValues.step3.typology || null,
                estadoFlujo: 'evaluacion',
                levelGoodPractice: formValues.step3.levelGoodPractice || null,
                nombreDescriptivoBuenaPractica: formValues.step3.nombreDescriptivoBuenaPractica || '',
                propositoPractica: formValues.step3.propositoPractica || '',
                objectiveMainPractice: formValues.step3.objectiveMainPractice || null,
                expectedImpact: formValues.step4.expectedImpact || [],
                metodologiaUsada: formValues.step4.metodologiaUsada || '',
                durationImplementation: formValues.step4.durationImplementation || null,
                stagesMethodology: formValues.step4.stagesMethodology || [],
                periodoDesarrolloInicio: formValues.step4.periodoDesarrolloInicio || '',
                periodoDesarrolloFin: formValues.step4.periodoDesarrolloFin || '',
                typeMaterialProduced: formValues.step5.typeMaterialProduced || [],
                supportReceived: formValues.step5.supportReceived || [],
                recognitionsNationalInternational: formValues.step5.recognitionsNationalInternational || null,
                controlObject: formValues.step5.controlObject || null,
                taxonomyEvent: formValues.step5.taxonomyEvent || [],
                typePerformance: formValues.step5.typePerformance || null,
                documentoActuacion: formValues.step6.documentoActuacion || '',
                descripcionResultados: formValues.step5.descripcionResultados || ''
            },
            sAMAccountName: evaluador.userName,
            estadoFlujo: 'evaluacion',
            comentarioUsuario: this.additionalInfoFromModal || '',
        };

        console.log('Enviando actualización para evaluador:', evaluador.userName);
        return this.resumenService.updateDataAsJson(this.Id, patchData);
    });

    forkJoin(patchRequests).subscribe(
        () => {
            Swal.fire({
                title: '¡Actualización Exitosa!',
                text: 'El formulario ha sido asignado a los evaluadoress.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => window.location.href = './example');
        },
        () => {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo asignar la práctica a los evaluadores.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    );

    evaluadores.forEach(evaluador => {
        // this.notificationService.sendNotification(this.Id, evaluador.userName, 6);
        // this.notificationService.sendNotification(this.Id, evaluador.userName, 3);
    });
}


// Función para manejar la actualización del Jefe de Unidad
private handleJefeUnidadUpdate(jefe: any, flattenedValues: any): void {
    console.log('Cambiando estado a caracterizada_JU');
    flattenedValues.estadoFlujo = 'caracterizada_JU';

    const formValues = this.horizontalStepperForm.getRawValue();

    const patchData = {
        actualizaciones: {
            entityCgr: formValues.step1.entityCgr || null,
            nombreDependenciaArea: formValues.step1.nombreDependenciaArea || null,
            nombre: formValues.step2.nombre || '',
            cargo: formValues.step2.cargo || '',
            correo: formValues.step2.correo || '',
            contacto: formValues.step2.contacto || '',
            typeStrategyIdentification: formValues.step3.typeStrategyIdentification || null,
            typePractice: formValues.step3.typePractice || null,
            typology: formValues.step3.typology || null,
            estadoFlujo: 'caracterizada_JU',
            levelGoodPractice: formValues.step3.levelGoodPractice || null,
            nombreDescriptivoBuenaPractica: formValues.step3.nombreDescriptivoBuenaPractica || '',
            propositoPractica: formValues.step3.propositoPractica || '',
            objectiveMainPractice: formValues.step3.objectiveMainPractice || null,
            expectedImpact: formValues.step4.expectedImpact || [],
            metodologiaUsada: formValues.step4.metodologiaUsada || '',
            durationImplementation: formValues.step4.durationImplementation || null,
            stagesMethodology: formValues.step4.stagesMethodology || [],
            periodoDesarrolloInicio: formValues.step4.periodoDesarrolloInicio || '',
            periodoDesarrolloFin: formValues.step4.periodoDesarrolloFin || '',
            typeMaterialProduced: formValues.step5.typeMaterialProduced || [],
            supportReceived: formValues.step5.supportReceived || [],
            recognitionsNationalInternational: formValues.step5.recognitionsNationalInternational || null,
            controlObject: formValues.step5.controlObject || null,
            taxonomyEvent: formValues.step5.taxonomyEvent || [],
            typePerformance: formValues.step5.typePerformance || null,
            documentoActuacion: formValues.step6.documentoActuacion || '',
            descripcionResultados: formValues.step5.descripcionResultados || ''
        },
        sAMAccountName: jefe.userName,
        estadoFlujo: 'caracterizada_JU',
        comentarioUsuario: this.additionalInfoFromModal || '',
    };

    console.log("Datos a enviar:", JSON.stringify(patchData, null, 2));

    this.resumenService.updateDataAsJson(this.Id, patchData).subscribe(
        () => {
            Swal.fire({
                title: '¡Actualización Exitosa!',
                text: 'El formulario ha sido asignado al Jefe de Unidad.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => window.location.href = './example');
        },
        () => {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo asignar la práctica al Jefe de Unidad.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    );

    // this.notificationService.sendNotification(this.Id, jefe.userName, 6);
    // this.notificationService.sendNotification(this.Id, jefe.userName, 3);
}

// ======================== Logica envio de datos estructurados por PATCH ======================== //
private handleUpdateRequest(id: number, estadoFlujo: string, successMessage: string): void {
    const patchData = {
        actualizaciones: {
            estadoFlujo, // Actualizar estado de flujo
        },
        sAMAccountName: this.selectedUserFromModal?.userName || 'defaultUser', // Usuario
        estadoFlujo,
        comentarioUsuario: this.additionalInfoFromModal || '', // Comentario adicional desde el modal
    };

    // Llamar al servicio de actualización
    this.resumenService.updateDataAsJson(id, patchData).subscribe(
        (response) => {
            Swal.fire({
                title: '¡Actualización Exitosa!',
                text: successMessage,
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
}


// ======================== Logica multiselect entidad momentaneo ======================== //
    entityOptions = [
        { id: 1, name: 'Contraloría General de la República' },
        { id: 2, name: 'Registraduría Nacional del Estado Civil' },
    ];

// ======================== Método para verificar validez del formulario (ignora campos deshabilitados) ======================== //
    checkFormValidity(form: FormGroup): boolean {
        let isValid = true;

        Object.keys(form.controls).forEach((step) => {
            const group = form.get(step) as FormGroup;
            if (group) {
                Object.keys(group.controls).forEach((control) => {
                    const formControl = group.get(control);
                    if (formControl && formControl.enabled && formControl.invalid) {
                        isValid = false;
                    }
                });
            }
        });

        return isValid;
    }

// ======================== Logica que valida las fechas ========================= //
    validateFechas(): void {
        const fechaInicioControl = this.horizontalStepperForm.get('step4.periodoDesarrolloInicio');
        const fechaFinControl = this.horizontalStepperForm.get('step4.periodoDesarrolloFin');

        if (!fechaInicioControl || !fechaFinControl) {
            return;
        }

        const fechaInicio = new Date(fechaInicioControl.value);
        const fechaFin = new Date(fechaFinControl.value);

        // Validar que fecha de fin no sea anterior a la de inicio
        if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
            fechaFinControl.setErrors({ fechaFinAnterior: true });
        } else {
            fechaFinControl.setErrors(null);
        }
    }

// ======================== Logica que cambia el estado de la practica a desestimar ======================== //
dismissPractice(): void {
    if (!this.Id) {
        Swal.fire({
            title: 'Error',
            text: 'No se puede cambiar el estado de la práctica porque no se encontró un ID válido.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return;
    }

    const accessName = localStorage.getItem('accessName'); // Obtener el accessName desde el localStorage

    if (!accessName) {
        Swal.fire({
            title: 'Error',
            text: 'No se encontró un usuario logueado. No se puede realizar la actualización.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        return; // Finaliza si no hay accessName
    }

    const patchData = {
        actualizaciones: {
            estadoFlujo: 'descartada', // Actualizar el estado de flujo
        },
        sAMAccountName: accessName, // Usuario logueado como sAMAccountName
        estadoFlujo: 'descartada', // Estado de flujo
        comentarioUsuario: 'Comentario estándar', // Comentario fijo
    };

    // Llamar al servicio de actualización con el nuevo formato
    this.resumenService.updateDataAsJson(this.Id, patchData).subscribe(
        (response) => {
            Swal.fire({
                title: '¡Práctica Desestimada!',
                text: 'El estado de la práctica ha sido actualizado correctamente a "desestimada".',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            }).then(() => {
                window.location.href = './example';
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


// ======================== Logica que muestra el modal en la vista ======================== //
    openCaracterizationModal(): void {
        const roles = localStorage.getItem('accessRoles');
        const currentRole = roles ? JSON.parse(roles)[0].toLowerCase() : 'registro';

        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '500px',
            data: {
                role: currentRole,
                selectedUser: this.selectedUserFromModal, // Pasar usuario seleccionado (para selección única)
                selectedUsers: this.selectedUsersFromModal, // Pasar usuarios seleccionados (para selección múltiple)
                additionalInfo: this.additionalInfoFromModal // Pasar información adicional
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Guardar los datos seleccionados al cerrar el modal
                this.selectedUserFromModal = result.selectedUser || null;
                this.selectedUsersFromModal = result.selectedUsers || []; // Asegúrate de que esta propiedad exista y se maneje correctamente
                this.additionalInfoFromModal = result.additionalInfo || '';

                if (this.selectedUsersFromModal) {
                    // Guardar en localStorage como JSON
                    localStorage.setItem('selectedUser', JSON.stringify(this.selectedUsersFromModal));
                } else {
                    localStorage.removeItem('selectedUser'); // Limpiar si no hay usuario seleccionado
                }

                 console.log('Usuarios seleccionados:', this.selectedUsersFromModal); // Verifica que todos los usuarios estén aquí
                 console.log('Información adicional:', this.additionalInfoFromModal);
            } else {
            }
        });
    }

    canProceed(): boolean {
        const roles = localStorage.getItem('accessRoles');
        const currentRole = roles ? JSON.parse(roles)[0].toLowerCase() : 'registro';

        if (currentRole === 'validador') {
            // Para "validador", verificar si hay un usuario seleccionado (selección única)
            return !!this.selectedUserFromModal; // Asegura que selectedUserFromModal no sea null o undefined
        } else if (currentRole === 'caracterizador') {
            // Para "caracterizador", verificar si hay usuarios seleccionados (selección múltiple)
            return this.selectedUsersFromModal && this.selectedUsersFromModal.length > 0;
        }

        // Para otros roles, permite avanzar sin restricciones
        return true;
    }
}