import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionnaireResponseDTO } from '../@interface/response.models';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  private readonly API_URL = 'http://localhost:8585/api';

  constructor(private http: HttpClient) {}

  submitResponse(questionnaireId: number, response: QuestionnaireResponseDTO): Observable<void> {
    return this.http.post<void>(
      `${this.API_URL}/responses/questionnaires/${questionnaireId}`, 
      response
    );
  }
}
