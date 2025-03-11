import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorIntlEs } from './mat-paginator-intl-es.service';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss'],
  standalone: true,
  imports: [
    MatTableModule, // Importa el módulo de tablas
    MatPaginatorModule, // Importa el módulo de paginadores
    MatButtonModule, // Importa el módulo de botones
    NgFor, NgIf,
    MatIconModule, // Importa directivas comunes
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs },
  ],
})
export class GenericTableComponent<T> implements OnInit, AfterViewInit {
  @Input() data: T[] = [];
  @Input() columns: { key: string; label: string }[] = [];
  @Input() buttons: { label?: string; icon?: string; color?: string; action: (row: T) => void }[] = [];

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<T>();
  expandedRow: T | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.data || changes.columns) {
      this.initializeTable();
    }
  }

  initializeTable(): void {
    if (this.data.length > 0 && this.columns.length > 0) {

      this.displayedColumns = [...this.columns.map((col) => col.key), 'actions'];
      this.dataSource.data = this.data;
    } else {
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  toggleMenu(row: T): void {
    // Alterna entre expandir y colapsar la mini pestaña de la fila
    this.expandedRow = this.expandedRow === row ? null : row;
  }

}
