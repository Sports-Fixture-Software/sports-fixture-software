import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { TeamListComponent } from './components/team_list.component';
import { LeagueComponent } from './components/league.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent },
  { path: 'league', component: LeagueListComponent },
  { 
    path: 'league/:id',
    component: LeagueComponent,
    children: [
      { path: '', component: LeagueListComponent },
      { path: 'team', component: TeamListComponent }
    ]
   }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
