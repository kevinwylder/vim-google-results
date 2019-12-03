
// Sidebar is a canvas that draws itself to the left of a set of links
export class Sidebar {

    private top: number;
    private left: number;
    private width: number;
    private height: number;
    private notches: HTMLElement[] = [];
    private ctx: CanvasRenderingContext2D;
    private selectedIdx: number|undefined;

    public canvas: HTMLCanvasElement;

    constructor(notches: HTMLElement[]) {
        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "absolute";
        document.body.appendChild(this.canvas);

        // setup drawing context to fill blue 
        let ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Browser doesn't support HTML5");
        }
        this.ctx = ctx;

        this.notches = notches;
        this.notches.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top );

        // top and left are the minimum top and left for the given anchors
        this.top = window.innerHeight;
        this.left = window.innerWidth;
        // the height is the max difference from top to bottom
        this.height = 0;
        this.width = 30;
        notches.forEach((elem) => {
            let {top, left, bottom} = elem.getBoundingClientRect()
            top += window.pageYOffset;
            bottom += window.pageYOffset;

            if (top < this.top) {
                this.top = top;
            }
            if (left < this.left) {
                this.left = left;
            }
            if (bottom - this.top > this.height) {
                this.height = bottom - this.top;
            }
        })
        this.left -= this.width;

        this.canvas.setAttribute("width", "" + this.width);
        this.canvas.setAttribute("height", "" + this.height);
        this.canvas.style.top = this.top + "px";
        this.canvas.style.left = this.left + "px";
    }

    up() {
        if (this.selectedIdx === undefined) {
            return
        }
        this.selectedIdx--;
        if (this.selectedIdx < 0) {
            this.selectedIdx = undefined;
            this.draw();
            return
        }
        this.draw();
    }

    down() {
        if (this.selectedIdx === undefined) {
            this.selectedIdx = 0;
        } else if (this.selectedIdx < this.notches.length) {
            this.selectedIdx++;
        } else {
            return
        }
        this.draw()
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.selectedIdx === undefined) {
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });
            return
        }

        let { top } = this.notches[this.selectedIdx].getBoundingClientRect();
        let y = top + window.pageYOffset - this.top;
        window.scrollTo({
            top: top - 200 + window.pageYOffset,
            behavior: "smooth",
        });

        // begin drawing the triangle
        this.ctx.beginPath();
        this.ctx.moveTo(10, y);
        this.ctx.lineTo(20, y + 5);
        this.ctx.lineTo(10, y + 10);
        this.ctx.fillStyle = "blue";
        this.ctx.fill();
    }

    select(): boolean{
        if (this.selectedIdx === undefined) {
            return false;
        }
        this.notches[this.selectedIdx].click();
        return true;
    }

}