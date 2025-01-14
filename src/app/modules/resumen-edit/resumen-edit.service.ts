import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CONFIG } from 'app/config/config';
import Swal from 'sweetalert2';
import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class DataServices{

    private url =  `${CONFIG.apiHost}/api/v1/hojadevida/getIdentity/`;

    constructor(private http: HttpClient){}

    public getFileByIdResumen(getIdentity:number) : Observable<any[]>{
      return this.http.get(this.url + getIdentity).pipe(
        map((response:any)=>{
          console.log('Data:', response);
          const files :any[] = response.files;
          console.log('Files:', files);
          return files;
        }),
        catchError((e)=>{
          console.error('Error al obtener los archivos:', e);
          return throwError(e);
        })
      )
    }

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
            title: 'Error al descargar el archivo',
            text: 'No se pudo descargar el archivo. Intenta nuevamente.',
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
    private columns: any[]=[
        {key:'id', label:'Id'},
        {key:'path', label:'Path'},
        {key:'name', label:'File name'}
    ];
    
    
      public getColumns(){
        return this.columns;
      }
}