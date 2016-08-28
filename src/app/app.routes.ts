import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { TeamListComponent } from './components/team_list.component';
import { FixtureComponent } from './components/fixture.component';
import { FixtureListComponent } from './components/fixture_list.component';
import { LeagueComponent } from './components/league.component';
import { LeagueDetailsComponent } from './components/league_details.component';

export const routes: RouterConfig = [
  { path: '', redirectTo: 'league', pathMatch: 'full' },
  { path: 'league', component: LeagueListComponent },
  { 
    path: 'league/:id',
    component: LeagueComponent,
    children: [
      { path: '', redirectTo: 'details', pathMatch: 'full' },
      { path: 'details', component: LeagueDetailsComponent },
      { path: 'teams', component: TeamListComponent },
      { path: 'fixtures', component: FixtureListComponent }
    ]
  },
  {
    path: 'fixture/:id',
    component: FixtureComponent
  }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
