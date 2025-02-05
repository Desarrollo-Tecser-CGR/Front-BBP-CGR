import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { LogService } from './follow.service';
import { Router } from '@angular/router';


@Component({
    selector: 'follow',
    standalone: true,
    templateUrl: './follow.component.html',
    styleUrls: ['./follow.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [MatTableModule, MatPaginatorModule, MatIconModule],
})



export class FollowComponent implements OnInit {
    displayedColumns: string[] = ['nombre', 'sesion', 'rol', 'estado'];
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
            }
        );
    }

    setPageSizeOptions(): number[] {
        return [3, 5, 10];
    }

    navegar(): void { this.router.navigate(['/assignRole']); }
}
