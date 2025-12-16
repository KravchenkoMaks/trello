import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Card } from '@components/card/card';
import { ICard } from '@models/interfaces/i-card';
import { Btn } from '@shared/btn/btn';

@Component({
  selector: 'tr-list',
  imports: [Card, Btn],
  templateUrl: './list.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List {
  title = input<string>();
  cards = input<ICard[]>();
}
