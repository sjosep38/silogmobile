let cart = [];
let totalPrice = 0;
let discountApplied = false;  // Flag to track if discount is applied

// Retrieve daily sales from localStorage (or default to 0 if not found)
let dailySales = parseFloat(localStorage.getItem('dailySales')) || 0;

// Add product to cart
function addProduct(productName, price) {
    // Play beep sound
    let beep = new Audio('sound/store-scanner-beep-90395.mp3');
    beep.play();

    cart.push({ name: productName, price: price });
    totalPrice += price;
    updateCart();
    updateDailySales();
}


// Remove product from the cart by index
function removeProduct(index) {
    // Play beep sound when removing a product
    let beep = new Audio('sound/stop-13692.mp3');
    beep.play();

    const itemToRemove = cart[index];
    totalPrice -= itemToRemove.price;
    cart.splice(index, 1);
    updateCart();
    updateDailySales();
}

// Reset the cart (clear it)
function resetWindow() {
    // Play beep sound when the Cancel button is clicked
    let beep = new Audio('sound/beep-beep-43875.mp3');
    beep.play();

    cart = [];
    totalPrice = 0;
    discountApplied = false;  // Reset discount flag
    updateCart();
    updateDailySales();
}


// Update daily sales and save to localStorage
function updateDailySales() {
    // Save the total daily sales to localStorage
    localStorage.setItem('dailySales', dailySales.toFixed(2));
    displayDailySales(); // Update the displayed daily sales
}


// Display the current daily sales
function displayDailySales() {
    const dailySalesElement = document.getElementById("daily-sales");
    dailySalesElement.textContent = `Total Daily Sales: ₱${dailySales.toFixed(2)}`;
}

// Call this function on page load to display initial daily sales
window.onload = function() {
    displayDailySales();
};

function resetDailySales() {
    // Prompt for password before allowing the reset
    const password = prompt("Please enter the administrator password to reset the daily sales:");

    // Replace 'adminPassword' with the actual password you want to use
    const adminPassword = "s0bGPkvsE6PA7xTO18kwLrrdn"; 

    // Check if the password matches
    if (password === adminPassword) {
        // Ask for confirmation before resetting
        const confirmation = confirm("You are about to reset the total daily sales. Do you want to continue?");
        
        if (confirmation) {
            // Reset the daily sales variable (make sure it's available globally)
            let dailySales = 0;  // Or use your global dailySales variable here

            // Clear the daily sales from localStorage
            localStorage.setItem('dailySales', dailySales.toFixed(2));

            // Update the displayed daily sales
            displayDailySales();

            // Notify the user that the reset was successful
            alert("Daily sales have been reset.");
			
        } else {
            alert("Daily sales reset canceled.");
        }
    } else {
        // Password is incorrect
        alert("Incorrect password. You are not authorized to reset the daily sales.");
    }
}

// Apply 20% discount (toggle the discount)
function applyDiscount() {
    discountApplied = !discountApplied;  // Toggle discount flag

    // Update cart and total price display
    updateCart();

    // Update button text based on whether the discount is applied or not
    const discountButton = document.getElementById('discount-button');
    if (discountApplied) {
        discountButton.textContent = "Remove Discount";
    } else {
        discountButton.textContent = "Apply Discount";
    }
}

let pressTimer;
let longPressDuration = 100;  // Duration in seconds (10 second)

// Start long press
function startPress(event, productName) {
    // Preventing the default behavior to avoid unwanted actions
    event.preventDefault();

    // Set a timer to trigger after the long press duration
    pressTimer = setTimeout(function() {
        markAsSoldOut(productName);
    }, longPressDuration);
}

// End long press (either mouse or touch ends)
function endPress(event) {
    // Prevent the action if it's a mouse event on desktop or touch event on mobile
    clearTimeout(pressTimer);  // Cancel the long press action if released early
}

// Mark the product as sold out
function markAsSoldOut(productName) {
    const soldOutElement = document.getElementById(`sold-out-${productName}`);
    const productElement = document.querySelector(`[data-product="${productName}"]`);

    // Add "sold-out" class to make it visible
    if (soldOutElement) {
        soldOutElement.classList.add('sold-out-visible');
    }

    // Dim the product image to show it's unavailable
    const productImage = productElement.querySelector('.logo');
    if (productImage) {
        productImage.style.opacity = '0.9';
    }

    // Disable further clicks and interactions for the product
    productElement.style.pointerEvents = 'none';
}

// Set event listeners for both touch and mouse interactions
document.querySelectorAll('.product').forEach(product => {
    const productName = product.getAttribute('data-product');

    // Mouse events for desktop
    product.addEventListener('mousedown', (event) => startPress(event, productName)); // For mouse
    product.addEventListener('mouseup', endPress); // For mouse release

    // Touch events for mobile
    product.addEventListener('touchstart', (event) => startPress(event, productName)); // For touch
    product.addEventListener('touchend', endPress); // For touch end
});

let transactionNumber = generateTransactionNumber(); // Generate transaction number when the script loads

// Function to generate a 6-digit transaction number
function generateTransactionNumber() {
    let transactionNumber = Math.floor(Math.random() * 1000000); 
    return transactionNumber.toString().padStart(6, '0');
}

// Display the transaction number in the HTML on page load
window.onload = function() {
    // Display transaction number in HTML
    document.getElementById("transactionNumber").textContent = transactionNumber;
    displayDailySales();  // Initialize daily sales
};

// Print receipt with correct transaction number
function printReceipt() {
    try {
        let beep = new Audio('sound/message-13716.mp3');
        beep.play();

        if (cart.length === 0) {
            alert("No items in the cart to pay.");
            return;
        }

        // Use the same transaction number for receipt
        const currentTransactionNumber = transactionNumber;  // Keep the transaction number consistent

        // Get current date and time
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = currentDate.toLocaleTimeString('en-GB'); // Format: HH:MM:SS AM/PM
        const dateTime = `${formattedDate} ${formattedTime}`;

        // Initialize final price and discount calculation
        let finalPrice = totalPrice || 0;
        let discountAmount = 0;
        if (discountApplied) {
            discountAmount = finalPrice * 0.2; // 20% discount
            finalPrice -= discountAmount;
        }
         // Create the printable content
let receiptContent = `
    <html>
    <head>
        <title>Receipt</title>
        <style>
            body { font-family: font-size: 20px; color: #080000; }
            .receipt-container { width: 300px; margin: 0 auto; text-align:center; }
            .receipt-container h1 { font-size: 20px; color: #080000;}
            .receipt-container h4 { font-size: 20px; color: #080000;}
			 .receipt-container p { font-size: 20px; color: #080000;}
			.receipt-container h5 { font-size: 20px; color: #080000;}
            .receipt-container table { width: 100%; text-align: left; margin-top: 10px;font-size: 20px; color: #080000; }
            .receipt-container th, .receipt-container td { padding: 5px 10px; }
            .receipt-container hr { margin-top: 20px; font-size: 20px; #080000; }
            .receipt-container .date-time { font-size: 20px; color: #080000; }
            .receipt-container img {}
        </style>
    </head>
    <body>
        <div class="receipt-container">
            <!-- Use full image path here -->
            <img class="logo" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAByALUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAoorzP9sD9qjwz+xd+zt4n+Iviu6gg07w9ZvNFA8yxyajcYPlW0Weskj4UD3z0Bq6dOVSShBXb0QHk/7SX/BZD4Efsn/GvVfh74y8Qa1beKdFigmu7Wz0K7vFiSaJZYzviRl5RgetcR/xEJ/syf8AQx+Lf/CS1H/41X5r/tdftXfFXR7z4/fGyaO3+B/jL4iQeD7XSNJs/F1jd63FDEu2XdDE/nxhojG5EkSYDgGsePxV+0O8at/w038ThkZ/1v8A9nXdnuOyHI6dJ5tVcHUvazcruKi5W5KclZOSW59PwxwXnPEPtf7JpKfs7c3vRjbmvb4mr3s9j9QP+IhP9mT/AKGPxb/4SWo//GqP+IhP9mT/AKGPxb/4SWo//Gq/MD/hKP2hv+jnPid/39/+zo/4Sj9ob/o5z4nf9/f/ALOvm/8AX7gj/oJf3VP/AJSfWf8AEFOMf+gZf+DKf/yZ+n//ABEJ/syf9DH4t/8ACS1H/wCNUf8AEQn+zJ/0Mfi3/wAJLUf/AI1X5L+Jf2kvi/4T1xdLu/2sviO2qvwtjbO9zdE9h5UZZ/0qHxB+0t8bfBqhte/aT+OPh2JukuraLfWMR990qKP1r38NmmRYikq+HjWlB6pqlXaa8mqGp4GK8P8AN8NW+r4iVGE1pyuvRT+51Ln63f8AEQn+zJ/0Mfi3/wAJLUf/AI1R/wARCf7Mn/Qx+Lf/AAktR/8AjVfll4d+J3x18X6THf6V+1V8Q9RspvuTW90JEb8Q+M1e/wCEo/aG/wCjnPid/wB/f/s68Spx1wXTm6dTESTWjTjUTT817E9yn4McX1IKdPDxaeqaqU2n6e+fp/8A8RCf7Mn/AEMfi3/wktR/+NUf8RCf7Mn/AEMfi3/wktR/+NV+YH/CUftDf9HOfE7/AL+//Z1zHxl+NH7RXwr+GGs+IY/2kviZePpcHmrC1wUEh3AYJ3HHWtsFxnwbi8RTwtDENznJRStUV23ZK7o23ZjjPB/izC4eeKr4dKEE5N89N2SV3opX2R+5P7G//BSX4T/t56v4isPhvrOpand+FY4JNSiu9LuLFoFmL+XxKq5zsbp6V7xX4ofs5ft36/8Asa/tI+LfjNqOhaX8RPh98RPD/gm38TeJdO8V2NxdeHyllb21xd3NpE8lxxcTMrb0Qblxn5hX7QeF/FGm+NvDljrGj39pqmlapAl1Z3lrKssFzE4DK6OpIZSCCCDg17+bZf8AVqicF7jtbVPWybTtbVN9Uj8zjK5fooorySgooooAKKKKACiiigAr5n/4LH+ItQ8I/wDBML40anpV9eaZqNl4feW3urWZoZoHEkeGV1IKn3Bq/wDt2f8ABR3wp+xTbaXoken3/jj4neKcx+G/Bmj4e/1OToHc4PkQAnmVhjAOA2Dj8nf25v8AgoT4m/aLh1zwh8X/AIrapaJqKm0uvhX8G9Kh1RYI85MWoatOShmBADLF5igjoOQPbyrLakpxxM7RhFp3fVJ6/Lzdl5hGMpy9nTTbeyWrKvi/9s28/ZT8bf8ACEWH7SH7WFpqel6Vpt5frHoun+KLNWurGG5AjaeVHQfvcfMP4epxmvOvF37S158VfGGna3ouifGH4xeN9Pk87T/EXxdu4oNC0CXHE8OkxbopHHVQ7soOPkbFL4H1XV/il+0D44+Id94WvvBum+ILTS9N03TL+8W6vEhsrRLZXkdUQbmVFYjYuCSMYGT6DX5rxj4xvK8fVwGWUadRxUf3nNdNuKcvgSvZtr42tNT+jeBvAqjmWXUcxzarUpuV26fKouyk0tZXaukn8N9TybRv2SdB12e61rx15njTxjrF0+oaprF5NIJLm4c7mIAYYGen+QPWFUIoA4A4FLRX8751xDmWbVfbZjWlUd21du0b78sdorRaRSWi7H9NZLw9luUUVQy2jGmrJOySbttzPeT31bb1YVxmveIdK1rR/EmveJ/EF74S+FXgqVbPWtU09VbUvEWoOu9NG03PAmZeZJuRCvJ5xnU+KfjH/hX3w31zWwqu2l2UtwinozKpKj8Tivlf/gpzqr/Dub4Z/CC0uZGsfAnhSy1fU1Lf8fetavBHqN3cP6vtnhiB7LCo9a/YPA3gfD5xjZ5hjY80KTSinqubdtrZ8qtZPS8k+lj8Z8duOMVlOEpZXgJuFStdyktGoLSyfTmd9VrZNdRuv/8ABST4i+IpJ/DXwcsbH4O+FooppobDwyoj1S6ijRnLXepEfarmXarEkuoJ6KOBWL4V/bU/aP8Ah94JtvHFj8VfHc+k3F+1lIt5q0t/btIoDbZYZy8bowJGGUg4II9dX9kr9nK80vwJL4vuYt2q+IoZNL0O3c4SMTKyNcv3wFDkDuoPqMeufFz4BxeFP2RpPBGhRNe3Dy20ELyABpZ5LmPMjY6csT7Cv2jPPFLK8Dm9PKcLGEk6sKcm101VVtv+RuCTe7U1sj8cyLwkxuMyipmmKUov2U6kV1b910lbvNKba6Jwe7M74C/tLaN+2T4nTT10/wAO/DH46XTf8SrUtLgFl4c8dy44sL60XENrcydI7mMKrOwVlGQ1ex/Dfx4vj7QpJZbO40vVLCeSx1TTbgFZ9NuoztkhcHkFWH4jFfmV438LXnww8f6hpMsjx3ujXbRCVcodyNw69xngg/Svu22/ai8JeJ/il4Q8Yt4j0aG/+JPgu3ufGUT3SK1p4gs5ZLSSWUZ+R7mKOOY5xuMhPNed4xcB4TNcp/tnLYXqxipRcVdyjo7d2uX3o31TXKtJWXb4O8b4vJc5WSY+dqE24tSekJq9mr7Xa5ZdNb9D2is/xT4W0/xt4futK1S2W80+9TZPCzECRcg4yCD1A71jQfHDwZckbPFnhxs9P+JjEP8A2arkHxR8M3OPL8RaFJnptv4j/wCzV/IccuzHDzVWNKcZRd0+WSaa2adtGj+wpZjl1eDpyqwlGSs1zRaae6avqmcTYfA27+AXiq38WfCGPS9G1qG3lsdQ0rUYzd6V4hspRiW0uYpNwZHH5EAjBAYbfwr/AGwo/wBn2w+zaDqH7Tf7PdzuJn0fwu0Hi3wwrE8tbQ3bo0SnqFLvjpuNdrb3Ed3CskUiSxuMq6MGVh6gin1+mcOeMucZbR+q46KxMe82+deTk78y7cybXRpaH5VxV4IZFnFb61hG8PJ78iXI/Pl0s/RpPqr6nOfEf9p3Vf2jf2dfib4i0/4//tNaz4k+HS6RdPba6Lbw/p06XeoRW5H2a1kZj8rseSB061/QpppLadbk8kxr/IV/Nl4h1Nvh34o+Kum+JPBnjHxH4H+LGm6Xa3GpeFbuFdS0V7K4WdXWKWN1ly0a5BKDB4bNfXX7Hv8AwVy+Jvgx5/8AhEvG0v7S3hnTIhcav4U8TaYnh74haHAn+se2RGaG/RVBJCs78AYUHNf0Xg8ZSz/LKGMwcoXaUnFNPlcoxvFtJJNSTXvcvkfyPxRw3icjzKtgq8JcsZNRlKLXMk9JLo7rXRs/ZqivOP2V/wBq7wP+2Z8H7Dxv4A1iPVtGvco6MPLubGZeHgnizmOVT1U+xGQQT6PXj1KcoScJqzXQ+fCiiioAK8l/bk/a00f9iH9l/wAU/EfWYXvF0S3C2VjGcSaleSEJb26+7yMoz2GT2r1qvy+/4LcftA2sf7VPgbQbyJNR8N/A7wvqHxe12wlOYLy8iP2TSIZB0Obx14PZzwa9DK8IsRiI02rrd+i6fPb1ZMnZHwZ8a/HXjbxB8XPEHhV9ckl+M3j23W++Lfi6CTdJ4es5lVofDVif+WAiTCzbOWb5CdsbBtr4bfCrQvhL4ej03QrCKzgXl3xmWdu7O/VifeuY/Zc8K3mm/Dg69rMhuvEnjS4k17Vbp+ZJ5Z2Mg3E8nAb8ya9Jr+ePFXjjEZrmVTL8PO2GovlSWilKOjk+6vpBbRja2rd/7j8I+AMNkmVU8bXgniaqUpSa1inqoLtZfF3d76JWKKKK/Jj9fCiiigDi/wBovQZvE3wL8V2VupeebTZtigZLELux+OK+bv8Agq5psXjD9qzwz4xtGzovxM8GeGtXspQcrgabb2cyg/7E9tKpHYqRX2IyhlIIyDwRXivir4YeH/HHgGL4IeNdSs/C0dvqU+qfC7xleIRZ6dPcEvPol7IP9Vbyy4dJDxG5LHhmx/Sn0feJaGGq18qqy5ZT96PnolK3drli7btc3Y/mX6Q3DderHDZ3Si5Qp3hPyTd4v0bbTfR27nrNj4Ys9G0vTLW3jEVvo6qtsg6KFjMYH/fJNef/AAO+Llt400Wwn1OQfbfFOoX01kh+ZFFvJhYx6FY1De5DHrXgP7XHxb+K3woh0Xwf4r0vWPCGv6RgailxbgJqEkThormGYZWSNgA2UYo2AQSDXg/wq8a6h4W8daXdQarNpy282Wm5cwxsf3hVefmZcjjk5x3rqybwKx9bKsRVzGslVk24WvJ2j7Tr2nNxnondLu9DNvHPL6eZ4eGWUm6KSUr2S972ey7wgpQ1aSb7LX2L/gpP4Rg0T4zafqcIVX1mwDzAd3jYpu/752j8K8puP2dvHFrrlvpj+F9XGoXemwaxFbiHMjWk6hoZsDkK6kEZ6gg96+srn4Px/EDxXb/G7442F54W+GOmbY/Dfhi4Hl6348kQkx21tAfnWF3IMtwV2KhIUs2K9S+E+l654i8QeJfiB4uhtrbxX49u1vbm0gTZDpVuq7LezjH8KRRhUC9goHavva/Gdfgrg3CUsWlPExioqLfW/wAOnSnDSTWl0lfU/PsLwrQ4340xc8C3HCuTlKaXlur9Zy1Setru2h+fk37OHj63GW8HeIgAM8WMh/kK6H4afCy58MrrX/CVfDrxXqxuLJorDybWWP7NOejnGMjp6/Q1+jVFfmGK+kXmOJouhVwkUnbWM5wejT0a1W33aH6phfo85dhqyr0sVJtX0lCElqrap6P/AD1PEP2CvBXiTwP8G5rfxFDd2nnXjS2dtc5EkMRVf4TyoLZOPx717fRRX4bxFndTN8zrZnVioyqycmo7L+ur6vU/buHslp5RltHLaUnKNKKinLd/10XRaBXD/Fb4J2njy4tdZ0y4n8P+MdGcXOk63YuYbq0nQ7kJZeSuQOPrjFdxRXLlWbYvLcVHGYGo4VI7Nfk+6fVPRrRnRmuU4TMsLPB46mp05KzT/Pya6Nap7Gp+wx+3vqnwG+J8vxnuLYaVLbatbeGfj14etNqW10Z3KWfii3gX5UJY7ZtmAX5AxLx+79jfQ6nZQ3NvIk1vcIssUiHKurDIIPcEGv5yr5dI+GP7UfhbW9agRvBXxKhl+HvjSPor2d8vlx3Ddt0L7ZVbqDCmOQK/Xn/gh98XdX8efsO23hLxPcyXPi34Pa1feAdWMhzJusJdkO7uf3BiGT12mv7JwWbUs8yahnVJWclaSXRq6a9E1p/dlBH+fHGnDM+H86rZXJ3jF3i+8XrF+ttH5pn2DRRRXMfLhX4Kf8FiPGUuq/FP9su8Lkz3us+CPA8Lddlv5cl26D0Be2UkdyK/euvwK/4K6+HZrD4hftjRENnTPHPgfxK49YHtLiDd9A0yj8RX0fDelebW9lb/AMDiOKTnFS2vqVNIsk03SbW2jUKlvCkagdAAoAH6VYqO0nFzaxSKQVkQMCO4IzUlfwfUcnJuW5/p5TUVFKOwUUUVBYUV67+wf4e8PeKv2tfBen+KYoJ9HuLtw0U+DFLKInMKMDwQZRGMHg5wetfZnxU+GHhF/jd4le88B6Vpl/J8NdWu5LWXTovs3n28yCOeLAKb9jfeX5gAM4r6nKOF6mPwjxcaiilLls0+yd/xVu+vY+B4j49o5RmMcunRlNunz3TSW7VtdXs2300XU/Nas3xZ4Q0zx1oM+l6vZQahYXIxJDMu5T6H2I7Ecivtj49+BPDHif8Abw+FOi32kWdj4b1LRNKa5gghWGO7D+a5Y+Xgnc2FJ6nFe3al8K/hv48+I/grx6/g7RLa0t7TX4XsEjjjtLyTT5/JtyyYCsxCyEAjPTOdtehgeEcQ69SWHrqMqU0k9U943krbcrkrdX02PIzPxKwlLD0frOFlKNenKTXutbTag77uShK+llpfc/Iux8IfEf4c+Dk8MeE/H0Oo+CYHL2/hPxno9t4j0i1BOSkSXSSeUOTygDc9c81BoS/FvQtYgu9Bs/gF8O72AjGp+GvANm1+pHRkkniYxN3zGVPFfYP/AAUH8OR2Pxa0vWIPA914Cj8QaTDdS2MiRRxyzjKyPGkbMFX7o52kkEkc8+7/ALCfwN0vxN+wD8QbzU9Hsp9T1yLVF0u6lskkuI1jtFXMbkFgBIp6EcivvMq474tli6mUxxMZOCk+aVOLbSWl7pNt6ayu7vqfC57wfwVSyyjxBVwbSqyiuSNRpJydn8LatGz+Gysuh+a2h/BX7X8QZ/GnjLX9b+IPji6IL63rtw1zPGBnCxgkhFGeAOg4GBxXcV9wfFT4YWd18MNA+I8GkWNvo918OrO2uHgtVSBbySURkuFGNxLAZI/Hg13v/CtfCvhj9vfRdD1D4feEvD/gvTtCu7i0u306NYtYZoYDI8hbKv5bEqvGRvI718nmuTZpm2K+sZjiXOTcIpyT+GbfK0lpGKs9FZX0WrPqcq40yjKMH9WyzB8kYxqycYtfFSS5ou+spvmj3dtXoj84qK/TjxT+zVonwk+NryJZaBd6Nqvh/wARahbWTWClLbDQzL97K/KXIXaBtHArntf+GmgQaP4z1nRvh94S8Y6zonhHw/PYWD6dHMm+VZRNIUTGTs+YnOflHoK5KvAWIptxnVSaburN7R5tLXvdbLc6KHi9g6yjOlQbjJRafMlrKap2d0krN6tuyV9z86KKDyfSivgT9eCiiigDyr9tTTDqH7OWvTJxLpxhvY2HVWjlU5/LNfpj/wAEbfHBv/23f2jLWJgtp4u0rwl44EQPyi4vtLWSdwPVmcEnvgV+a/7Yt+LD9mvxWSQDLarCvuWkVcfrX6J/8EY/DM2nft2/GoPknw54B8CaDOQMATx6RHvU+4KEV/Uvg7KT4UxMZ7KpK33Ub/ofxv8ASHhBcQYeUd3SV/8AwOdj9MaKKK+rPwcK/Jn/AILS/s53GrftmXumWUYFt+0t8NLzwrCG+WNtf0mVNQsMk8b5BGkK/wC8a/WavnL/AIKkfsf6h+2H+yzeaf4YmSw+Ivg+9h8UeC9Q3+W9lq1od8WH/h3jdGSeBvyelenlGKVDExk3ZPS/bs/k7P5EyV0fiv8Asy+Pf+Fh/BXRLuQNHe2cIsL2Nhhop4fkcEdicZ/Gu9ryfxt4kh+G3jK8+LWlaVPpXgLxtqRsPHOiAEzfD7xSuRdRyxAZS3ncNJE3QqSvBj216jpeqW2t6dDd2c8Vza3KCSKWJgySKRkEEdRX8xeJvCFbJM4qSUGqFVuUH011cL94vS3VWls0f3x4W8aYfP8AJaXvr29JKNSPW6VlK3aW99r3XQnooor85P0o1vA3iZPB3i6w1OSyttRjs5RI1tOoKTDoQeDg+h7HB7V7TfftuXcvi2+kt21eHR4vCd14X05ZZRPdLHNtbdIzHGS6jJXB2gDnv4BRXoYTNMThoOFGVk3c8fMchwWOqKrioczSaXo/La/n2bPa/GHx08JeKfD/AId1iVvGdz468NR2VpatcTxPYGCDazD5izqdxlCgAjlTjqK6T4h/tm6PJF8PtL8Nadff2D4Va/ub2LUArvczXssjS42kAhVc4+7y3TivnCiupZ/i483I0ua12lq7NP8AFpX72R58uEMuk4e0UpKDk0m9FzRcWrdkpSt2cmz0z9pb48n42an4dt4BMdM8KaTFpFnLMCJrlVyWlkyzfMxPr0ArrPgf+2xrXwUsfCun2esa62jaTFeJfabhTbSmbdtCqWKuATn5gCCTivB6Kyp5zi4Yl4uE7TdtV5NNL00S9DorcMZdVwMcuq01KlG9k7PVppvXr7zd11PoDxp+2mvif9iPQvhbHa38Oo6dqBlubrKiCW2WWSWONcHdkMydRj5BzUHjT9p/RvEvxG07xCl54zmnSymsrpbuVJUiRoBGBCpkOAzctlvoD28GorWpxBjJ255XsoJekPh/NnPR4Pyylzeyg1zSqSeu7q25/wAlbtY+wbP/AIKW6Xen4cNrOi6tqL+H9CvNA8QHdGrXkc8cUfmQncfn/dAndtzkjPOa4q7/AGqvCK6vr1jpx8faX4bv9IsNJt2hu4xfSJbBxmQhlQAhtu0bhjPrXznRXTV4qzCpb2kk/kr/AAqO++qWvnqcWH8P8noN+xg436KTt8bqJ22upN28tOiH3BjNw5iDLEWOwMcsBnjJ9aZRRXzh9qlYKKK5r4ofFrQvhB4dk1LXL2O2jHEUQO6a4bsqL1Yn/wDXXThMHXxVaOHw0HOcnZJK7b8kjnxeLoYWjLEYmahCKu23ZJebZg/FXwg3x6+Lfw4+FNu4jPi7XIbrVJicLZaZbHzrqdz2VY1Zv+AGv1X/AOCFWgyeNfgv8SvjRdwPDc/G/wAc6hrdmrrgxaZA5trOP6KqPj2Ir8uv2ff2f/G/xb8Zro0drPYfGj9oKyGl6XZM+W+H3gp8G91C6HWKW5jJREI3NG8h48xQf6BPg18J9F+BHwn8OeC/DtqllofhbToNMsYVH3IokCLn1JxknuSTX9kZFkn9gcPUcqm/3svenbu3d/JWjFPryN7M/wA/vEbiqPEOf1sfS/hq0Yf4Y7P5u8vK9jpaKKKR8QFFFFAHw5/wUI/4JT6h8VfHOq/FH4NXPh/RfiBrNkbDxR4f1y28/wAOfECzC8W97EPuSggbZl+YEDlThx+Uvxc/Zhi/Zz15W1LTPjr+y4JJRHdw6log8YeDUnZgoEF5FIskcbMRtDJK3ON1f0e18Xf8HAug6h4l/wCCWnjq00vTr/Vb1r7SXS1srdp55AupW7Haigk4AJ4HavdwGMjieTAYyEalOTS95J6bappxdul07dGjfCY3E4Or9YwlSVOa6xbi/vVmfjd4k+N/iH9m343+O/hx4ztdW8dal4L1P7ANV8OaOTFcDaCS6Fxtznjj1p//AA2lp/8A0IfxN/8ABIP/AI5Xp/xs+EvhX4zfHjxl8RNJtv2y/Dknja+/tG4i0r4Wh7SBtgGNzThnAwcHA+lcNZeDtbj8YQaB4G+NB1fxLeZFn4W+KXg6bwhe3r9ooblne3eQ9AHmjyeAK+Iz/wAKMFiK88VgsJT1SfL7SpT1sr2UabhHW/VI/deGPGbEUcLTwuY4uopLRy9lCp1drtzUnp5NmT/w2lp//Qh/E3/wSD/45R/w2lp//Qh/E3/wSD/45XI6F+0V8VNT1XVdNv7PwD4d1nRL6TTb7TdYuJbS7t50OGUozevHHcV2P9q/HT/oF/D/AP7/AM/+Nfm2Y8J5fgKroY3C0qcl0li2v/bD9ay7ivH4+iq+CxVWpB9Y4VP8pDP+G0tP/wChD+Jv/gkH/wAco/4bS0//AKEP4m/+CQf/AByn/wBq/HT/AKBfw/8A+/8AP/jR/avx0/6Bfw//AO/8/wDjXB/Y+R/8+qH/AIWf/anf/a+d/wDP2t/4Sf8A2wz/AIbS0/8A6EP4m/8AgkH/AMco/wCG0tP/AOhD+Jv/AIJB/wDHKf8A2r8dP+gX8P8A/v8Az/40f2r8dP8AoF/D/wD7/wA/+NH9j5H/AM+qH/hZ/wDah/a+d/8AP2t/4Sf/AGwz/htLT/8AoQ/ib/4JB/8AHKP+G0tP/wChD+Jv/gkH/wAcp/8Aavx0/wCgX8P/APv/AD/40f2r8dP+gX8P/wDv/P8A40f2Pkf/AD6of+Fn/wBqH9r53/z9rf8AhJ/9sM/4bS0//oQ/ib/4JB/8co/4bS0//oQ/ib/4JB/8cp/9q/HT/oF/D/8A7/z/AONRX/iT426XZyXNzY/Dq3t4VLSSy3UyIgHcknAFOOTZJJqMaNBt/wDUZ/8AailnGdRXNKtWSX/UJ/8AbDv+G0tP/wChD+Jv/gkH/wAco/4bS0//AKEP4m/+CQf/ABysPwR8WvjL8UPi1Y+C/DGnfD3XNVurWW/uJ7a+YWOlWsYzJcXVw8ixwxoASWY+g6kA9d4f8FQ+P76eK9+OXxC8X3sMhilsvhL8M7jV7CNh1VL6Z4BJj1VGB6hjX2mWeFMMXFVZYKEYNXT+sVJXW20ab7dbLsfCZx4vwwE3ReNnKotHFYeCt6uVRfhcyPCHxL1b9pjxH44jtfE1/wDCDwn8PPC//CSaxf6j4ea91OWP7TDb7YoBIBktOm35h0OSO30P+xv/AME1/HPxc1LS9e+Gfwq1ix1AoLg/FH43Ms7LuAKyaboke9UfoyNM0yjj5gcGvIfFPwr0T4LfBX4ySaVof7VPiTxV8Q/B6+GrY+K/hy1lbx4v7W53tMkrkAC3IA2/xda/oM/Z8ge1+AvgmKVHjkj0GxV0YYZSLdAQR2NfrODyrBcPYGnTy+hCEno2lq7JXbk0pS1b+LTyP574p4tzHPMXOriq85wveMW7JLpaKbivl955X+wb/wAE8vDP7EGg6rfDU9S8afEXxa63Pinxjq7F7/W5xycZJ8qEEnbGCQBjJYjNfQdFFeRWrzqzdSo7tnzKVgooorIYUUUUAFBGaKKADFeHf8FE/wBjnTf25P2SPGXgGex0WXWdU0+QaJe6hCGGmXwGYZ1cKXjwwGWTnaWHIJB9xorSjVlSqKpB2ad0DR/PV+1X+yh4/wDjBoHxl8Naz8K/CHjD48fCjXPCkE2u+BNPvp9Q1u3ntJmllnEjtvbZDBucRp82485qt/Z/x3/6Ni+NH/glm/8AiK/XD9oL/gi58Bv2m/jVrnxA8VaL4jfxP4jMRv7ix8RXlkk3lRLEnyROqjCKB09fWuQ/4h7P2av+gP44/wDCx1H/AOO115/l2QZ7Cl/a1OU3TTtbmVuZR5kuWotLxutND6rhbjfOeHVVjlVRQVS3NeMZX5b23Ttuz8vv7P8Ajv8A9GxfGj/wSzf/ABFH9n/Hf/o2L40f+CWb/wCIr9Qf+Iez9mr/AKA/jj/wsdR/+O0f8Q9n7NX/AEB/HH/hY6j/APHa+b/4h9wT/wBA8vvn/wDLT6z/AIjdxh/0ER/8Ah/8ifl9/Z/x3/6Ni+NH/glm/wDiKP7P+O//AEbF8aP/AASzf/EV+oP/ABD2fs1f9Afxx/4WOo//AB2j/iHs/Zq/6A/jj/wsdR/+O0f8Q+4J/wCgeX3z/wDlof8AEbuMP+giP/gEP/kT8vv7P+O//RsXxo/8Es3/AMRR/Z/x3/6Ni+NH/glm/wDiK/UH/iHs/Zq/6A/jj/wsdR/+O0f8Q9n7NX/QH8cf+FjqP/x2j/iH3BP/AEDy++f/AMtD/iN3GH/QRH/wCH/yJ+X39n/Hf/o2L40f+CWb/wCIrnvix8PPj38RfhrrehQ/s0/GS2l1W0e2SV9DmKxlhjJASv1i/wCIez9mr/oD+OP/AAsdR/8AjtH/ABD2fs1f9Afxx/4WOo//AB2ujCcD8G4avDEUaElKDUlrPdO6/wCXvcwxXjLxZiKM8PVrxcZpxfuQ2as/s9j8+/g//wAE/wDxT8avGkn7P3gXwV8NvhwkPgLwjqvxG1LUbe/t/EWpJK8FzdWZcOyLunhyyGNPugE1+5PgPwBonwv8I6foHh3SdO0PRdLhW3tLGxt0gt7eNRgKqKAAK8W/Y5/4JjfCT9hHxdr2u/DvStYstU8SWsVnfz3+sXF+0sUbFkUeazYwSelfQNfS5vmX1qajBvlXfRt2V29X2012Py6MbBjNAGKKK8coKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==">
            <p>2530A ISAGANI ST. STA CRUZ MANILA</p>
            <p>Contact Number: 0922 782 3014</p>
            <hr>
            <p class="date-time">${dateTime}</p>
            <h5>ORDER NUMBER: ${currentTransactionNumber}</h5>
            <table>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                </tr>
                ${cart.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>₱${item.price.toFixed(2)}</td>
                    </tr>`).join('')}
            </table>
            <hr>
            <h4>Discount: ₱${discountAmount.toFixed(2)}&nbsp;Total: ₱${finalPrice.toFixed(2)}</h4>
            <hr>
            <p>Thank you for dining with us!</p>
            <p>xxxxxxxxxxxxxxxxxxxxxxxxxxx</p>
        </div>
    </body>
    </html>
`;
        // Open the print dialog
        const printWindow = window.open();
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        printWindow.print();
		
		printWindow.close();
        // Update daily sales and reset cart
        dailySales += finalPrice;
        updateDailySales();
        resetWindow(); // Clear cart after transaction
		
    } catch (error) {
        console.error("Error printing receipt: ", error);
        alert("There was an issue with printing the receipt. Please try again.");
    }
}
	
	function updateCart() {
    const cartItemsElement = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const duplicatedTotalPriceElement = document.getElementById("duplicated-total-price"); // Reference for duplicated total price
    const discountAmountElement = document.getElementById("discount-amount");

    // Clear the current list
    cartItemsElement.innerHTML = "";

    // Add items to the list with a remove button
    cart.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} - ₱${item.price.toFixed(2)} `;

        // Create remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.onclick = () => removeProduct(index);

        // Append the remove button to the list item
        listItem.appendChild(removeButton);

        // Append the list item to the cart
        cartItemsElement.appendChild(listItem);
    });

    // Calculate the total price with or without discount
    let finalPrice = totalPrice;
    let discountAmount = 0;
    if (discountApplied) {
        discountAmount = totalPrice * 0.2; // 20% discount
        finalPrice = totalPrice - discountAmount;
    }

    // Display the total price (with discount if applied)
    totalPriceElement.textContent = `₱${finalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Display the duplicated total price
    duplicatedTotalPriceElement.textContent = `₱${finalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Display the discount amount if a discount is applied
    if (discountAmount > 0) {
        discountAmountElement.textContent = `Discount Applied: ₱${discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
        discountAmountElement.textContent = `Discount : ₱${discountAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

