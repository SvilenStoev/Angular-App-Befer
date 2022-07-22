import { AuthGuard } from "./core/guards/auth.guard";
import { RouterModule, Routes } from "@angular/router";

import { HomePageComponent } from "./feature/pages/home-page/home-page.component";
import { NotFoundPageComponent } from "./feature/pages/not-found-page/not-found-page.component";
import { SpaceFightGameComponent } from "./feature/pages/space-fight-game/space-fight-game.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
    },
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: 'user',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'spacefight',
        canActivate: [AuthGuard],
        component: SpaceFightGameComponent
    },
    {
        path: '**',
        component: NotFoundPageComponent
    }
];

export const AppRoutingModule = RouterModule.forRoot(routes);