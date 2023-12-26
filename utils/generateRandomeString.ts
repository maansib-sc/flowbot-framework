export function generateRandomString(initial: string, length: number) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = initial;
    for (let i = 0; i < length - 5; i++) {
        const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
        result += randomChar;
    }
    for (let i = 0; i < 3; i++) {
        const randomDigit = numbers.charAt(Math.floor(Math.random() * numbers.length));
        result += randomDigit;
    }
    return result;
}