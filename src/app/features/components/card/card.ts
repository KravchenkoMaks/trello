import { Component, input } from '@angular/core';

@Component({
  selector: 'tr-card',
  imports: [],
  templateUrl: './card.html',
  styles: ``,
})
export class Card {
  title = input<string>();
}
