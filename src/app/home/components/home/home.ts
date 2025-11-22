import { Component, inject } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  route = inject(ActivatedRoute);
  boards: IBoard[] = [];
  title = 'Мої дошки';

  constructor() {
    this.route.data.pipe(takeUntilDestroyed()).subscribe(({ boards }) => {
      console.log(boards);
      this.boards = boards;
    });
  }

  getColorForBoard(board: IBoard): string {
    const key = `board-color-${board.id}`;
    const savedColor = localStorage.getItem(key);

    if (savedColor) {
      return savedColor;
    }

    const newColor = this.getRandomColor();
    localStorage.setItem(key, newColor);
    return newColor;
  }

  getRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 70 + Math.random() * 20;
    const lightness = 45 + Math.random() * 15;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
}
