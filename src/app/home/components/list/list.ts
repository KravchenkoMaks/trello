import { Component, input } from '@angular/core';
import { ICard } from '../../interfaces/i-card';

@Component({
  selector: 'tr-list',
  imports: [],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  title = input<string>();
  cards = input<ICard[]>();
}
