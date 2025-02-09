let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");
let downloadBtn = document.getElementById("downloadBtn");
let scanCountText = document.getElementById("scanCount"); // Display scan count

const BITLY_API_KEY = "YOUR_BITLY_ACCESS_TOKEN"; // Replace with your actual API key

// Function to shorten URL using Bitly API
// async function shortenURL(url) {
//     try {
//         const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${BITLY_API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ long_url: url })
//         });

//         if (!response.ok) {
//             throw new Error(`Bitly API Error: ${response.status}`);
//         }

//         const data = await response.json();
//         console.log("Shortened URL Data:", data); // Debugging
//         return data.link; // Shortened URL
//     } catch (error) {
//         console.error("Error shortening URL:", error);
//         alert("Error generating short URL. Check console for details.");
//         return null;
//     }
// }

// Function to get click count for a shortened Bitly link
async function getClickCount(bitlyURL) {
    try {
        let bitlyID = bitlyURL.replace("https://bit.ly/", ""); // Extract ID from Bitly URL
        const response = await fetch(`https://api-ssl.bitly.com/v4/bitlinks/bit.ly/${bitlyID}/clicks/summary`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${BITLY_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Bitly API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Click Count Data:", data); // Debugging
        return data.total_clicks ?? 0; // Return total clicks (default to 0)
    } catch (error) {
        console.error("Error fetching click count:", error);
        return 0;
    }
}

// Main function to generate QR code with tracking
async function generateQR() {
    if (qrText.value.trim().length === 0) {
        alert("Please enter text or a URL");
        return;
    }

    let inputText = qrText.value.trim();
    
    // Shorten the URL using Bitly API
    let shortURL = await shortenURL(inputText);
    
    if (!shortURL) {
        console.error("Failed to generate a shortened URL.");
        return;
    }

    // Fetch scan count (clicks) from Bitly
    let clickCount = await getClickCount(shortURL);

    // Update the QR code image
    qrImage.src = `https://quickchart.io/qr?text=${encodeURIComponent(shortURL)}&size=150`;

    // Enable download button
    downloadBtn.href = qrImage.src;
    downloadBtn.style.display = "block";

    // Display scan count
    scanCountText.innerHTML = `Scans: ${clickCount}`;
}
