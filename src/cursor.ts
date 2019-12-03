
const BLINK_ON: number = 600;
const BLINK_OFF: number = 180;

export class Cursor {

    private text: string;
    private idx: number = 0;

    public canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    private blinkShow: boolean = true;
    private normalMode: boolean = true;
    private blinkTimeout: number = 0;

    constructor(above: HTMLInputElement) {
        if (!above.parentElement) {
            throw new Error("cannot position above root element");
        }
        let { top, left, width, height, zIndex } = window.getComputedStyle(above);
        this.text = above.value;

        // position self above the text box
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        this.canvas.style.top = top;
        this.canvas.style.left = left;

        // make canvas 2x the css pixel size to prevent pixellation
        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.width = above.clientWidth * 2;
        this.height = above.clientHeight * 2;
        this.canvas.setAttribute("width", "" + this.width);
        this.canvas.setAttribute("height", "" + this.height);

        let ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Browser doesn't support canvas 2d rendering");
        }
        this.ctx = ctx;
        this.canvas.style.zIndex = ((zIndex) ? parseInt(zIndex) : 1000) + 1 + "";
        above.parentElement.appendChild(this.canvas);

        this.blinkShow = false;
        this.blink();
    }

    // at puts the cursor at the given position
    set = (text: string, idx: number, isNormal: boolean) => {
        this.text = text;
        this.idx = idx;
        if (idx > text.length) {
            this.idx = text.length;
        } else if (idx < 0) {
            this.idx = 0;
        }
        this.normalMode = isNormal;

        // reset the blink timeout
        window.clearTimeout(this.blinkTimeout);
        this.blinkTimeout = window.setTimeout(this.blink, BLINK_ON)
        this.blinkShow = false;
        this.blink();
    }

    private draw = () => {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height * .9);
        this.ctx.fillStyle = 'rgba(0,0,0,.87)';
        this.ctx.font = this.height * .47 + "px arial,sans-serif";
        this.ctx.fillText(this.text, 0, this.height * .7);

        // get the text and index
        let textBefore = this.text.substr(0, this.idx);
        let highlighted = this.text.charAt(this.idx);

        // set the context font and size
        let offset = this.ctx.measureText(textBefore).width;

        if (!this.blinkShow) {
            return;
        }

        if (this.normalMode) {
            if (this.idx == this.text.length) {
                // draw dollarsign
                let width = this.ctx.measureText("$").width;
                this.ctx.fillStyle = '#33b5e5';
                this.ctx.fillRect(offset, this.height * .2, width, this.height * .6);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText("$", offset, this.height * .7);
            } else {
                // draw normal bar
                let width = this.ctx.measureText(highlighted).width;
                this.ctx.fillStyle = '#33b5e5';
                this.ctx.fillRect(offset, this.height * .2, width, this.height * .6);
                this.ctx.fillStyle = 'white';
                this.ctx.fillText(highlighted, offset, this.height * .7);
            }
        } else {
            // draw insert bar
            this.ctx.fillStyle = '#33b5e5';
            this.ctx.fillRect(offset, this.height * .2, 3, this.height * .6);
        }

    }

    private blink = () => {
        this.blinkShow = !this.blinkShow;
        this.draw();
        let old = this.blinkTimeout
        if (this.blinkShow) {
            this.blinkTimeout = window.setTimeout(this.blink, BLINK_ON);
        } else {
            this.blinkTimeout = window.setTimeout(this.blink, BLINK_OFF);
        }
        window.clearTimeout(old);
    }

}