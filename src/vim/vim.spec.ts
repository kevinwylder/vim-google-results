import { expect } from 'chai';
import { SingleLineVimBuffer } from '.';

describe("movement", () => {

    it("$_", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        vim.key.$();
        expect(index).to.eq(11);
        vim.key._();
        expect(index).to.eq(0);
    })

    it("e", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is .(xt", (_: string, idx: number) => { index = idx });
        vim.key.e();
        expect(index).to.eq(3);
        vim.key.e();
        expect(index).to.eq(6);
        vim.key.e();
        expect(index).to.eq(9);
        vim.key.e();
        expect(index).to.eq(11);
        vim.key.e();
        expect(index).to.eq(11);
    });

    it("w", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx});
        vim.key.w();
        expect(index).to.eq(5);
        vim.key.w();
        expect(index).to.eq(8);
        vim.key.w();
        expect(index).to.eq(11);
        vim.key.w();
        expect(index).to.eq(11);
    })

    it('b', () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx }, 10);
        vim.key.b();
        expect(index).to.eq(8);
    })

    it("l", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx}, 10);
        vim.key.l();
        expect(index).to.eq(11);
        vim.key.l();
        vim.key.l();
        expect(index).to.eq(12);
    })

    it('h', () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx}, 2);
        vim.key.h();
        expect(index).to.eq(1);
        vim.key.h();
        vim.key.h();
        expect(index).to.eq(0);
    });

    it('f;,', () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx}, 2);
        vim.key.f();
        expect(vim.nextCharacterIsLiteral());
        vim.literal("t");
        expect(!vim.nextCharacterIsLiteral());
        expect(index).to.eq(8)
        vim.key[';']();
        expect(index).to.eq(11);
        vim.key[',']();
        expect(index).to.eq(8)
        vim.key[';']();
        expect(index).to.eq(0)
    });

    it("F;,", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("t*is *s text", (_: string, idx: number) => { index = idx}, 7);
        vim.key.F();
        expect(vim.nextCharacterIsLiteral());
        vim.literal("*");
        expect(index).to.eq(5)
        vim.key[';']();
        expect(index).to.eq(1);
        vim.key[',']();
        expect(index).to.eq(5)
        vim.key[';']();
        expect(index).to.eq(5)
    });

    it('t;,', () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("this is text", (_: string, idx: number) => { index = idx}, 2);
        vim.key.t();
        expect(vim.nextCharacterIsLiteral());
        vim.literal("t");
        expect(index).to.eq(7)
        vim.key[';']();
        expect(index).to.eq(10);
        vim.key[',']();
        expect(index).to.eq(9)
        vim.key[';']();
        expect(index).to.eq(1)
    });

    it("T;,", () => {
        let index: number = 0;
        let vim = new SingleLineVimBuffer("t*is *s text", (_: string, idx: number) => { index = idx}, 7);
        vim.key.T();
        expect(vim.nextCharacterIsLiteral());
        vim.literal("*");
        expect(index).to.eq(6)
        vim.key[';']();
        expect(index).to.eq(2);
        vim.key[',']();
        expect(index).to.eq(4)
        vim.key[';']();
        expect(index).to.eq(4)
    })
})

describe("insert", () => {

    it("A", () => {
        let vim = new SingleLineVimBuffer("this is text");
        vim.key.A();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal(" more");
        expect(vim.toString()).to.eq("this is text more");
    })

    it("a", () => {
        let vim = new SingleLineVimBuffer("this is text");
        vim.key.a();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal(" more");
        expect(vim.toString()).to.eq("t morehis is text");
    });

    it("i", () => {
        let vim = new SingleLineVimBuffer("this is text", () => {}, 11);
        vim.key.i();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal(" more");
        expect(vim.toString()).to.eq("this is tex moret");
    });

    it("I", () => {
        let vim = new SingleLineVimBuffer("this is text", () => {}, 11);
        vim.key.I();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal("more ");
        expect(vim.toString()).to.eq("more this is text");
    });

    it("S", () => {
        let vim = new SingleLineVimBuffer("this is text", () => {}, 11);
        vim.key.S();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal("more ");
        expect(vim.toString()).to.eq("more ");
    });

    it("C", () => {
        let vim = new SingleLineVimBuffer("this is text", () => {}, 2);
        vim.key.C();
        expect(vim.nextCharacterIsLiteral()).to.be.true;
        vim.literal("more ");
        expect(vim.toString()).to.eq("thmore ");
    });
});

describe("delete", () => {
    it("Backspace", () => {
        let vim = new SingleLineVimBuffer("this is text");
        vim.key.A();
        vim.key.Backspace()
        expect(vim.toString()).to.eq("this is tex");
    });

    it("D", () => { 
        let index = 5;
        let vim = new SingleLineVimBuffer("this is text", (_, i) => {index = i}, 5);
        vim.key.D();
        expect(vim.nextCharacterIsLiteral()).to.be.false;
        expect(vim.toString()).to.eq("this ");
        expect(index).to.eq(4);
    });

    it("x", () => {
        let vim = new SingleLineVimBuffer("this is text", () => {}, 11);
        vim.key.x();
        expect(vim.toString()).to.eq("this is tex");
        vim.key.x();
        expect(vim.toString()).to.eq("this is tex");
    });
})

describe("replace", () => {
    it("r", () => {
        let vim = new SingleLineVimBuffer("this is text");
        vim.key.r();
        expect(vim.nextCharacterIsLiteral())
        vim.literal("H")
        expect(vim.toString()).to.eq("Hhis is text");
    })

    it("R", () => {
        let vim = new SingleLineVimBuffer("this is text");
        vim.key.R();
        expect(vim.nextCharacterIsLiteral())
        vim.literal("HeLLo")
        vim.literal("  WORLD")
        expect(vim.toString()).to.eq("HeLLo  WORLD");
    })

    it("~", () => {
        let index = 0;
        let vim = new SingleLineVimBuffer("tH1s is text", (_, i) => {index = i});
        vim.key["~"]();
        expect(vim.buffer.toString()).to.eq("TH1s is text")
        expect(index).to.eq(1);
        vim.key["~"]();
        expect(index).to.eq(2);
        vim.key["~"]();
        expect(vim.buffer.toString()).to.eq("Th1s is text")
        expect(index).to.eq(3);
    });
})

describe("delete/change movement", () => {
    it("dw", () => {
        let vim = new SingleLineVimBuffer("the cow")
        vim.key.d();
        vim.key.w();
        expect(vim.toString()).to.eq("cow");
        expect(vim.nextCharacterIsLiteral()).to.be.false;
    });

    it("ce == cw", () => {
        let vim = new SingleLineVimBuffer("the cow")
        vim.key.c();
        vim.key.e();
        expect(vim.toString()).to.eq("cow ");
        expect(vim.nextCharacterIsLiteral()).to.be.false;
        vim = new SingleLineVimBuffer("the cow")
        vim.key.c();
        vim.key.w();
        expect(vim.toString()).to.eq("cow ");
        expect(vim.nextCharacterIsLiteral()).to.be.false;
    });

    it("dfo", () => {
        let vim = new SingleLineVimBuffer("the cow")
        vim.key.d();
        vim.key.f();
        vim.literal("o");
        expect(vim.toString()).to.eq("w");
    })

    it("d;", () => {
        let vim = new SingleLineVimBuffer("the cow")
        vim.key.f();
        vim.literal("o");
        vim.key._();

        vim.key.d();
        vim.key[';']();
        expect(vim.toString()).to.eq("w");
    })
})
