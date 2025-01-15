import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';


@Injectable({
    providedIn: 'root',
})
export class DataServices{

    private url =  `${GlobalConstants.API_BASE_URL}/api/v1/hojadevida/guardar`;

    constructor(private http: HttpClient){}

    public downloadFile(filename : string):void{
     this.http.get(this.url, {responseType:'blob'}).subscribe({
      next: (blob) =>{
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(objectUrl);
      },
      error:(err)=>{
        Swal.fire({
            title: 'Error al crear el usuario',
            text: 'No se pudo registrar el usuario. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        console.error("Error al descargar el archivo")

      }
     })
    };

    public viewFile(url:string):void{
      this.http.get(url,{responseType:'blob'}).subscribe((fileBlob)=>{
        const fileURL = URL.createObjectURL(fileBlob);
        window.open(fileURL);
      })
    }
    private data: any[] = [
        { id: '1', name: 'file1' },
        { id: '2', name: 'file2' },
        { id: '3', name: 'file3' },
        { id: '4', name: 'file4' },
        { id: '5', name: 'file5' },
      ];

    private columns: any[]=[
        {key:'id', label:'Id'},
        {key:'name', label:'File name'}
    ];
    
    
      public getDataFiles(){
        return this.data;
      }
      public getColumns(){
        return this.columns;
      }
}