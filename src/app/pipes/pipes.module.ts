import { NgModule } from '@angular/core';
import { AsPipe } from './as.pipe';
import { DocumentStatusPipe } from './document-status.pipe';
import { FieldTypePipe } from './field-type.pipe';
import { HTMLInputTypePipe } from './html-input-type.pipe';
import { PermissionPipe } from './permission.pipe';
import { RestrictionPipe } from './restriction.pipe';
import { ShortNamePipe } from './shortname.pipe';


@NgModule({
  declarations: [
    AsPipe,
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe,
    ShortNamePipe
  ],
  providers: [],
  bootstrap: [],
  exports: [
    AsPipe,
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe,
    ShortNamePipe
  ],
})
export class PipesModule { }
