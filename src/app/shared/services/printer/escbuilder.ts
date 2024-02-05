import { PrintBuffer } from './print-buffer';
import { PrintBuilder } from './printbuilder';

declare var TextEncoder: any;

const ESC = 0x1b;
const GS = 0x1D;

export class EscBuilder extends PrintBuilder {
    private encoder = new TextEncoder();
    private buffer?: PrintBuffer;

    constructor() {
        super();
    }

    init(): EscBuilder {
        this.buffer = new PrintBuffer();
        this.write(ESC);
        this.write("@");
        return this;
    }

    flush(): Uint8Array | boolean{
        if(this.buffer){
            return this.buffer.flush();
        }
        else{
            return false
        }
        
    }

    feed(lineCount: number = 1): EscBuilder {
        this.write(ESC);
        this.write("d");
        this.write(lineCount);
        return this;
    }

    cut(cutType: string = 'full'): EscBuilder {
        this.write(GS);
        this.write("V");
        this.write(cutType === 'full' ? 1 : 0);

        return this;
    }

    writeLine(value: string): EscBuilder {
        return this.write(`${value}\n`);
    }

    setInverse(inverse: boolean = true): EscBuilder {
        this.write(GS);
        this.write("B");
        this.write(inverse ? 1 : 0);

        return this;
    }

    setUnderline(value: boolean = false): EscBuilder {
        this.write(ESC);
        this.write("-");
        this.write(value ? 1 : 0);
        return this;
    }

    setJustification(value: string = 'left'): EscBuilder {
        let alignment;
        switch (value) {
            case "center":
                alignment = 1
                break;
            case "right":
                alignment = 2;
                break;
            default:
                alignment = 0;
                break;
        }
        this.write(ESC);
        this.write("a");
        this.write(alignment);

        return this;
    }

    setBold(bold: boolean = false): EscBuilder {
        this.write(ESC);
        this.write("E");
        this.write(bold ? 1 : 0);

        return this;
    }

    /**
    @param mode 0, 0x30
    */
    setSize(size: string = 'normal'): EscBuilder {
        this.write(ESC);
        this.write("!");
        type SizeMapping = {
            'normal': number;
            'large': number;
            'xlarge': number;
            'xxlarge': number;
        };
        let sizeMapping: SizeMapping = {
            'normal': 0,
            'large': 0x1a,
            'xlarge': 0x2a,
            'xxlarge': 0x30
        }
        let value = sizeMapping[size as keyof SizeMapping]
        this.write(value? value : 0);

        return this;
    }

    private write(value: string | Uint8Array | number): any {

        if (typeof value === "number") {
            this.buffer?.writeUInt8(value);
        } else if (typeof value === "string") {
            this.buffer?.write(this.encoder.encode(value));
        } else {
            this.buffer?.write(value);
        }
        return this;
    }
}