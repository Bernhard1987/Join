/**
 * Creates an SVG element representing a user's initials with a random background color.
 *
 * This function takes a user's name as input and generates an SVG element that displays the user's
 * initials with a randomly colored background circle. The SVG is created dynamically and can be
 * used to display user avatars or profile images.
 *
 * @param {string} name -> The name of the user for which the SVG avatar is generated.
 * @returns {SVGElement} -> An SVG element representing the user's initials with a background circle.
 */

function createSVGForUser(name) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Extract the initials from the user's name
    let initials = name.split(' ').map(word => word[0]).join('');
    initials = initials.toUpperCase().substring(0, 3);

    // Generate a random background color
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

    // Create a new SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 100 100");

    // Add a circle for the background
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "40");
    circle.setAttribute("fill", randomColor);
    svg.appendChild(circle);

    // Add text (initials)
    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", "50");
    text.setAttribute("y", "60");  // These values can be adjusted to center the text
    text.setAttribute("font-family", "Arial");
    text.setAttribute("font-size", "24");
    text.setAttribute("fill", "white");
    text.setAttribute("text-anchor", "middle");
    text.textContent = initials;
    svg.appendChild(text);

    // Return the SVG element
    return svg;
}


/**
 * Displays a user's SVG avatar within an HTML container.
 *
 * This asynchronous function retrieves the user's data using `getActualUserData`, and if the user data
 * includes an SVG avatar, it adds the SVG to the specified HTML container with the ID 'account-img-container'.
 * The function is designed to handle errors gracefully and logs any encountered errors to the console.
 *
 * @throws {Error} Throws an error if there is an issue with retrieving user data or adding the SVG to the container.
 */

async function displayUserSVG() {
    try {
        await getActualUserData();
        if (user && user.svg) {
            const container = document.getElementById('account-img-container');
            if (container) {
                container.innerHTML = user.svg + container.innerHTML;
            } else {
            }
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}