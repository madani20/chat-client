import { Routes } from "@angular/router";
import { MainLayoutComponent } from "../../shared/components/main-layout/main-layout.component";

export const chatRoutes: Routes = [
    {   
        path: '',
        component: MainLayoutComponent
        // canActivate: [roleGuard],
        // data: {roles: ["ROLE_ADMIN"]}
    }
]