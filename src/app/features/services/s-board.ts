import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environment/environment';
import { IBoard } from '@models/interfaces/i-board';
import { INewBoard } from '@models/interfaces/i-new-board';
import { IResponse } from '@models/interfaces/i-response';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SBoards {
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

  createBoard(newBoard: INewBoard): Observable<IResponse> {
    return this.httpClient.post<IResponse>(`${this.apiUrl}/board`, newBoard, { headers: this.headers });
  }

  deleteBoard(boardId: number): Observable<IResponse>{
    return this.httpClient.delete<IResponse>(`${this.apiUrl}/board/${boardId}`, { headers: this.headers });
  }
}
