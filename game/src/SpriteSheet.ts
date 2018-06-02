export default class SpriteSheet {
    tiles: Map<any, any>;
    height: number;
    width: number;
    image: any;
    constructor(image, w = 16, h = 16) {
        this.image = image;
        this.width = w;
        this.height = h;
        this.tiles = new Map();
    }

    define(buffer, name, x, y) {
        buffer.height = this.height;
        buffer.width = this.width;
        buffer
            .image(
                this.image,
                0,
                0,
                this.width,
                this.height,
                this.width * x,
                this.height * y,
                this.width,
                this.height
               );
        this.tiles.set(name, buffer);
    }

    draw(name, context, x, y) {
        const buffer = this.tiles.get(name);
        context.image(buffer, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
