import { Component, ViewEncapsulation, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommitteeService } from './committee.service';
import { ResumenService } from '../resumen/resumen.service';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import {GenaralModalService} from '../../modules/common/general-modal/general-modal.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogOverviewExampleDialog } from '../../modules/common/general-modal/general-modal.component'; 


@Component({
    selector: 'committee',
    standalone: true,
    templateUrl: './committee.component.html',
    styleUrls: ['./committee.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        RouterModule
    ]
})
export class CommitteeComponent implements OnInit {
    id: string | null = null;
    committeeData: any = {}; // Almacenar todos los datos
    showAnswers: boolean = false;
    roles: any[] = [];
    usuarios: any[] = [];
    selectedUserFromModal: any = null;
    additionalInfoFromModal: string = '';
    selectedUsersFromModal: any[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private committeeService: CommitteeService,
        private resumenService: ResumenService,
        private cdRef: ChangeDetectorRef,
        private genaralModalService: GenaralModalService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            this.id = params['id'];
            console.log('ID recibido en Committee:', this.id);
    
            if (this.id) {
                this.loadCommitteeData(Number(this.id));
                this.loadResumenData(this.id); // 🔹 Llamamos a loadResumenData en lugar de getDataAsJson directamente
            }
        });
        this.getRolesYUsuarios();
        
        // Optención de los formularios con role_form = 11
        this.committeeService.getFormsWithRole11().subscribe(
            data => {
              console.log('✅ Formularios con role_form 11:', data);
            },
            error => {
              console.error('⚠️ Error al cargar los formularios:', error);
            }
          );
          
    }
    
     // 🔹 Método para obtener los datos del comité
private loadCommitteeData(id: number): void {
    this.committeeService.getCommitteeData(id).subscribe(
        (response) => {
            console.log('Datos del comité:', response.data);

            const data = response.data;

            // Determinar el número mínimo de registros en cada bloque
            const totalRegistros = Math.min(
                data.identitys.length,
                data.userIds.length,
                data.formEntitys.length
            );

            // Agrupar los datos relacionados
            const groupedData = [];
            for (let i = 0; i < totalRegistros; i++) {
                groupedData.push({
                    identity: data.identitys[i], 
                    userId: data.userIds[i], 
                    formEntity: data.formEntitys[i],
                    showAnswers: false // Agregar la propiedad showAnswers a cada objeto
                });
            }

            this.committeeData = groupedData;
            console.log('Datos agrupados:', this.committeeData);
        },
        (error) => {
            console.error('Error al obtener los datos:', error);
        }
    );
}


    // 🔹 Método para obtener estadoFlujo y codigoPractica
    private loadResumenData(id: string): void {
        console.log('Cargando datos de resumen para ID:', id);
    
        this.resumenService.getDataAsJson(id).subscribe(
            (response) => {
                console.log('Datos de resumen recibidos:', response);
    
                if (response) {
                    // Mezclar los datos con los existentes sin sobrescribir
                    this.committeeData = {
                        ...this.committeeData, // Mantener los datos actuales
                        estadoFlujo: response.estadoFlujo,
                        codigoPractica: response.codigoPractica,
                        estimacion: response.estimacion
                    };
                } else {
                    console.warn('La respuesta de resumen está vacía o no tiene datos.');
                }
            },
            (error) => {
                console.error('Error al obtener los datos de resumen:', error);
            }
        );
    }    

    // Método para alternar la visibilidad de las respuestas
    toggleAnswers(item: any): void {
        item.showAnswers = !item.showAnswers; // Cambia el estado individualmente
    }

    cambiarEstadoDeFlujo(): void {
        if (!this.id) {
            Swal.fire({
                title: 'Error',
                text: 'No se encontró un ID válido para actualizar el estado de flujo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }
    
        if (!this.selectedUsersFromModal || this.selectedUsersFromModal.length === 0) { 
            Swal.fire({
                title: 'Error',
                text: 'Debe seleccionar un usuario antes de cambiar el estado de flujo.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }
    
        const idAsNumber = Number(this.id);
        const nuevoEstadoFlujo = 'seguimiento';
    
        // 🔹 Recorrer cada usuario seleccionado y enviar la petición
        this.selectedUsersFromModal.forEach(user => {
            const updatedData = {
                actualizaciones: {
                    estadoFlujo: nuevoEstadoFlujo, 
                },
                sAMAccountName: user.userName, // Usar el mismo campo que en performEvolution
                estadoFlujo: nuevoEstadoFlujo,
                comentarioUsuario: this.additionalInfoFromModal || ''
            };
    
            console.log('Enviando datos para usuario:', updatedData.sAMAccountName);
    
            this.resumenService.updateDataAsJson(idAsNumber, updatedData).subscribe(
                (response) => {
                    console.log(`Seguimiento asignado a: ${updatedData.sAMAccountName}`);
                },
                (error) => {
                    console.error(`Error al actualizar usuario ${updatedData.sAMAccountName}:`, error);
                }
            );
        });
    
        // Limpiar selección después de enviar los datos
        this.clearSelection();
    
        Swal.fire({
            title: '¡Éxito!',
            text: 'El estado de flujo ha sido actualizado correctamente.',
            icon: 'success', 
            confirmButtonText: 'Aceptar',
        }).then(() => {
            window.location.href = './example'; 
        });        
    }

    clearSelection(): void {
        this.selectedUsersFromModal = [];  // Limpiar la lista de usuarios seleccionados
        this.additionalInfoFromModal = ''; // Limpiar el comentario ingresado
    }

    getBoxClass(estimacion: string): string {
        if (estimacion === 'malaPractica') {
            return 'border-red';  // Rojo
        } else if (estimacion === 'null' || estimacion === null) {
            return 'border-gray';  // Gris
        } else if (estimacion === 'enviada') {
            return 'border-green';  // Verde
        }
        return 'border-blue';  // Azul por defecto
    }
    
    // ======================== Logica que cambia el estado de la practica a desestimar ======================== //
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
    
        // Convertir el id a número
        const idAsNumber = Number(this.id);
    
        const patchData = {
            actualizaciones: {
                estadoFlujo: 'descartada', // Actualizar el estado de flujo
            },
            sAMAccountName: accessName, // Usuario logueado como sAMAccountName
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

    // ======================== Método para ver los datos del endpoint ======================== //
    comiteTecnicoUserId: number | null = null; // Variable para almacenar el idUser del comité técnico

    getRolesYUsuarios() {
        this.genaralModalService.getDataAsJson({ rol: 'Administrador' }).subscribe(
            (response) => {
                console.log('Usuarios y roles obtenidos:', response);
    
                if (response && Array.isArray(response.data)) {
                    const comiteTecnico = response.data.find(user => user.cargo === "comiteTecnico");
    
                    if (comiteTecnico) {
                        this.comiteTecnicoUserId = comiteTecnico.idUser; // Guardamos el idUser del comité técnico
                        console.log('ID del usuario del comité técnico encontrado:', this.comiteTecnicoUserId);
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

 // ======================== Logica que muestra el modal en la vista ======================== //
    openModal(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '500px',
            panelClass: 'custom-modal-class',
            data: {
            role: 'comiteTecnico',
            selectedUser: this.selectedUserFromModal, 
            selectedUsers: this.selectedUsersFromModal || [], 
            additionalInfo: this.additionalInfoFromModal
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedUserFromModal = result.selectedUser || this.selectedUserFromModal; 
                this.selectedUsersFromModal = result.selectedUsers || this.selectedUsersFromModal; // <-- Agregar esto
                this.additionalInfoFromModal = result.additionalInfo || this.additionalInfoFromModal; 

                // 🔹 Agregar logs para verificar valores seleccionados
                console.log('Usuario seleccionado:', this.selectedUserFromModal);
                console.log('Usuarios seleccionados (seguimiento):', this.selectedUsersFromModal);
                console.log('Comentario ingresado:', this.additionalInfoFromModal);
            }
        });
    }
}    