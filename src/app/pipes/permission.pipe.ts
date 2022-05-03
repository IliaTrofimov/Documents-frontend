import { Pipe, PipeTransform } from '@angular/core';
import { PermissionFlag, Permission } from '../models/permission';

@Pipe({
  name: 'permission',
  pure: true,
})
export class PermissionPipe implements PipeTransform {

  transform<T>(value: PermissionFlag): string {
    return Permission.toString(value);
  }

}