import { SignInService } from './sign-in.service';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/core/auth/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterModule,
        MatFormFieldModule,
        FuseAlertComponent,
        MatButtonModule,
        MatInputModule,
        CommonModule,
        MatIconModule
    ],
})

export class AuthSignInComponent implements OnInit {
    signInForm: UntypedFormGroup;
    alert: { type: string; message: string } | null = null;
    showAlert: any;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _signInService: SignInService,
        private _authService: AuthService,

        private _router: Router,
        private _activatedRoute: ActivatedRoute // Inject ActivatedRoute to access query parameters
    ) {}

    ngOnInit(): void {
        // Crear el formulario de inicio de sesión
        this.signInForm = this._formBuilder.group({
            sAMAccountName: [''], // Campo de usuario requerido
            password: [''], // Campo de contraseña requerido
        });
    }

/**
     * Sign in
     */
signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
        return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value).subscribe(
        () => {
            // Set the redirect url.
            // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
            // to the correct page after a successful sign in. This way, that url can be set via
            // routing file and we don't have to touch here.
            const redirectURL =
                this._activatedRoute.snapshot.queryParamMap.get(
                    'redirectURL'
                ) || '/signed-in-redirect';

            // Navigate to the redirect url
            this._router.navigateByUrl(redirectURL);
        },
        (response) => {
            if (response.status!='success') {

                    // Re-enable the form
                    this.signInForm.enable();

                    this.alert = {
                        type: 'error',
                        message: 'Datos Incorrectos',
                    };

            } else {

            }
        }
    );
}

}
