import { ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
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
import { FormControl, FormsModule, Validators, UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuditService } from '../audit/audit.service';
import { NgForOf, NgIf } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatChipsModule } from '@angular/material/chips';
import { Subject } from 'rxjs';

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
    MatStepperModule,
    FormsModule,
    NgForOf,
    NgIf,
    MatChipsModule,
    ReactiveFormsModule
  ],
  providers: [],
  templateUrl: './email-audit.component.html',
  styleUrl: './email-audit.component.scss'
})
export class EmailAuditComponent implements OnInit {
  groups: any[] = [];
  audits: any[] = [];
  selectAudits: any = null;
  selectedGroup: any = null;
  selectUsers: any = null;
  selectEmails: string[] = [];
  emails: string[] = [];
  @Input() identityId: number;
  emailForm: UntypedFormGroup;
  emailControl = new FormControl('', [Validators.email]);
  startDate: string = this.formatDate(new Date());

  constructor(private auditService: AuditService, private formBuilder: UntypedFormBuilder) {}

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  removeEmail(email: string): void {
    const index = this.emails.indexOf(email);
    if (index >= 0) {
      this.emails.splice(index, 1);
      this.updateEmails();
    }
  }

  onGroupSelected(groupId: number): void {
    this.selectedGroup = this.groups.find(group => group.id === groupId);
  }

  onAuditSelect(auditId: number): void {
    this.selectAudits = this.audits.find(audit => audit.id === auditId);
  }

  onEmails(): void {
    console.log('Emails almacenados', this.emails);
  }

  getSelectedUsers(): void {
    if (this.selectedGroup && this.selectedGroup.users) {
      this.selectUsers = this.selectedGroup.users.filter(user => user.selected);
      this.selectEmails = this.selectUsers.map(user => user.email);
      this.updateEmails();
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.auditService.getAllGroups().subscribe(
      response => {
        this.groups = response;
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Error al cargar los grupos.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
    this.emailForm = this.formBuilder.group({
      step1: this.formBuilder.group({
        identityId: [this.identityId],
        subject: ['', Validators.required],
        userSelected: [this.selectUsers],
        emails: [this.emails, Validators.required],
        groupId: [this.selectedGroup]
      }),
      step2: this.formBuilder.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        body: ['', Validators.required]
      })
    });
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.addEmail({ input: event.target as HTMLInputElement, value: this.emailForm.get('step1.emails').value });
      event.preventDefault();
    }
  }

  addEmail(event: any): void {
    const input = event.input;
    const value = event.value;
    const newEmails = value.split(',').map((email: string) => email.trim()).filter((email: string) => email !== '');
    this.emails = [...this.emails, ...newEmails];
    this.updateEmails();
    if (input) {
      input.value = '';
    }
  }

  updateEmails(): void {
    const combinedEmails = [...new Set([...this.emails, ...this.selectEmails])];
    this.emailForm.get('step1.emails').setValue(combinedEmails);
  }

  generateAuditoriaPayload(): any {
    const formValue = this.emailForm.value;
    const payload = {
      identity: Number(formValue.step1.identityId),
      subject: formValue.step1.subject,
      startDate: String(formValue.step2.startDate),
      endDate: String(this.formatDate(formValue.step2.endDate)),
      state: 1,
      group: formValue.step1.groupId,
      body: String(formValue.step2.body),
      correosUsers: formValue.step1.emails
    };
    console.log('Audit creada:', payload);
    return payload;
  }

  onSendForm() {
    console.log('Auditoria en onSendForm:', this.generateAuditoriaPayload());
    return this.auditService.postAudit(this.generateAuditoriaPayload()).subscribe(
      response => {
        Swal.fire({
          title: '¡Auditoria programada!',
          text: `Codigo de la auditoria ${response.auditCode}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error => {
        Swal.fire({
          title: 'Error al programar auditoria',
          text: `Error:${error}`,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
}
