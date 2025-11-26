import { Component, input } from '@angular/core';
import { ICard } from '../../interfaces/i-card';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  card = input<ICard>();
}
