/**
 * Created by mikedanylov on 10/2/16.
 */

export class Screen {

    constructor () {
    }

    /**
     * @desc    Recalculate coordinate and map to standard resolution
     */
    public static getPosition(coordinate: number, max: number): number {
    let platform: Platform;
    let factor: number;

    if (coordinate < 0 || !max) {
        throw new Error('api.getPosition: No params');
    }

    platform = this.getPlatform(max);
    factor = platform.width / max;

    return Math.floor(coordinate * factor);
}

    /**
     * @desc    Get standard platform for current screen width
     */
    public static getPlatform(width: number): Platform {
        let result: Platform;
        let platforms = [
            new Platform('mobile', 320),
            new Platform('tablet', 600),
            new Platform('desktop', 1024)
        ];

        if (!width) {
            throw new Error('api.getPlatform: No params');
        }

        result = platforms[0];
        platforms.forEach(function (platform) {
            if (platform.width < width) {
                result = platform;
            }
        });

        return result;
    }

}

export class Platform {
    private _name: string;
    private _width: number;

    constructor (name, width) {
        this._name = name;
        this._width = width;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get width(): number {
        return this._width;
    }

    set width(value: number) {
        this._width = value;
    }
}