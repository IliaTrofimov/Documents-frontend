import { NgModule } from '@angular/core';
import { DocumentStatusPipe } from './document-status.pipe';
import { FieldTypePipe } from './field-type.pipe';
import { HTMLInputTypePipe } from './html-input-type.pipe';
import { NullNamePipe } from './null-name.pipe';
import { PermissionPipe } from './permission.pipe';
import { RestrictionPipe } from './restriction.pipe';
import { ShortNamePipe } from './shortname.pipe';


@NgModule({
  declarations: [
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe,
    ShortNamePipe,
    NullNamePipe
  ],
  providers: [],
  bootstrap: [],
  exports: [
    FieldTypePipe,
    HTMLInputTypePipe,
    DocumentStatusPipe,
    RestrictionPipe,
    PermissionPipe,
    ShortNamePipe,
    NullNamePipe
  ],
})
export class PipesModule { }
