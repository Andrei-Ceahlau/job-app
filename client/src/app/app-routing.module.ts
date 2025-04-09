import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { PersoaneComponent } from './components/persoane/persoane.component';
import { MasiniComponent } from './components/masini/masini.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'persoane', component: PersoaneComponent },
  { path: 'masini', component: MasiniComponent },
  { path: '', redirectTo: '/information', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
