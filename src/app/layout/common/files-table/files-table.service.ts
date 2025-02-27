import { initialDataResolver } from 'app/app.resolvers';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FilesTableServices{
    private urlAudit = `${GlobalConstants.API_BASE_URL}/api/v1/audit`;
    constructor(private http: HttpClient) { }
    
    private data:any[]=[
        {id:1, name:'Historia de usuario 005.pdf', idAudit:1},
        {id:2, name:'Historia de usuario 006.pdf', idAudit:1},
        {id:3, name:'Historia de usuario 007.pdf', idAudit:1},
        {id:4, name:'Historia de usuario 008.pdf', idAudit:2},
        {id:5, name:'Historia de usuario 009.pdf', idAudit:2},
        {id:7, name:'Historia de usuario 010.pdf', idAudit:3},
    ]
    private columns: any[]=[
        {key:'id', label:'Id'},
        {key:'name', label:'File name'}
    ];
    getColumns(){
        return this.columns;    
    }
    // getData(){
    //     return this.data;
    // }
    getFilesByAudit(idAudit:number):Observable<any>{
        console.log('Auditoria sv:', idAudit);
        return this.http.get<any>(`${this.urlAudit}/${idAudit}/files/getAll`);
    }
}