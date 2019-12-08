import { reverse } from './strings';

/**
 * FindContext is a class to encapsulate the state used in the find commands
 */
export class FindContext {

    searchTerm: string = "";
    isForwardSearch: boolean = true;
    includeInSearch: boolean = false;

    go(buffer: string, index: number): number {
        if (!this.isForwardSearch) {
            index = buffer.length - index - 1;
            buffer = reverse(buffer);
        }
        let offset = buffer.substr(index + (this.includeInSearch ? 1 : 2)).indexOf(this.searchTerm) + 1;
        if (!this.isForwardSearch) {
            offset *= -1;
        }
        return offset;
    }

}