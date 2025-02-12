import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    MaxValidator,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { valid } from 'chroma-js';
import { finalize } from 'rxjs';
import { UserService } from './register-users.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'auth-register-users',
    templateUrl: './register-users.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class AuthRegisterUsersComponent implements OnInit {

    @ViewChild('registerUsersNgForm') registerUsersNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    registerUsersForm: UntypedFormGroup;
    showAlert: boolean = false;

    userData: any = {
        fullName:'',
        email:'',
        password:'',
        phone:'',
        sAMAccountName:''
    }
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService : UserService
    ) {}

   
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.registerUsersForm = this._formBuilder.group({
            fullName:['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['',[Validators.required, Validators.maxLength(255)]],
            phone:['', [Validators.required, Validators.maxLength(225)]],
            sAMAccountName:['', [Validators.required, Validators.maxLength(255)]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the form 
     */
    sendRegisterUsersForm(): void{
        if(this.registerUsersForm.valid){
            this.userData = this.registerUsersForm.value;
            this.userService.sendUsersForm(this.userData).subscribe(
                response =>{
                    Swal.fire({
                        title:'¡Usuario registrado!',
                        text: 'Se ha guardado exitasamente',
                        icon: 'success',
                        confirmButtonText:'Aceptar',
                    })
                    this.showAlert = true;
                },
                error =>{
                        Swal.fire({
                            title: 'Error al crear el usuario',
                            text: 'No se pudo registrar el usuario. Intenta nuevamente.',
                            icon: 'error',
                            confirmButtonText: 'Aceptar',
                        });
                    this.showAlert = true;
                }
            )
        } else {
            this.alert = {
                type: 'error',
                message: 'Formulario inválido. Por favor, revisa los campos.'
              };
            this.showAlert = true;
        }
    }
   
    }

