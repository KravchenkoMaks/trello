import { Routes } from '@angular/router';
import { Layout } from './home/components/layout/layout';
import { Home } from './home/components/home/home';
import { boardResolver } from './home/resolvers/board-resolver';
import { boardsResolver } from './home/resolvers/boards-resolver';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        component: Home, // This includes the Home component and all inside to the initial chunk
        title: 'trello home',
        resolve: { boards: boardsResolver },
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
