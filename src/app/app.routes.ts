import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';


// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'example'},

    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'register-users', loadChildren: () => import('app/modules/auth/register-users/register-users.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty',
            roles: [
                'admin',
                'consultor'
            ]
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'example', loadChildren: () =>
                import('app/modules/admin/example/example.routes'),
                data: { requiredRoles: ['validador', 'administrador', 'registro', 'caracterizador' , 'jefeUnidad', 'comiteTecnico', 'seguimiento', 'evaluador', 'evolucionador'], module: '' }
            },
        ]
    },

    // AssignRole routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'assignRole', loadChildren: () =>
                import('app/modules/assignRole/assignRole.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },

    // Info User routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'info-user', loadChildren: () =>
                import('app/modules/info-user/info-user.routes'),
                data: { requiredRoles: ['administrador','registro', 'validador','caracterizador', 'jefeUnidad', 'evaluador', 'comiteTecnico', 'seguimiento', 'evolucionador'], module: '' }

            // {path: 'caracterization', loadChildren: () =>
            //     import('app/modules/caracterization/caracterization.routes'),
            //     data: { requiredRoles: ['validador', 'administrador', 'caracterizador' , 'jefeUnidad', 'comiteTecnico', 'seguimiento', 'evaluador', 'evolucionador'], module: '' }

            },
        ]
    },

    // Catalog  routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'catalog', loadChildren: () =>
                import('app/modules/catalog/catalog.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'assessment', loadChildren: () =>
                import('app/modules/assessment/assessment.routes'),
                data: { requiredRoles: ['administrador', 'evaluador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'follow', loadChildren: () =>
                import('app/modules/follow/follow.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'publication', loadChildren: () =>
                import('app/modules/publication/publication.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'publication-questions', loadChildren: () =>
                import('app/modules/publication-questions/publication-questions.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },
    // Resumen common routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'resumen', loadChildren: () =>
                import('app/modules/resumen/resumen.routes'),
                data: { requiredRoles: ['registro'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'inbox', loadChildren: () =>
                import('app/modules/common/inbox/inbox.routes'),
                data: { requiredRoles: ['administrador', 'validador','caracterizador', 'jefeUnidad', 'evaluador', 'seguimiento', 'comiteTecnico', 'evolucionador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'optionsDropdown/characterization', loadChildren: () => import('app/modules/optionsDropdown/characterization/characterization.routes')},
        ]
    },
        {
        path: 'options',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'characterization', loadChildren: () => import('app/modules/optionsDropdown/characterization/characterization.routes')},
            // {path: 'characterization', loadChildren: () => import('app/modules/optionsDropdown/characterization/characterization.routes')},

        ]
    },
    // create routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'create', loadChildren: () =>
                import('app/modules/create/create.routes'),
                data: { requiredRoles: ['administrador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'resumen-edit', loadChildren: () =>
                import('app/modules/resumen-edit/resumen-edit.routes'),
                data: { requiredRoles: ['validador','administrador', 'caracterizador', 'jefeUnidad'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'committee', loadChildren: () =>
                import('app/modules/committee/committee.routes'),
                data: { requiredRoles: ['administrador', 'comiteTecnico'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'diffusion', loadChildren: () =>
                import('app/modules/diffusion/diffusion.routes'),
                data: { requiredRoles: ['seguimiento'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'committee', loadChildren: () =>
                import('app/modules/committee/committee.routes'),
                data: { requiredRoles: ['administrador', 'comiteTecnico'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'evaluation-questionnaire', loadChildren: () =>
                import('app/layout/common/evaluation-questionnaire/evaluation-questionnaire.component.routes'),
                data: { requiredRoles: ['evaluador'], module: '' }
            },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'evolution-questionnaire', loadChildren: () =>
                import('app/layout/common/evolution-questionnaire/evolution-questionnaire.component.routes'),
                data: { requiredRoles: ['administrador', 'evolucionador'], module: '' }
            },
        ]
    }
];