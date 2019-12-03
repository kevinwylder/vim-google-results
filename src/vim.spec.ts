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
        let buffer = new SingleLineVimBuffer("this is ((xt", (_: string, idx: number) => { index = idx});
        buffer.e();
        expect(index).to.eq(3);
        buffer.e();
        expect(index).to.eq(6);
        buffer.e();
        expect(index).to.eq(9);
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

    it('h', () => {
        let index: number = 0;
        let buffer = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        buffer.h();
        expect(index).to.eq(0);
        buffer.l();
        buffer.l();
        buffer.h();
        expect(index).to.eq(1);
    })

})

describe("insert", () => {

    it("A", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.A();
        buffer.insert(" more");
        expect(buffer.toString()).to.eq("this is text more");
    })

    it("a", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.a();
        buffer.insert(" more");
        expect(buffer.toString()).to.eq("t morehis is text");
    });

    it("i", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.$();
        buffer.i();
        buffer.insert(" more");
        expect(buffer.toString()).to.eq("this is tex moret");
    });

    it("I", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.$();
        buffer.I();
        buffer.insert("more ");
        expect(buffer.toString()).to.eq("more this is text");
    });

    it("S", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.$();
        buffer.S();
        buffer.insert("more ");
        expect(buffer.toString()).to.eq("more ");
    });

    it("C", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.l();
        buffer.l();
        buffer.C();
        buffer.insert("more ");
        expect(buffer.toString()).to.eq("thmore ");
    })
})

/*
describe("delete", () => {
    it("Backspace", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.A();
        buffer.Backspace()
        expect(buffer.toString()).to.eq("this is tex");
    })
    it("x", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.x();
        expect(buffer.toString()).to.eq("his is text");
        buffer.w();
        buffer.w();
        buffer.e();
        buffer.x();
        expect(buffer.toString()).to.eq("his is tex");
        buffer.x();
        expect(buffer.toString()).to.eq("his is tex");
    })
})

describe("replace", () => {
    it("r", () => {
        let buffer = new SingleLineVimBuffer("this is text", () => {});
        buffer.r();
        buffer.insert()
    })

    it("~", () => {

    })
})
*/