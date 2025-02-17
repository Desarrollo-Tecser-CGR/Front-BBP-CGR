import { ResumenService } from './../../../modules/resumen/resumen.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';
@Injectable({
    providedIn: 'root'
})
export class AuditService{
    id: string | null = null;
    private urlMocks = '/api/common/audits';
    private urlGroups = `${GlobalConstants.API_BASE_URL}/api/v1/audit/groups/getGroupAndUsers`;
    private urlAudit = `${GlobalConstants.API_BASE_URL}/api/v1/audit`;
    constructor(private http: HttpClient, private resumenServices: ResumenService) { }

    indicators = [
        {color:'', indicator:''}
    ]
    private columns = [
        { key: 'id', header: 'ID'},
        { key: 'auditCode', header: 'Código de Auditoría' },
        { key: 'startDate', header: 'Fecha Inicio' },
        { key: 'endDate', header: 'Fecha Fin' },
        { key: 'groupName', header: 'Grupo'},
        { Key: 'state', header:'Estado'},
        { key: 'identityId', header:'Id Practica'}
    ]
    private periodicity = {
        "totalDays": 5,
        "range": {
          "startDate": "2023-10-01",
          "endDate": "2023-10-05"
        },
        "days": [
          "2023-10-01",
          "2023-10-02",
          "2023-10-03",
          "2023-10-04",
          "2023-10-05"
        ]
      }

    private formatDate(dateString:string) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0'); 
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const dateResponse = `${day}/${month}/${year}`;
        return dateResponse;

    }
    // servicios en el mock 

    getColumns(){
        return this.columns;
    }
    getPerodicityDays(){
        const days = this.periodicity.days.map((day)=>{
            return this.formatDate(day);
        });
        return days;
    }

    // getAudits():Observable<any[]>{
    //     const response = this.http.get<any[]>(this.urlMocks);
    //     console.log('Audits en el servicio:', response);
    //     return response;
    // }
    // addAudit(audit:any):Observable<any>{
    //     return this.http.post<any>(this.urlMocks, audit);
    // }

    // getAuditFiles(idAuditoria:number):Observable<any[]>{
    //     return this.http.get<any[]>(`${this.urlMocks}'/Files?id='${idAuditoria}`)
    // }

    // getAuditsByGroup(groupName:string):Observable<any[]>{
    //     return this.http.get<any[]>(`${this.urlMocks}'/Group?groupName='${groupName}`)

    // }
    
    //servicios con api en el back

    getAllGroups():Observable<any>{
        return this.http.get<any>(this.urlGroups);
    }

    postAudit(audit:any):Observable<any>{
        return this.http.post<any>(this.urlAudit, audit);
    }
    getAudits():Observable<any>{
        return this.http.get<any>(this.urlAudit);
    }
    getAuditsByResume(identityI:number):Observable<any>{
        return this.http.get<any>(this.urlAudit + identityI);
    }
    getAuditGroups(groupName:string){
        return this.http.get<any>(`${this.urlAudit}/getByGroup/${groupName}`);
    }
    getPeriocityByAudit(idAudit:number){
        return 
    }
    onSendForm(){
    }
}