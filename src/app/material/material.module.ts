import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material';
import { MatIconModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';


@NgModule({
  imports:[
    CommonModule
  ],
  exports:[
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatInputModule,
    MatIconModule
  ]
})
export class MaterialModule { }
