import { throwError } from 'rxjs';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ResumenService } from 'app/modules/resumen/resumen.service';
import Swal from 'sweetalert2';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import {FormGroup, FormsModule,ReactiveFormsModule,UntypedFormBuilder,UntypedFormGroup,Validators
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResumenComponent } from 'app/modules/resumen/resumen.component';


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
        ResumenComponent
  ],
  templateUrl: './evaluation-questionnaire.component.html',
  styleUrl: './evaluation-questionnaire.component.scss'
})

export class EvaluationQuestionnaireComponent{
    id: string;
    formData: any = {};
    data : any = {};
    
    constructor(private resumenService: ResumenService, private route: ActivatedRoute){}

    ngOnInit(): void{
      //traer hoja de vida por id
      this.id=this.route.snapshot.paramMap.get('id');
      console.log('Id en cuestionario:', this.id);
      this.resumenService.getDataAsJson(this.id).subscribe(
      (response)=>{
          this.data = response;
          console.log('Practica:', this.data);
          return this.data;
      },
      (error)=>{
        Swal.fire({
        title: 'Error',
        text: `No se pudo abrir la practica.${error}`,
        icon: 'error',
        confirmButtonText: 'Aceptar',
        });
      }
    
    )

  }
      //incluir formulario de evaluación 
    

}


