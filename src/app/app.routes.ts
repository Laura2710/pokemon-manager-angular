import { RouterModule, Routes } from '@angular/router';
import { GenerationsComponent } from './composants/generations/generations.component';
import { PokemonsComponent } from './composants/pokemons/pokemons.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: 'generations', component: GenerationsComponent},
    {path: 'pokemons', component: PokemonsComponent},
    { path: 'pokemons/:generation', component: PokemonsComponent },
    { path: '', redirectTo: '/generations', pathMatch: 'full' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppModule {};
