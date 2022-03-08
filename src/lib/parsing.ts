export function number(value: string): number {
    const n = Number(value);
    if (isNaN(n)) {
        throw new Error(`expected a number: "${value}"`);
    }
    return n;
}
