import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LogService } from './catalog.service';
import { Router } from '@angular/router';


@Component({
    selector: 'catalog',
    standalone: true,
    templateUrl: './catalog.component.html',
    styleUrls: ['./catalog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatTableModule, MatPaginatorModule, MatIconModule],
})



export class CatalogComponent implements OnInit {
    displayedColumns: string[] = ['id', 'nombre', 'sesion', 'rol', 'estado'];
    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private logService: LogService, private router: Router) { }

    ngOnInit(): void {
        this.logService.getLogs().subscribe(
            (logs) => {
                this.dataSource.data = logs;
                this.dataSource.paginator = this.paginator;
            },
            (error) => {
                console.error('Error al cargar los datos:', error);
            }
        );
    }

    setPageSizeOptions(): number[] {
        return [3, 5, 10];
    }

    navegar(): void { this.router.navigate(['/follow']); }
}
