import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private snackBar = inject(MatSnackBar);

  showSuccess(message: string, config?: Partial<MatSnackBarConfig>) {
    this.snackBar.open(message, 'Close', {
      duration: 2000,
      panelClass: ['snack-bar-success'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      ...config,
    });
  }

  showError(message: string, config?: Partial<MatSnackBarConfig>) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['snack-bar-error'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      ...config,
    });
  }
}
