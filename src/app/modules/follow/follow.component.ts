import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    FormControl
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';


@Component({
    selector: 'follow',
    standalone: true,
    templateUrl: './follow.component.html',
    styleUrls: ['./follow.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class FollowComponent implements OnInit {
    horizontalStepperForm: UntypedFormGroup;
    searchControl = new FormControl(); // Control del campo de búsqueda
    options: string[] = [];
    users: any[] = [];
    roles: any[] = [];
    selectedUserId: number | null = null;
    selectedRoleIds: number[] = [];
    filteredOptions!: Observable<string[]>;

    constructor(private _formBuilder: UntypedFormBuilder, private http: HttpClient) { }

    ngOnInit(): void {
        this.loadUsers();
        this.loadRoles();

        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                fecha: [''],
                country: [''],
                language: [''],
                selectedUserId: ['1', Validators.required]
            }),
            step2: this._formBuilder.group({
                firstName: [''],
                lastName: [''],
                userName: [''],
                about: [''],
            }),
            step3: this._formBuilder.group({
                byEmail: this._formBuilder.group({
                    companyNews: [true],
                    featuredProducts: [false],
                    messages: [true],
                }),
                pushNotifications: ['everything', Validators.required],
            }),
            roles: this._formBuilder.group({
                adminRole: [false],
                analystRole: [false],
                auditorRole: [false],
            })
        });

        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map((value) => this._filter(value || ''))
        );
    }
    private getapiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user`;
    private rolapiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/role`;
    private postapiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/user`;

    loadUsers(): void {
        // this.http.get('http://192.168.2.42:8001/api/v1/user').subscribe((response: any) => {
        this.http.get(this.getapiUrl).subscribe((response: any) => {
            if (response && Array.isArray(response.data)) {
                // Mapea los usuarios para usar idUser y userName
                this.users = response.data.map((user: any) => ({
                    id: user.idUser,
                    name: user.userName,
                    email: user.email,
                    cargo: user.cargo
                }));
            } else {
                console.error('El formato de datos de los usuarios es incorrecto:', response);
            }
        });
    }

    get selectedUser(): any {
        return this.users.find(user => user.id === this.selectedUserId) || null;
    }

    loadRoles(): void {
        // this.http.get('http://192.168.2.42:8001/api/v1/role').subscribe((response: any) => {
        this.http.get(this.rolapiUrl).subscribe((response: any) => {
            if (response && Array.isArray(response.data)) {
                // Mapea los roles para usar id y name
                this.roles = response.data.map((role: any) => ({
                    id: role.id,
                    name: role.name
                }));
            } else {
                console.error('El formato de datos de los roles es incorrecto:', response);
            }
        });
    }

    assignRoles(): void {
        const payload = {
            idUser: this.selectedUserId,
            roleIds: this.selectedRoleIds
        };

        // this.http.post('http://192.168.2.42:8001/api/v1/user', payload).subscribe(
        this.http.post(this.postapiUrl, payload).subscribe(
            () => {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Roles asignados correctamente.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '../example';
                        console.error('Roles asignados correctamente.');
                    }
                });
            },
            (error) => {
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al asignar los roles. Por favor, intenta nuevamente.',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
                console.error('Error al asignar los roles: ', error);
            }
        );
    }

    onRoleSelectionChange(event: any, roleId: number): void {
        if (event.checked) {
            // Agregar el ID del rol seleccionado
            this.selectedRoleIds.push(roleId);
        } else {
            // Eliminar el ID del rol si se desmarca
            this.selectedRoleIds = this.selectedRoleIds.filter((id) => id !== roleId);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.options.filter((option) =>
            option.toLowerCase().includes(filterValue)
        );
    }
}
