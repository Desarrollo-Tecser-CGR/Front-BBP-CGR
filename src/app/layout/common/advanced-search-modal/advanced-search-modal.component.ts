import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-advanced-search-modal',
  templateUrl: './advanced-search-modal.component.html',
  styleUrls: ['./advanced-search-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
  ],
})
export class AdvancedSearchModalComponent {
  advancedSearchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
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
      this.dialogRef.close(this.advancedSearchForm.value);
    }
  }
}
