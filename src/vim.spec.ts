import { expect } from 'chai';
import { SingleLineVimBuffer } from './vim';

describe("movement", () => {

    it("$_", () => {
        let index: number = 0;
        let buffer = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        buffer.$();
        expect(index).to.eq(11);
        buffer._();
        expect(index).to.eq(0);
    })

    it("e", () => {
        let index: number = 0;
        let buffer = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        buffer.e();
        expect(index).to.eq(3);
        buffer.e();
        expect(index).to.eq(6);
        buffer.e();
        expect(index).to.eq(11);
        buffer.e();
        expect(index).to.eq(11);
    });

    it("w", () => {
        let index: number = 0;
        let buffer = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        buffer.w();
        expect(index).to.eq(5);
        buffer.w();
        expect(index).to.eq(8);
        buffer.w();
        expect(index).to.eq(11);
        buffer.w();
        expect(index).to.eq(11);
    })

    it("l", () => {
        let index: number = 0;
        let buffer = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        expect(index).to.eq(8);
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        buffer.l();
        expect(index).to.eq(11);
    })

})