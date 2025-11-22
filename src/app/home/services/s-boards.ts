import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { IBoard } from '../interfaces/i-board';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SBoards {
  httpClient = inject(HttpClient);
  apiUrl = environment.baseURL;

  getBoards(): Observable<IBoard[]> {
    return this.httpClient
      .get<{ boards: IBoard[] }>(`${this.apiUrl}/board`, { headers: { Authorization: 'Bearer 123' } })
      .pipe(map((resp) => resp.boards));
  }
}
