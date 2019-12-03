import { expect } from 'chai';
import { findWords } from './strings';

describe("word splitting", () => {
    const test_string = `this is some tex[[{[}})).. asdf@#8 asdf..  	 	 ]]}}\\0kay`;
    it(`should find words in: '${test_string}'`, () => {
        let words = findWords(test_string);
        expect(words.length).to.eq(12);
        expect(words[0].length).to.eq(4);
        expect(words[0].offset).to.eq(0);
        expect(words[1].length).to.eq(2);
        expect(words[1].offset).to.eq(5);
        expect(words[2].length).to.eq(4);
        expect(words[2].offset).to.eq(8);
        expect(words[3].length).to.eq(3);
        expect(words[3].offset).to.eq(13);
        expect(words[4].length).to.eq(10);
        expect(words[4].offset).to.eq(16);
        expect(words[5].length).to.eq(4);
        expect(words[5].offset).to.eq(27);
        expect(words[6].length).to.eq(2);
        expect(words[6].offset).to.eq(31);
        expect(words[7].length).to.eq(1);
        expect(words[7].offset).to.eq(33);
        expect(words[8].length).to.eq(4);
        expect(words[8].offset).to.eq(35);
        expect(words[9].length).to.eq(2);
        expect(words[9].offset).to.eq(39);
        expect(words[10].length).to.eq(5);
        expect(words[10].offset).to.eq(47);
        expect(words[11].length).to.eq(4);
        expect(words[11].offset).to.eq(52);
    })

})