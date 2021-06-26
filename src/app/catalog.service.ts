import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './book';
import {environment} from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CatalogService {

    private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
  }

  public getCatalog(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiServerUrl}/catalog`);
  }
}
