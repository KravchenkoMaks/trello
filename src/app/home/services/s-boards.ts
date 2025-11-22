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
  boardUrl = `${this.apiUrl}/board`;

  private get headers() {
    return { Authorization: 'Bearer 123' };
  }

  getBoards(): Observable<IBoard[]> {
    return this.httpClient
      .get<{ boards: IBoard[] }>(this.boardUrl, { headers: this.headers })
      .pipe(map((resp) => resp.boards));
  }

  getBoard(id: number): Observable<IBoard> {
    return this.httpClient.get<IBoard>(`${this.boardUrl}/${id}`, { headers: this.headers });
  }
}
