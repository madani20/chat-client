import { Routes } from '@angular/router';
import { ConnectComponent } from './features/auth/components/connect/connect.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

    {
        path: 'connect',
        component: ConnectComponent
    },
    {
        path: '', redirectTo: 'connect', pathMatch: 'full',
    },
    {
        path: 'chat',
        loadChildren: () => import('./features/routes/chat-routing').then(m => m.chatRoutes), 
        canActivate: [authGuard] //canActivate: [() => import('./core/guards/auth.guard').then(m => m.authGuard)]
    }

    // {
    //     path: '',
    //     redirectTo: 'main',
    //     pathMatch: 'full'
    // },
    // {
    //     path: 'main',
    //     component: MainLayoutComponent
    // },
    // {
    //     path: '**',
    //     component: NotFoundComponent
    // }
]
