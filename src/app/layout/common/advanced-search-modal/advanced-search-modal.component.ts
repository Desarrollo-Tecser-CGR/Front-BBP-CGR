import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterService } from '../advanced-search-modal/FilterService';
import { Router, RouterModule } from '@angular/router';
// import { InboxComponent  } from '../../../modules/common/inbox/inbox.component';

// const routes: Routes = [
//   { path: 'Inbox', component: InboxComponent },
//   { path: '', redirectTo: '/users', pathMatch: 'full' }
// ];

@Component({
  selector: 'quick-chat',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'quickChat',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TextFieldModule,
    ReactiveFormsModule,
    RouterModule
  ],
})
export class AdvancedSearchModalComponent {
  advancedSearchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
    private router: Router,
    public dialogRef: MatDialogRef<AdvancedSearchModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Formulario con los parámetros que mencionas
    this.advancedSearchForm = this.fb.group({
      fechaDiligenciamiento: [''],
      nombreEntidad: ['', Validators.maxLength(100)],
      nombre: ['', Validators.maxLength(100)],
      tipoEstrategiaIdentificacion: ['', Validators.maxLength(50)],
      tipoPractica: ['', Validators.maxLength(50)],
      codigoPractica: ['', Validators.maxLength(50)]
    });
  }

  formatDateToYYYYMMDD(date: Date | string): string {
    const d = new Date(date); // Asegurarse de que sea un objeto Date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Mes (0-11), +1 y rellenar con 0 si es necesario
    const day = String(d.getDate()).padStart(2, '0'); // Día rellenado con 0 si es necesario

    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
  }


  closeDialog(): void {
    this.dialogRef.close();
  }

  applySearch(): void {
    
    if (this.advancedSearchForm.valid) {

      // Envía los filtros al servicio compartido

      let fechaDiligenciamiento = this.advancedSearchForm.get('fechaDiligenciamiento')?.value;

      if (fechaDiligenciamiento) {
        fechaDiligenciamiento = this.formatDateToYYYYMMDD(fechaDiligenciamiento);
        this.advancedSearchForm.patchValue({ fechaDiligenciamiento });
      }

      if (this.advancedSearchForm.valid) {
        // Envía los filtros al servicio compartido
        this.filterService.updateFilters(this.advancedSearchForm.value);
        this.dialogRef.close();
      }

      this.filterService.updateFilters(this.advancedSearchForm.value);

      this.dialogRef.close();
    }

  }

  refresh(): void {
    this.advancedSearchForm.reset(); // Reinicia todos los campos del formulario
    this.filterService.updateFilters(null); // Limpia los filtros aplicados
  }
}