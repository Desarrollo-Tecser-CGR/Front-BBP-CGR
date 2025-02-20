import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ResumeTableComponent } from 'app/layout/common/resume-table/resume-table.component';
import { AuditComponent } from 'app/layout/common/audit/audit.component';
import { ActivatedRoute } from '@angular/router';
import { EmailAuditComponent } from "../../layout/common/email-audit/email-audit.component";
import { MatDivider } from '@angular/material/divider';
import { MatDividerModule } from '@angular/material/divider';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-diffusion',
  standalone: true,
  imports: [
    MatTabsModule,
    ResumeTableComponent,
    AuditComponent,
    EmailAuditComponent,
    MatDivider,
    MatDividerModule,
  ],
  templateUrl: './diffusion.component.html',
  styleUrls: ['./diffusion.component.scss']
})
export class DiffusionComponent {
  @Input() Id: number;  // El valor se pasará desde el componente padre
  id: string = '';

  constructor(private route: ActivatedRoute, private resumenService: ResumenService) {}

  ngOnInit() {
    const idFromRoute = this.route.snapshot.paramMap.get('id');
    this.id = idFromRoute || '';  // Asegúrate de tener un id válido
    console.log('id en difusion:', this.id);
  }

  // Método para realizar la evolución
  realizarEvolucion(): void {
    if (!this.id) {
      Swal.fire({
        title: 'Error',
        text: 'No se encontró un ID válido para realizar la evolución.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    // Definir el nuevo estado
    const nuevoEstadoFlujo = 'evolucion';

    // Datos que se van a actualizar
    const updatedData = {
      actualizaciones: {
        estadoFlujo: nuevoEstadoFlujo, // Nuevo estado
      },
      sAMAccountName: 'bbp13.cgr', // Acceso al nombre de usuario
      estadoFlujo: nuevoEstadoFlujo,
      comentarioUsuario: '', // Puedes agregar un comentario si es necesario
    };

    console.log('Datos de usuario:', updatedData.sAMAccountName);

    // Convertimos el id a número para enviarlo al servicio
    const idAsNumber = Number(this.id);

    // Llamada al servicio para realizar la actualización
    this.resumenService.updateDataAsJson(idAsNumber, updatedData).subscribe(
      (response) => {
        Swal.fire({
          title: '¡Evolución Realizada!',
          text: 'El estado de flujo ha sido actualizado a "Evolución".',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          window.location.href = './example';  // Redirigir después de la actualización
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado de flujo. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    );
  }
}
