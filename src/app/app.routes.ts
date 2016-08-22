import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { LeagueDetailsComponent } from './components/league_details.component';
import { FixtureListComponent } from './components/fixture_list.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent },
  {
    path: 'league/:id', component: LeagueDetailsComponent,
    children: [
      { path: '', redirectTo: 'fixture' },
      { path: 'fixture', component: FixtureListComponent }
    ]
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
