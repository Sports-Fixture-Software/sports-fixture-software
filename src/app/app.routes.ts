import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
