export abstract class PrintBuilder {
    public abstract init(): PrintBuilder;
    /**
     *
     * @param cutType fill|partial
     */
    public abstract cut(cutType: string): PrintBuilder;
    public abstract flush(): any;
    public abstract feed(lineCount: number): PrintBuilder;
    public abstract setInverse(value: boolean): PrintBuilder;
    public abstract setBold(value: boolean): PrintBuilder;
    /**
     *
     * @param value left\center\right
     */
    public abstract setJustification(value: string): PrintBuilder;
    /**
     *
     * @param value normal\large
     */
    public abstract setSize(value: string): PrintBuilder;
    public abstract setUnderline(value: boolean): PrintBuilder;
    public abstract writeLine(text: string): PrintBuilder;
}