import { Component, input } from '@angular/core';
import { Card } from '@components/card/card';
import { ICard } from '@interfaces/i-card';
import { Btn } from '@shared/btn/btn';

@Component({
  selector: 'tr-list',
  imports: [Card, Btn],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  title = input<string>();
  cards = input<ICard[]>();
}
