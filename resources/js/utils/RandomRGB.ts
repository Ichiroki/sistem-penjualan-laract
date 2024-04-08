export const randomRGB = () => {
    // Generate random values for Red, Green, and Blue
    const red = Math.floor(Math.floor(Math.random()) * 255); // Random value between 0 and 255
    const green = Math.floor(Math.floor(Math.random()) * 255); // Random value between 0 and 255
    const blue = Math.floor(Math.floor(Math.random()) * 255); // Random value between 0 and 255

    // Return RGB string in the format "rgb(x, y, z)"
    return `rgb(${red}, ${green}, ${blue})`;
}
