
const BLINK_ON: number = 600;
const BLINK_OFF: number = 180;

export class Cursor {

    private text: string;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    private blinkShow: boolean = true;
    private normalMode: boolean = true;
    private cursorIdx: number = 0;
    private blinkTimeout: number = 0;

    constructor(above: HTMLInputElement) {
        let { top, left } = above.getBoundingClientRect()
        top += window.pageYOffset;
        left += window.pageXOffset;

        // position self above the text box
        this.text = above.value;
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", "" + above.clientWidth);
        this.canvas.setAttribute("height", "" + above.clientHeight);
        this.canvas.style.width = above.clientWidth + "px";
        this.canvas.style.height = above.clientHeight + "px";
        this.width = above.clientWidth;
        this.height = above.clientHeight;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = top + "px";
        this.canvas.style.left = left + "px";
        let ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Browser doesn't support canvas 2d rendering");
        }
        this.ctx = ctx;
        this.canvas.style.zIndex = "1000";
        document.body.appendChild(this.canvas);
    }

    // insert puts the cursor in insert mode.
    insert = () => {
        this.normalMode = false;
        this.blinkShow = false;
        // clear the blink timeout
        window.clearTimeout(this.blinkTimeout);
        this.draw();
    }

    // normal puts the cursor in normal mode.
    normal = () => {
        this.normalMode = true;
        this.blinkShow = true;
        // reset the timeout
        window.clearTimeout(this.blinkTimeout);
        this.blinkTimeout = window.setTimeout(this.blink, BLINK_ON)
        this.draw();
    }

    // at puts the cursor at the given position
    set = (text: string, pos: number) => {
        this.text = text;
        this.cursorIdx = pos;

        // reset the blink timeout
        this.blinkShow = true;
        window.clearTimeout(this.blinkTimeout);
        this.blinkTimeout = window.setTimeout(this.blink, BLINK_ON)

        this.draw();
    }

    private draw = () => {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.fillText()
        if (!this.normalMode || !this.blinkShow) {
            return;
        }

        // get the text and index
        let text = this.text.value;
        if (this.cursorIdx >= text.length) {
            this.cursorIdx = text.length - 1;
        } else if (this.cursorIdx < 0) {
            this.cursorIdx = 0;
        }
        let idx = this.cursorIdx;

        let textBefore = text.substr(0, idx);
        let highlighted = text.charAt(idx);

        // set the context font and size
        this.ctx.font = this.text.style.font;
        let offset = this.ctx.measureText(textBefore).width;
        let width = this.ctx.measureText(highlighted).width;
        console.log(width, offset);
        this.ctx.fillRect(offset, this.height * .25, width, this.height * .5);
    }

    private blink = () => {
        this.blinkShow = !this.blinkShow;
        this.draw();
        if (this.normalMode) {
            window.clearTimeout(this.blinkTimeout);
            if (this.blinkShow) {
                this.blinkTimeout = window.setTimeout(this.blink, BLINK_ON);
            } else {
                this.blinkTimeout = window.setTimeout(this.blink, BLINK_OFF);
            }
        }
    }

}