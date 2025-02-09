
export class Vec2 {
    constructor(readonly x: number, readonly y: number) {

    }

    static fromPointerEvent(e: PointerEvent, baseElement: JQuery): Vec2 {
        const baseOffset = baseElement.offset()!;
        return new Vec2(e.pageX - baseOffset.left, e.pageY - baseOffset.top);
    }
}