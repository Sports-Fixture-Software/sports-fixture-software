import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { FixtureListComponent } from './components/fixture_list.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent },
  { path: 'fixture/:id', component: FixtureListComponent },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
