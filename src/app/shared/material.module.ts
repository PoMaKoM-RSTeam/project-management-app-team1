import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { CreateUpdateModalComponent } from './components/project-create-update-modal/create-update-modal.component';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    HttpClientModule, 
    TranslateModule, 
    MatFormFieldModule, 
    FormsModule, 
    TextFieldModule, 
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    DragDropModule,
    MatSelectModule,
    CommonModule
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatNativeDateModule,
    TextFieldModule,
    MatSelectModule,
    DragDropModule
  ],
  declarations: [
    CreateUpdateModalComponent
  ],
})
export class MaterialModule {}
