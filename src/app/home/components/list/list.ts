import { Component, input } from '@angular/core';
import { ICard } from '../../interfaces/i-card';
import { Card } from '../card/card';

@Component({
  selector: 'tr-list',
  imports: [Card],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  title = input<string>();
  cards = input<ICard[]>();
}
