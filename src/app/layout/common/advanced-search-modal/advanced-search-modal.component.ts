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
      ReactiveFormsModule
  ],
})
export class AdvancedSearchModalComponent {
  advancedSearchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private filterService: FilterService,
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  applySearch(): void {
    if (this.advancedSearchForm.valid) {
      // Envía los filtros al servicio compartido
      this.filterService.updateFilters(this.advancedSearchForm.value);
      this.dialogRef.close();
    }
  
  }
}