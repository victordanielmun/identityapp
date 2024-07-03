import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/errors/not-found/not-found.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { AuthorizationGuard } from './shared/guards/authorization.guard';

const routes: Routes = [
  {path : '', redirectTo: 'account/login', pathMatch: 'full'},
  {
    path : 'home', component: HomeComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthorizationGuard],
    children: [
      {path : 'home', component: HomeComponent}
    ]
  },
  {path : 'about', component: AboutComponent},
  {path : 'contact', component: ContactComponent},
  //implementa carga perezosa para account
  {path : 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path : 'not-found', component: NotFoundComponent},
  {path : '**', redirectTo: 'not-found', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
