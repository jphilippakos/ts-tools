export class MergeTest {
    get full() {
        return `${this.first} ${this.last}`;
    }

    constructor(public first: string, public last: string) { }
}