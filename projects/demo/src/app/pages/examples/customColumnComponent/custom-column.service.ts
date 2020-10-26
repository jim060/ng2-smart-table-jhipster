import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// 1927942
@Injectable({ providedIn: 'root' })
export class CustomColumnService {


  constructor(private http: HttpClient) {}

  getWorkflowByAgg(): Observable<HttpResponse<any>> {

    return this.http
      .get<string>('https://jsonplaceholder.typicode.com/todos/1', { observe: 'response' })
      .pipe(map((res: HttpResponse<any>) => res));
  }
}
