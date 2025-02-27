import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CatalogService } from './catalog.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface Usuario {
  id: number;
  name: string;
  email: string;
  cargo: string;
  estado: string;
}

@Component({
  selector: 'catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class CatalogComponent implements OnInit {
  columns: string[] = ['id', 'name', 'email', 'cargo', 'estado'];
  dataSource!: MatTableDataSource<Usuario>;
  
  constructor(private catalogService: CatalogService) {}

  ngOnInit() {
    this.catalogService.getUsuarios().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  filter(event: Event) {
    const filter = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filter.trim().toLowerCase();
  }
  
}
