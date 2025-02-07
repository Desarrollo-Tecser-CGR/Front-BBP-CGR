import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AuditService } from '../audit/audit.service';
import { NgForOf, NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';
import { catchError } from 'rxjs';
import Swal from 'sweetalert2';
import {MatChipsModule} from '@angular/material/chips';


@Component({
  selector: 'app-email-audit',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSelectModule,
    FormsModule,
    NgForOf,
    NgIf,
    MatChipsModule
  ],
  providers: [],
  templateUrl: './email-audit.component.html',
  styleUrl: './email-audit.component.scss',
})
export class EmailAuditComponent implements OnInit {
  groups: any[] = [];
  selectedGroup: any = null;
  selectUsers: any = null;

  constructor(private auditService: AuditService) {}

  onGroupSelected() {
    console.log('Grupo seleccionado:', this.selectedGroup);
  }

  getSelectedUsers(){
    this.selectUsers = this.selectedGroup.users.filter(user => user.selected);
    console.log('Usuarios seleccionados',this.selectUsers);
  }
  // getSelectedUsers() {
  //   return this.selectedGroup ? this.selectedGroup.users.filter((user: any) => user.selected) : [];
  // }

  ngOnInit(): void {
    this.auditService.getAllGroups().subscribe(
      (response)=>{
        this.groups = response;
      },
      (error)=>{
        Swal.fire({
          title:  'Error',
          text: 'Error al cargar los grupos.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        })
      }
    );
    console.log('Grupos en el formulario', this.groups);
  }
}
