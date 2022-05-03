import { NgModule } from '@angular/core';
import { AsPipe } from './as.pipe';
import { DocumentStatusPipe } from './document-status.pipe';
import { FieldTypePipe } from './field-type.pipe';
import { HTMLInputTypePipe } from './html-input-type.pipe';
import { PermissionPipe } from './permission.pipe';
import { RestrictionPipe } from './restriction.pipe';


@NgModule({
  declarations: [
    AsPipe,
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe
  ],
  providers: [],
  bootstrap: [],
  exports: [
    AsPipe,
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe
  ],
})
export class PipesModule { }
