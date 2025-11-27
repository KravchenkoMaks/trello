import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBoard } from '../interfaces/i-board';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IResponse } from '../interfaces/i-response';
import { ICreateListDto } from '../interfaces/i-create-list-dto';
import { ICard } from '../interfaces/i-card';

@Injectable({
  providedIn: 'root',
})
export class SBoards {
  httpClient = inject(HttpClient);
  apiUrl = environment.baseURL;
  boardUrl = `${this.apiUrl}/board`;
  private headers = { Authorization: 'Bearer 123' };
  private usedHues: number[] = [];

  getBoards(): Observable<IBoard[]> {
    return this.httpClient
      .get<{ boards: IBoard[] }>(this.boardUrl, { headers: this.headers })
      .pipe(map((resp) => resp.boards));
  }

  getBoard(id: number): Observable<IBoard> {
    return this.httpClient.get<IBoard>(`${this.boardUrl}/${id}`, { headers: this.headers });
  }

  createBoard(title: string): Observable<IResponse> {
    const color = this.getRandomColor();
    return this.httpClient.post<IResponse>(this.boardUrl, { title, custom: { color } }, { headers: this.headers });
  }

  updateBoard(id: number, updateData: Partial<IBoard>): Observable<IResponse> {
    return this.httpClient.put<IResponse>(`${this.boardUrl}/${id}`, updateData, { headers: this.headers });
  }

  createList(id: number, dto: ICreateListDto): Observable<IResponse> {
    return this.httpClient.post<IResponse>(`${this.boardUrl}/${id}/list`, dto, { headers: this.headers });
  }

  createCard(id: number, dto: ICard): Observable<IResponse> {
    return this.httpClient.post<IResponse>(`${this.boardUrl}/${id}/card`, dto, { headers: this.headers });
  }

  private getRandomColor(): string {
    let hue: number;
    let attempts = 0;

    do {
      hue = Math.floor(Math.random() * 360);
      attempts++;
    } while (this.usedHues.some((h) => Math.abs(h - hue) < 30) && attempts < 20);

    this.usedHues.push(hue);
    if (this.usedHues.length > 10) this.usedHues.shift();
    const saturation = Math.floor(65 + Math.random() * 30);
    const lightness = Math.floor(40 + Math.random() * 30);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
