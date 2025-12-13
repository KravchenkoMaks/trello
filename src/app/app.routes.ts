import { Routes } from '@angular/router';
import { boardResolver } from '@resolvers/board-resolver';
import { boardsResolver } from '@resolvers/boards-resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home').then((c) => c.Home),
    title: 'Home',
    resolve: { boards: boardsResolver },
  },
  {
    path: 'board/:id',
    loadComponent: () => import('@pages/board/board').then((m) => m.Board),
    title: (route) => `Board ${route.params['id']}`,
    resolve: { board: boardResolver },
  },
];
