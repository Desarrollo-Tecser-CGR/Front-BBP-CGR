import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import registerUsersRoutes from '../auth/register-users/register-users.routes';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { Notification } from 'app/layout/common/notifications/notifications.types';

@Injectable({
    providedIn: 'root',
})
export class ResumenService {

    private apiUrl = `${GlobalConstants.API_BASE_URL}/api/v1/resume/save`;
    private uploadUrl = `${GlobalConstants.API_BASE_URL}/api/v1/resume/uploadFile`;
    private apiUrlGet = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getIdentity`;
    private apiUrlUpdate = `${GlobalConstants.API_BASE_URL}/api/v1/updateIdentity`;
    private apiUrlSetValidateStatus = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity`;
    private apiUrlgetdates = `${GlobalConstants.API_BASE_URL}/api/v1/resume/getAllTypes`;
    private apiUrlEntities = `${GlobalConstants.API_BASE_URL}/api/v1/entityCgr/getAllEntities`;

    // Propiedades para almacenar datos compartidos
    private typesData: { [key: string]: any[] } = {}; 
    public typeStrategyIdentifications: any[] = [];
    public isDataLoaded: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient,
    ) {}

    columns = [
        { key: 'id', header: 'Id de la practica' },
        { key: 'fechaDiligenciamiento', header: 'Fecha de Diligenciamiento' },
        { key: 'entityCgr', header: 'Entidad' },
        { key: 'nombreDependenciaArea', header: 'Dependencia' },
        { key: 'nombre', header: 'Nombre' },
        { key: 'cargo', header: 'Cargo' },
        { key: 'correo', header: 'Correo' },
        { key: 'contacto', header: 'Contacto' },
        { key: 'typeStrategyIdentification', header: 'Tipo de Estrategia' },
        { key: 'typePractice', header: 'Tipo de Práctica' },
        { key: 'codigoPractica', header: 'Código de la Práctica' },
        { key: 'typology', header: 'Tipología' },
        { key: 'estadoFlujo', header: 'Estado de Flujo' },
        { key: 'nombreDescriptivoBuenaPractica', header: 'Descripción BP' },
        { key: 'propositoPractica', header: 'Propósito de la Práctica' },
        { key: 'expectedImpact', header: 'Impacto Esperado' },
        { key: 'metodologiaUsada', header: 'Metodología Usada' },
        { key: 'durationImplementation', header: 'Duración de la Implementación' },
        { key: 'stagesMethodology', header: 'Etapas de la Metodología' },
        { key: 'periodoDesarrolloInicio', header: 'Inicio del Desarrollo' },
        { key: 'periodoDesarrolloFin', header: 'Fin del Desarrollo' },
        { key: 'typeMaterialProduced', header: 'Tipo de Material Producido' },
        { key: 'supportReceived', header: 'Apoyo Recibido' },
        { key: 'recognitionsNationalInternational', header: 'Reconocimientos Nacionales o Internacionales' },
        { key: 'controlObject', header: 'Objeto de Control' },
        { key: 'taxonomyEvent', header: 'Taxonomía del Evento' },
        { key: 'typePerformance', header: 'Tipo de Actuación' },
        { key: 'documentoActuacion', header: 'Documento de Actuación' },
        { key: 'descripcionResultados', header: 'Descripción de los Resultados' },
        { key: 'levelGoodPractice', header: 'Nivel de la Buena Práctica' },
        { key: 'objectiveMainPractice', header: 'Objetivo Principal de la Práctica' }
    ];
    
    
    getColumns(){
        return this.columns;
    }
    sendFormDataAsJson(formData: any, sAMAccountName: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const apiUrlWithAccountName = `${this.apiUrl}/${sAMAccountName}`; 
        return this.http.post(apiUrlWithAccountName, formData, { headers }).pipe(
            map((response: any) => {

                const id = response.data.id;
                return response;
            }),
            catchError((e) => {
                console.error('Error al obtener los datos:', e);
                return throwError(e);
            }),
        );
    }
    uploadFile(identityId: number, fileData: FormData): Observable<any> {
        return this.http.post(this.uploadUrl+`?identityId=${identityId}` , fileData);
    }

    getDataAsJson(id: string): Observable<any> {
        return this.http.get<any>(this.apiUrlGet + '/' + id);
    }

    updateDataAsJson(id: number, formData: any): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity/${id}`;
        console.log('ID a actualizar:', id);
        console.log('Datos a enviar:', formData);
        return this.http.patch(url, formData, { headers, responseType: 'text' as 'json' }); // Cambiar responseType a 'text'
    }
    

    updateStateWithPatch(id: number, updatedData: any): Observable<any> {
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/resume/updateIdentity/${id}`;
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.http.patch(url, updatedData, { headers });
    }
    
    fetchAllTypes(): Observable<any> {
        return new Observable((observer) => {
            this.http.get<any>(this.apiUrlgetdates).subscribe(
                (response) => {
                    if (response && response.data) {
                        this.typesData = response.data; 
                        this.isDataLoaded.next(true); 
                    } else {
                    }
                    observer.next(response);
                    observer.complete();
                },
                (error) => {
                    observer.error(error);
                }
            );
        });
    }

    getTypeByKey(key: string): any[] {
        return this.typesData[key] || [];
    }

    fetchEntities(query: string): Observable<any> {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const params = query ? { search: query } : {};
        return this.http.get<any>(this.apiUrlEntities, { headers, params });
    }

    getTraceabilityData(id: number, idState: number): Observable<any> {
        const url = `${GlobalConstants.API_BASE_URL}/api/v1/traceability/${id}/4`;  // URL quemada temporalmente
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Asegúrate de tener este token guardado
            'Content-Type': 'application/json'
        });
    
        return this.http.get<any>(url, { headers }).pipe(
            map(response => {
                console.log(' Respuesta del endpoint /traceability:', response);
                return response;
            }),
            catchError(error => {
                console.error(' Error al obtener trazabilidad:', error);
                return throwError(error);
            })
        );
    }    
}
