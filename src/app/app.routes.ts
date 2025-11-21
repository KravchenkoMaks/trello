import { Routes } from '@angular/router';
import { Layout } from './home/components/layout/layout';
import { Home } from './home/components/home/home';
import { boardResolver } from './home/resolvers/board-resolver';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Home,
        title: 'trello home',
      },
      {
        path: 'board/:id',
        loadComponent: () => import('./home/components/board/board').then((m) => m.Board),
        title: (route) => `trello board ${route.params['id']}`,
        resolve: { board: boardResolver },
      },
    ],
  },
];
