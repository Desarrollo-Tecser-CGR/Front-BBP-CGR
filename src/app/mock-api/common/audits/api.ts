import { Injectable } from "@angular/core";
import { FuseMockApiService, FuseMockApiUtils } from "@fuse/lib/mock-api";
import { audits, files } from "./data";

@Injectable({providedIn:'root'})
export class AuditsMockApi{
    private _audits = [...audits];
    private _files = [...files];

    constructor(private mockApiService: FuseMockApiService) {
        this.registerHandlers();
      }
    
    registerHandlers():void{
        //Todos los registros
        this.mockApiService
        .onGet('/api/common/audits')
        .reply(()=> 
            [200, this._audits]);
        
        //Agregar un nuevo registro
        this.mockApiService
        .onPost('/api/common/audits')
        .reply(({request})=>{
            const newAudit = {id: FuseMockApiUtils.guid(), ...request.body};
            this._audits.push(newAudit);
            return [201, newAudit];
        });
        //Traer todos los archivos relacionados a una auditoria
        this.mockApiService
        .onGet('/api/common/auditsFiles')
        .reply(({request})=> {
            const idAuditoria = request.params.get('id');
            const filteredFiles = this._files.filter(file => file.idAuditoria === Number(idAuditoria));
            return [200, filteredFiles];
        })
        //Traer todas las auditorias por grupo
        this.mockApiService
        .onGet('/api/common/auditsGroup')
        .reply(({request})=>{
            const groupName = request.params.get('groupName');
            const filteredGroup = this._audits.filter(audit => audit.groupName === groupName);
            return [200, filteredGroup];
        })

    }
}