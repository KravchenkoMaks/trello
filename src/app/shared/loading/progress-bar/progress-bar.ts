import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'tr-progress-bar',
  imports: [MatProgressBarModule],
  templateUrl: './progress-bar.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {}
