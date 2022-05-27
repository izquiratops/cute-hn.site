import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomainPipe} from "./domain.pipe";
import { ElapsedTimePipe } from './elapsed-time.pipe';


@NgModule({
  declarations: [
    DomainPipe,
    ElapsedTimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DomainPipe,
    ElapsedTimePipe
  ]
})
export class PipesModule {
}
