export const asyncTimeout = (ms)=> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export default asyncTimeout