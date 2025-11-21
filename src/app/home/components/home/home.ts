import { Component } from '@angular/core';
import { IBoard } from '../../interfaces/i-board';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'tr-home',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  title = 'Мої дошки';

  boards: IBoard[] = [
    { id: 1, title: 'покупки' },
    { id: 2, title: 'підготовка до весілля' },
    { id: 3, title: 'розробка интернет-магазину' },
    { id: 4, title: 'курс з просування в соціальних мережах' },
  ];

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
