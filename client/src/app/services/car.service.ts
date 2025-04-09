import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = '/api/car';

  constructor(private http: HttpClient) { }

  getCars(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCar(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  createCar(car: any): Observable<any> {
    return this.http.post(this.apiUrl, car);
  }

  updateCar(car: any): Observable<any> {
    return this.http.put(this.apiUrl, car);
  }

  deleteCar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
