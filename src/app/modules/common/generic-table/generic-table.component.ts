import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';

@Component({
    selector: 'app-generic-table',
    templateUrl: './generic-table.component.html',
    styleUrls: ['./generic-table.component.scss'],
    standalone: true,
    imports: [
        MatTableModule, // Importa el módulo de tablas
        MatPaginatorModule, // Importa el módulo de paginadores
        MatButtonModule, // Importa el módulo de botones
        NgFor, NgIf, // Importa directivas comunes
    ],
})
export class GenericTableComponent<T> implements OnInit, AfterViewInit {
    @Input() data: T[] = [];
    @Input() columns: { key: string; label: string }[] = [];
    @Input() buttons: { label: string; color?: string; action: (row: T) => void }[] = [];

    displayedColumns: string[] = [];
    dataSource = new MatTableDataSource<T>();

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
        this.initializeTable();
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('ngOnChanges - data:', changes.data?.currentValue);
        console.log('ngOnChanges - columns:', changes.columns?.currentValue);

        if (changes.data || changes.columns) {
            this.initializeTable();
        }
    }

    initializeTable(): void {
        if (this.data.length > 0 && this.columns.length > 0) {
            console.log('Initializing table with data:', this.data);
            console.log('Initializing table with columns:', this.columns);

            this.displayedColumns = [...this.columns.map((col) => col.key), 'actions'];
            this.dataSource.data = this.data;
        } else {
            console.warn('No data or columns provided to the table');
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }
}
