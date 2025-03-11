import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip'; 
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrl: './shortcuts.component.scss',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'shortcuts',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule, CommonModule],
})
export class ShortcutsComponent {
    user: User | null = null;
    constructor(
        private _navigationService: NavigationService,
        private _router: Router
    ) {}
    ngOnInit(): void {
            const roles = localStorage.getItem('accessRoles');
            const cargo = roles ? JSON.parse(roles)[0] : 'Rol';
            this.user = { cargo } as User;
    }
    async generarPDF(): Promise<void> {
        let viewName = this._router.url.split('/').pop() || 'documento';
        viewName = viewName.replace(/[^a-zA-Z0-9-_]/g, '');

        Swal.fire({
            title: 'Generando PDF...',
            text: 'Por favor, espere mientras se procesa el documento.',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        this._navigationService.toggleNavigation('mainNavigation');
        await new Promise((resolve) => setTimeout(resolve, 500));

        document.body.classList.add('hide-alert');

        const content = document.body;
        const scaleFactor = 4;
        const canvas = await html2canvas(content, {
            scale: scaleFactor,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
        });

        document.body.classList.remove('hide-alert');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'a4',
            compress: true,
        });

        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        pdf.save(`${viewName}.pdf`);

        this._navigationService.toggleNavigation('mainNavigation');
        Swal.close();

        Swal.fire({
            icon: 'success',
            title: 'PDF generado',
            text: 'El documento ha sido guardado correctamente.',
            timer: 2000,
            showConfirmButton: false
        });
    }
}
