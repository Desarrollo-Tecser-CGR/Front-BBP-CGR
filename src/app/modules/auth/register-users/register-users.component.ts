import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
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

    rol: string = 'registro';
    enabled: number = 1;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder
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
            full_name:['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.email]],
            rol: [this.rol, Validators.required],
            enabled: [this.enabled, Validators.required],
            password:['',[Validators.required, Validators.maxLength(255)]],
            phone:['', [Validators.required, Validators.maxLength(225)]],
            samaccount_name:['', [Validators.required, Validators.maxLength(255)]]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the form 
     */
    sendRegisterUsersForm() {
        throw new Error('Method not.');
    }
   
    }

