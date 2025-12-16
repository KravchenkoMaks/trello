import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Card {
  title = input<string>();
}
