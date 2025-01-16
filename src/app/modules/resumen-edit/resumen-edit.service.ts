import { initialDataResolver } from './../../app.resolvers';
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
    private downloadUrl =  `${CONFIG.apiHost}/api/v1/hojadevida/file/`;

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

    public downloadFile(id : number):void{
      console.log('Descargando archivo con ID:', id); 
      this.http.get(this.downloadUrl + id , {responseType: 'blob', observe: 'response'}).subscribe({
      next: (response) =>{
        const constentDisposition = response.headers.get('Content-Disposition');
        let fileName = `archivo_${id}`;

        if(constentDisposition){
          const matches = /filename="([^"]+)"/.exec(constentDisposition);
          if(matches && matches[1]){
            fileName = matches[1]
          }
        }

        const url = window.URL.createObjectURL(response.body);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        //forzar descarga en el navegador
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        Swal.fire({
          title: 'Archivo descargado',
          text: 'Archivo descargado exitosamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
      });
      },
      error:(err)=>{
        Swal.fire({
            title: 'Error al descargar el archivo',
            text: 'No se pudo descargar el archivo. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
        });
        console.error("Error al descargar el archivo", err)

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