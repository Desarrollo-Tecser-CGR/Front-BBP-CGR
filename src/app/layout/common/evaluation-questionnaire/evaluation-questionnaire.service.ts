import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from 'app/core/constants/GlobalConstants';
import Swal from 'sweetalert2';
import { catchError, map, Observable, throwError } from 'rxjs';


@Injectable({
    providedIn: 'root',
})

export class Questionnaire{
    constructor(){}
    public getData(){

    }
}