import { Pipe, PipeTransform } from '@angular/core';
import { TimeAgoPipe } from 'time-ago-pipe';

@Pipe({
  name: 'timeAgoExtends',
  pure: false,
})
export class TimeAgoExtendsPipe extends TimeAgoPipe {}
