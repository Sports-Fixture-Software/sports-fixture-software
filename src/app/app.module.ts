import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

import { PopoverModule } from "ng2-popover";
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { LeagueListComponent } from './components/league_list.component';
import { TeamListComponent } from './components/team_list.component';
import { FixtureComponent } from './components/fixture.component';
import { FixtureListComponent } from './components/fixture_list.component';
import { FixtureDetailsComponent } from './components/fixture_details.component';
import { LeagueComponent } from './components/league.component';
import { LeagueDetailsComponent } from './components/league_details.component';
import { RoundListComponent } from './components/round_list.component';
import { GenerateComponent } from './components/generate.component';
import { ReviewComponent } from './components/review.component';
import { TeamDetailsComponent } from './components/team_details.component';


import { Navbar } from './components/navbar.component';
import { ButtonPopover } from './components/button_popover.component';
import { ButtonHidden } from './components/button_hidden.component';
import { InputPopover } from './components/input_popover.component';
import { FixtureListItem } from './components/fixture_list_item.component';
import { LeagueListItem } from './components/league_list_item.component';
import { TeamListItem } from './components/team_list_item.component';


const routes: Routes = [
    { path: '', redirectTo: 'league', pathMatch: 'full' },
    { path: 'league', component: LeagueListComponent },
    {
        path: 'league/:id',
        component: LeagueComponent,
        children: [
            { path: '', redirectTo: 'details', pathMatch: 'full' },
            { path: 'details', component: LeagueDetailsComponent },
            {
                path: 'teams', children: [
                    { path: '', component: TeamListComponent },
                    { path: ':team_id', component: TeamDetailsComponent },
                ]
            },
            { path: 'fixtures', component: FixtureListComponent }
        ]
    },
    {
        path: 'fixture/:id',
        component: FixtureComponent,
        children: [
            { path: '', redirectTo: 'details', pathMatch: 'full' },
            { path: 'details', component: FixtureDetailsComponent },
            { path: 'rounds', component: RoundListComponent },
            { path: 'generate', component: GenerateComponent },
            { path: 'review', component: ReviewComponent }
        ]
    }
]

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes, { useHash: true }),
        PopoverModule,
        Ng2Bs3ModalModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        LeagueListComponent,
        TeamListComponent,
        FixtureComponent,
        FixtureListComponent,
        FixtureDetailsComponent,
        LeagueComponent,
        LeagueDetailsComponent,
        RoundListComponent,
        GenerateComponent,
        ReviewComponent,
        TeamDetailsComponent,
        Navbar,
        ButtonPopover,
        ButtonHidden,
        InputPopover,
        FixtureListItem,
        LeagueListItem,
        TeamListItem
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };
