// Function to load and execute the calculator code
async function loadCalculator() {
    try {
        const response = await fetch('/api/code-on-demand/calculator');
        const code = await response.text();
        
        // Create a new script element
        const script = document.createElement('script');
        script.textContent = code;
        
        // Add the script to the document
        document.body.appendChild(script);
        
        console.log('Calculator loaded successfully! Try using it in the console.');
    } catch (error) {
        console.error('Error loading calculator:', error);
    }
}

// Load the calculator when the page loads
window.addEventListener('load', loadCalculator); 