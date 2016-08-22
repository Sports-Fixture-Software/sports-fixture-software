import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { LeagueComponent } from './components/league.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent },
  { path: 'league', component: LeagueListComponent },
  { path: 'league/:id', component: LeagueComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
