import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IBoard } from '../interfaces/i-board';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  createBoard(title: string): Observable<IBoard> {
    const color = this.getRandomColor();
    return this.httpClient.post<IBoard>(this.boardUrl, { title, custom: { color } }, { headers: this.headers });
  }

  updateBoard(id: number, updateData: Partial<IBoard>): Observable<void> {
    return this.httpClient.put<void>(`${this.boardUrl}/${id}`, updateData, { headers: this.headers });
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
