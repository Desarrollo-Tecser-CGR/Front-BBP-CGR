import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';

@Injectable({
    providedIn: 'root'
})
export class AuditService{
    private urlGroups = `${GlobalConstants.API_BASE_URL}/api/v1/audit/groups/getGroupAndUsers`;
    private urlAudit = `${GlobalConstants.API_BASE_URL}/api/v1/audit/getIdentity/`;
    constructor(private http: HttpClient) { }

    groups = [
        {id:1, name:'CDS',users:[{name:'user1', email:'user1@email.com'},{name:'user1', email:'user1@email.com'},{name:'user1', email:'user1@email.com'},{name:'user1', email:'user1@email.com'}]},
        {id:2, name:'DVF',users:[{name:'user2',email:'user1@email.com'},{name:'user2',email:'user1@email.com'},{name:'user2',email:'user1@email.com'},{name:'user2',email:'user1@email.com'}]},
        {id:3, name:'DES',users:[{name:'user3',email:'user1@email.com'},{name:'user3',email:'user1@email.com'},{name:'user3',email:'user1@email.com'},{name:'user3',email:'user1@email.com'}]},
        {id:4, name:'DIARI',users:[{name:'user4'},{name:'user4'},{name:'user4'},{name:'user4'}]},
        {id:5, name:'PNVCF',users:[{name:'user5'},{name:'user5'},{name:'user5'},{name:'user5'}]}
    ]
    indicators = [
        {color:'', indicator:''}
    ]

    // getGroups():Observable<any>{
    //     return this.http.get(this.url)
    // }
    getAllGroups():Observable<any>{
        return this.http.get<any>(this.urlGroups);
    }

    getAuditsByResume(identityI:number):Observable<any>{
        return this.http.get<any>(this.urlAudit + identityI);
    }
}