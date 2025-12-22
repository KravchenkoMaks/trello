import { Routes } from '@angular/router';
import { boardResolver, boardsResolver } from '@resolvers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages').then((c) => c.Home),
    title: 'Home',
    resolve: { boards: boardsResolver },
  },
  {
    path: 'board/:id',
    loadComponent: () => import('@pages').then((c) => c.Board),
    title: (route) => `Board ${route.params['id']}`,
    resolve: { board: boardResolver },
  },
];
