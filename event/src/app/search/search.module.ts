import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';

import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchPageBody } from './search_card/search.body';
import { DetailedCard } from './detailed_card/detailedbody';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatTabsModule,
    RouterModule.forChild([
        {path: '', component: SearchPageBody},
        {path: 'detail', component: DetailedCard}
    ]),
  ],
  exports: [
    RouterModule
  ],

  declarations: [
    SearchPageBody,
    DetailedCard,
  ],

})
export class SearchModule { }
