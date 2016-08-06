import { provideRouter, RouterConfig } from '@angular/router';

import { Page1Component } from './page1.component';
import { Page2Component } from './page2.component';

export const routes: RouterConfig = [
  { path: '', component: Page1Component },  
  { path: 'page1', component: Page1Component },
  { path: 'page2', component: Page2Component }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];