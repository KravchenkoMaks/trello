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
export class BoardService {
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

  deleteBoard(id: number): Observable<IResponse> {
    return this.httpClient.delete<IResponse>(`${this.apiUrl}/board/${id}`, { headers: this.headers });
  }

  updateBoard(id: number, updateData: Partial<IBoard>): Observable<IResponse> {
    return this.httpClient.put<IResponse>(`${this.apiUrl}/board/${id}`, updateData, { headers: this.headers });
  }
}
