export { };
declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchShorthand(str: string): R;
        }
    }
}
