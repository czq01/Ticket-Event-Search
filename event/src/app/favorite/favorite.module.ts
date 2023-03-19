import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritePageBody } from './favorite.body';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path: '', component: FavoritePageBody}
];

@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,
  ],

  declarations: [
    FavoritePageBody,
  ],


})
export class FavoriteModule { }
