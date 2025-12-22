import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ICard } from '@interfaces';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  card = input.required<ICard>();
}
