import { ENTER } from '@angular/cdk/keycodes';
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
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { AuditService } from '../audit/audit.service';
import { NgForOf, NgIf } from '@angular/common';
import { NgModel } from '@angular/forms';
import { catchError, filter } from 'rxjs';
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
  emails: string[] = [];

  emailControl = new FormControl('',[Validators.email]);

  constructor(private auditService: AuditService) {}
  onKeyDown(event: KeyboardEvent): void {
    if (event.keyCode === ENTER) {
      this.addEmail({ input: event.target as HTMLInputElement, value: this.emailControl.value });
      event.preventDefault(); 
    }
  }
  addEmail(event:any):void{
    const input = event.input;
    const value = event.value;
    const newEmails = value.split(',').map((email:string)=> email.trim()).filter((email:string)=>email && this.validateEmail(email));

    this.emails =[...this.emails, ...newEmails];
    if(input){
      input.value='';
    }
    this.emailControl.setValue(null);
  }
  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }
  removeEmail(email: string):void{
    const index = this.emails.indexOf(email);
    if(index>=0){
      this.emails.splice(index, 1);
    }
  }
  onGroupSelected() {
    console.log('Grupo seleccionado:', this.selectedGroup);
  }
  onEmails(){
    console.log('Emails almacenados', this.emails)
  }

  getSelectedUsers(){
    this.selectUsers = this.selectedGroup.users.filter(user => user.selected);
    console.log('Usuarios seleccionados',this.selectUsers);
  }

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
