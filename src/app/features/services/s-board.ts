import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { IBoard } from '@interfaces/i-board';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SBoard {
  httpClient = inject(HttpClient);
  apiUrl = environment.baseURL;
  private headers = { Authorization: 'Bearer 123' };
  private usedHues: number[] = [];

  getBoards(): Observable<IBoard[]> {
    return this.httpClient
      .get<{ boards: IBoard[] }>(`${this.apiUrl}/board`, { headers: this.headers })
      .pipe(map((resp) => resp.boards));
  }

  getBoard(id: number): Observable<IBoard> {
    return this.httpClient.get<IBoard>(`${this.apiUrl}/board/${id}`, { headers: this.headers });
  }
}
