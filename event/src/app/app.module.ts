import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { MainBody } from './event.body';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Overlay, OverlayModule } from '@angular/cdk/overlay';

const routes: Routes = [
  {path: 'search', loadChildren: ()=>import('./search/search.module')
                        .then(m=>m.SearchModule)},
  {path: 'favorite', loadChildren: ()=>import('./favorite/favorite.module')
                        .then(m=>m.FavoriteModule)},
  {path: '', redirectTo: '/search', pathMatch: 'full'},
];

@NgModule({
  declarations: [
    MainBody,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    MatAutocompleteModule,
    OverlayModule,
    FormsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [MainBody]
})

export class AppModule {

}
