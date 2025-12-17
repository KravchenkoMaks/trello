import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { List } from '@components/list/list';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Btn } from '@shared/btn/btn';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { Loader } from '@shared/loader/loader';
import { BoardStore } from '@stores/board-store';
import { TextChangingForm } from '@shared/forms/text-changing-form/text-changing-form';

@Component({
  selector: 'tr-board',
  imports: [List, RouterLink, Btn, Loader, TextChangingForm],
  templateUrl: './board.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Board {
  private route = inject(ActivatedRoute);
  store = inject(BoardStore);

  constructor() {
    combineLatest([this.route.paramMap, this.route.data])
      .pipe(takeUntilDestroyed())
      .subscribe(([params, { board }]) => {
        const id = Number(params.get('id'));
        this.store.setCurrentBoard({ ...board, id });
      });
  }

  updateTitle(newTitle: string): void {
    console.log('from board: updateTitle');
  }
}
