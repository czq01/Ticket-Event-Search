import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SearchPageBody } from './search_card/search.body';
import { DetailedCard } from './detailed_card/detailedbody';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule,
    OverlayModule,
    ReactiveFormsModule,
    NgbModule,
    NgbCarouselModule,
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
