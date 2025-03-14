import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})

export class QuestionnaireService{
    private data =[
        {id:1, comment:false, question:'¿La buena práctica está documentada de manera clara y concisa?',options:[{option:'Si'}, {option:'No'}]},
        {id:2, comment:false, question:'¿La descripción de la buena práctica está escrita en un lenguaje accesible para todos los públicos (sin tecnicismos innecesarios)?',options:[{option:'Si'},{option:'No'}]},
        {id:3, comment:false, question:'¿Las etapas o fases de implementación de la buena práctica son fáciles de seguir y entender?',options:[{option:'Si'},{option:'No'}]},
        {id:4, comment:false, question:'¿Se proporciona suficiente información visual (gráficos, diagramas, etc.) que facilite la comprensión de la práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:5, comment:true, question:'¿La implementación de la buena práctica requiere un conocimiento especializado para ser replicada?',options:[{option:'Si,requiere conocimientos especializados.'},{option:'No,puede ser replicada sin conocimientos especializados.'}]},
        {id:6, comment:false, question:'¿La buena práctica alcanzó los objetivos establecidos?',options:[{option:'Si'},{option:'No'}]},
    
        {id:7, comment:false, question:'¿La implementación de la buena práctica logró los resultados esperados en el tiempo estipulado?',options:[{option:'Si'},{option:'No'}]},
        {id:8, comment:false, question:'¿La práctica contribuyó directamente a mejorar los procesos gestionados por la entidad?',options:[{option:'Si'},{option:'No'}]},
        {id:9, comment:false, question:'¿Se cumplieron los indicadores de desempeño definidos para la buena práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:10, comment:true, question:'¿Los resultados obtenidos fueron medidos y validados según los criterios predefinidos?',options:[{option:'Si'},{option:'No'}]},
        {id:11, comment:false, question:'¿Los resultados generados por la buena práctica produjeron una mejora cuantificable en la eficiencia de los servicios públicos?',options:[{option:'Si'},{option:'No'}]},
        {id:12, comment:false, question:'¿Se logró una reducción de costos o mejoras en el uso de recursos con la implementación de la práctica?',options:[{option:'Si'},{option:'No'}]},

        {id:13, comment:false, question:'¿La práctica contribuyó a aumentar la calidad de los servicios públicos ofrecidos a los ciudadanos?',options:[{option:'Si'},{option:'No'}]},
        {id:14, comment:false, question:'¿Hubo un incremento en la satisfacción de los beneficiarios o usuarios del servicio debido a la buena práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:15, comment:true, question:'¿El impacto de la práctica fue evaluado a través de datos o mediciones cuantitativas?',options:[{option:'Si'},{option:'No'}]},
        {id:16, comment:false, question:'¿La buena práctica puede ser replicada en otras áreas o entidades con los recursos disponibles?',options:[{option:'Si'},{option:'No'}]},
        {id:17, comment:false, question:'¿Se identificaron obstáculos importantes durante la implementación de la práctica que fueron superados eficazmente?',options:[{option:'Si'},{option:'No'}]},
        {id:18, comment:false, question:'¿La práctica requiere de una capacitación específica para su replicación en otras entidades?',options:[{option:'Si'},{option:'No'}]},
  
        {id:19, comment:false, question:'¿Los recursos necesarios para replicar la práctica están fácilmente disponibles en otras entidades del sector público?',options:[{option:'Si'},{option:'No'}]},
        {id:20, comment:true, question:'¿La replicabilidad de la práctica ha sido considerada en su documentación y socialización?',options:[{option:'Si'},{option:'No'}]},
        {id:21, comment:false, question:'¿La buena práctica tiene la capacidad de mantenerse en el tiempo a pesar de posibles cambios administrativos o políticos?',options:[{option:'Si'},{option:'No'}]},
        {id:22, comment:false, question:'¿Existen recursos (financieros, humanos, técnicos) disponibles para asegurar la continuidad de la práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:23, comment:false, question:'¿La práctica se adapta a cambios en la normativa o políticas públicas sin perder efectividad?',options:[{option:'Si'},{option:'No'}]},
        {id:24, comment:false, question:'¿El personal encargado de implementar la práctica está comprometido con su sustentabilidad a largo plazo?',options:[{option:'Si'},{option:'No'}]},
 
        {id:25, comment:true, question:'¿La práctica ha demostrado ser flexible frente a cambios en el entorno institucional?',options:[{option:'Si'},{option:'No'}]},
        {id:26, comment:false, question:'¿Se establecieron alianzas internas dentro de la entidad para la implementación de la buena práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:27, comment:false, question:'¿La buena práctica promovió la colaboración con otras entidades o sectores externos?',options:[{option:'Si'},{option:'No'}]},
        {id:28, comment:false, question:'¿Las alianzas creadas facilitaron la implementación de la práctica de manera más eficiente?',options:[{option:'Si'},{option:'No'}]},
        {id:29, comment:false, question:'¿Las alianzas externas contribuyeron con recursos (financieros, técnicos, humanos) para la implementación de la práctica?',options:[{option:'Si'},{option:'No'}]},
        {id:30, comment:true, question:'¿La práctica resultó en una mayor cooperación entre diferentes niveles de gobierno (local, regional, nacional)?',options:[{option:'Si'},{option:'No'}]},
    ]
    
    private apiUrl =  `${GlobalConstants.API_BASE_URL}/api/v1/admin/record/list`;
    private apiUrlGet = `${GlobalConstants.API_BASE_URL}/api/v1/admin/form/11`;
    private apiUrlUpdate = `${GlobalConstants.API_BASE_URL}/api/v1/resume/uploadFile`;
    private apiUrlDelete = `${GlobalConstants.API_BASE_URL}/api/v1/updateIdentity`;
    private apiUrlTraceability = `${GlobalConstants.API_BASE_URL}/api/v1/traceability`;


    constructor(private http:HttpClient){}
    
    getQuestionsGroups(groupSize:number = 2) : Observable<any[]>{
        const result = [];
        for(let i = 0; i<this.data.length; i+= groupSize){
            result.push(this.data.slice(i, i + groupSize));
        }
        return of(result);
    }

    getQuestion():Observable<any>{
        const url = `${this.apiUrlGet}`
        return this.http.get<any>(url)
    }

    enviarCuestionario(formEntity:number, user:number,questionAnswer:any, questionEntity
        :any, identity:number, enabled:number, estimacion:string, comentario: string[]):Observable<any>{
        const url = `${this.apiUrl}`
        const params = {
            formEntity:formEntity,
            user:user,
            questionAnswer:questionAnswer,
            questionEntity:questionEntity,
            identity:identity,
            enabled: enabled,
            estimacion:estimacion,
            comentario:comentario
        }
        console.log(params)
        return this.http.post<any>(url, params)
    }

    sendTraceability(data: any): Observable<any> {
        const url = this.apiUrlTraceability; 
        return this.http.post(url, data);
    }
    
      
}