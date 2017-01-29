import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'gamePipe'
})
export class GamePipe implements PipeTransform {
    transform(array: Array<string>, args: string): Array<string> {
        array.sort((a: any, b: any) => {
            if (!a.round) return 1;
            if (!b.round) return -1;
            if (parseInt(a.round) < parseInt(b.round)) {
                return -1;
            } else if (parseInt(a.round) > parseInt(b.round)) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
