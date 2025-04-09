import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = '/api/person';

  constructor(private http: HttpClient) { }

  getPersons(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPerson(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createPerson(person: any): Observable<any> {
    return this.http.post(this.apiUrl, person);
  }

  updatePerson(person: any): Observable<any> {
    return this.http.put(this.apiUrl, person);
  }

  deletePerson(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
