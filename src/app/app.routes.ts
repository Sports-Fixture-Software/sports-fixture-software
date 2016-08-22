import { provideRouter, RouterConfig } from '@angular/router';

// Import Pages
import { LeagueListComponent } from './components/league_list.component';
import { LeagueComponent } from './components/league.component';
import { LeagueDetailsComponent } from './components/league_details.component';

export const routes: RouterConfig = [
  { path: '', component: LeagueListComponent },
  { path: 'league', component: LeagueListComponent },
  { 
    path: 'league/:id',
    component: LeagueComponent,
    children: [
      { path: '', component: LeagueDetailsComponent }
    ]
   }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
