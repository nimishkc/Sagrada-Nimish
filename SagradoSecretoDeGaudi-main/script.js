//Augus' part on overall website functionality

//Architectural view: accessibility tabs
document.addEventListener("DOMContentLoaded", function() {
    const labels = document.querySelectorAll('.tabs label');
    const tabContents = document.querySelectorAll('.tabs .tab-content');

    // Set initial text color for all labels
    labels.forEach(lbl => {
        lbl.style.color = '#fff';
    });

    // Function to handle tab click
    function handleTabClick(label) {
        const tabContent = label.nextElementSibling;
        const isVisible = tabContent.style.display === 'block';

        // Reset all tab contents to be hidden and label backgrounds to original color
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        labels.forEach(lbl => {
            lbl.style.background = '#223581';
            lbl.style.color = '#fff';
        });

        // Toggle display of the clicked tab content and change label background
        if (!isVisible) {
            tabContent.style.display = 'block';
            label.style.background = '#E7E0DA';
            label.style.color = '#000'; // Change text color to white for the clicked label
        }
    }

    //event listeners for click and hover colors
    labels.forEach(label => {
        // Only apply hover effect to labels with ID starting with "tabs"
        if (label.getAttribute('for').startsWith('tab')) {
            label.addEventListener('click', function() {
                handleTabClick(this);
            });

            label.addEventListener('mouseover', function() {
                if (this.nextElementSibling.style.display !== 'block') {
                    this.style.background = '#007BFF';
                }
            });

            label.addEventListener('mouseout', function() {
                if (this.nextElementSibling.style.display !== 'block') {
                    this.style.background = '#223581';
                }
            });
        }
    });

    // Closing tabs if clicked outside of tabs area
    document.body.addEventListener('click', function(event) {
        const isInsideTabs = event.target.closest('.tabs');
        if (!isInsideTabs) {
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            labels.forEach(label => {
                label.style.background = '#223581';
                label.style.color = '#fff';
            });
        }
    });
});






//About us banner
document.addEventListener('DOMContentLoaded', function() {
    const expandButtons = document.querySelectorAll('[expand-btn]');
    const expandedOverlays = document.querySelectorAll('.expanded-overlay');

    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const overlayId = button.getAttribute('expand-btn');
            const overlay = document.getElementById(overlayId);
            toggleOverlay(button, overlay);
        });
    });

    function toggleOverlay(button, overlay) {
        const isOpen = overlay.classList.contains('active');
    
        closeAllOverlays(); // Close all overlays first
    
        if (!isOpen) {
            overlay.classList.add('active');
            button.setAttribute('aria-expanded', 'true');// marina added: aria accessibility
            button.textContent = '-';
            button.style.color = '#fff';
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Change button color to black when clicked
            overlay.style.opacity = '0'; // initial opacity 0
            overlay.style.transform = 'translateY(100%)';
            overlay.offsetHeight; // Trigger reflow to ensure CSS transition will be applied, otherwise no ease in effect
            overlay.style.opacity = '1'; // Fade in effect
            overlay.style.transform = 'translateY(40%)'; // Slide the overlay into view from the bottom (height to 40%)
    
            // Move the member image upwards by 40% with ease-in effect
            const memberImage = button.parentElement.querySelector('.member-photo');
            memberImage.style.transition = 'transform 0.5s ease-in-out';
            memberImage.style.transform = 'translateY(-25%)';
    
            // Hide the h1 and h2 elements
            const headlines = document.querySelector('.headlines');
            headlines.style.opacity = '0';
        }
    }
    
    function closeAllOverlays() {
        expandedOverlays.forEach(overlay => {
            if (overlay.classList.contains('active')) {
                overlay.style.opacity = '0'; // Start the fade-out animation
                overlay.style.transform = 'translateY(100%)'; // Start the slide-out animation
                setTimeout(() => {
                    overlay.classList.remove('active'); // Remove the active class after the animation completes
                }, 500); // Adjust the timeout to match the duration of the transition
            }
        });
        // Show the h1 and h2 elements
        const headlines = document.querySelector('.headlines');
        headlines.style.opacity = '1';
    
        // Move the member images back to their original positions with ease-out effect
        expandButtons.forEach(button => {
            const memberImage = button.parentElement.querySelector('.member-photo');
            memberImage.style.transition = 'transform 0.5s ease-in-out';
            memberImage.style.transform = 'translateY(0)';
            
            button.textContent = '+';
            button.style.color = '#fff';
            button.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Reset button color to white
        });
    }
        
    
});


// Interactive Timeline Scroller
// Timeline
const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".timeline-container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    let maxThumbPosition;

    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;
        maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;

        // Update thumb position on mouse move
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;
            // Ensure the scrollbar thumb stays within bounds
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;

            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        };
        // Remove event listeners on mouse up
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        // Add event listeners for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

    // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
        const scrollPosition = imageList.scrollLeft;
        slideButtons[0].style.display = scrollPosition <= 0 ? "none" : "flex";
        slideButtons[1].style.display = scrollPosition >= maxScrollLeft - 1 ? "none" : "flex";
    };

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    };

    // Call these functions when image list scrolls
    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });

    // Initialize slider on window resize and load
    const initSliderResize = () => {
        maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
        updateScrollThumbPosition();
        handleSlideButtons();
    };
    window.addEventListener("resize", initSliderResize);
    window.addEventListener("load", initSliderResize);
};

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);


// Button redirect
function redirectToPage(url) {
    window.location.href = url;
}


// Blog modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const openPopupButtons = document.querySelectorAll('[data-popup-target]');
    const closePopupButtons = document.querySelectorAll('[data-close-button]');
    const popupOverlay = document.querySelector('.pop-up-overlay');

    openPopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = document.querySelector(button.dataset.popupTarget);
            openPopup(popup);
        });
    });

    popupOverlay.addEventListener('click', () => {
        const popups = document.querySelectorAll('.pop-up.active');
        popups.forEach(popup => {
            closePopup(popup);
        });
    });

    closePopupButtons.forEach(button => {
        button.addEventListener('click', () => {
            const popup = button.closest('.pop-up');
            closePopup(popup);
        });
    });

    // marina added: keyboard accessibility for popup modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const popups = document.querySelectorAll('.pop-up.active');
            popups.forEach(popup => {
                closePopup(popup);
            });
        }
    });

    function openPopup(popup) {
        if (popup == null) return;
        popup.classList.add('active');
        popupOverlay.classList.add('active');
        trapFocus(popup); 
    }

    function closePopup(popup) {
        if (popup == null) return;
        popup.classList.remove('active');
        popupOverlay.classList.remove('active');
    }

     //marina added: keyboard accessibility for popup trapping
     function trapFocus(popup) {
        const focusableElements = 'button, a';
        const firstFocusableElement = popup.querySelectorAll(focusableElements)[0];
        const focusableContent = popup.querySelectorAll(focusableElements);
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        popup.addEventListener('keydown', function(e) {
            let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey) { // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            } else { // if tab key is pressed
                if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        });

        firstFocusableElement.focus();
    }


});



// Burger menu functionality
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
     //marina added: change the "aria-expanded" attribute
    var menuToggle = document.querySelector('.menu-toggle');
    var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
}

function closeMenuOnClickOutside(event) {
    var menu = document.querySelector('.menu');
    var menuToggle = document.querySelector('.menu-toggle');    
    
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        menu.style.display = 'none';
    }
}

document.addEventListener('click', closeMenuOnClickOutside);

// Marina added: keyboard events for screen reader
document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab') {
        var menu = document.querySelector('.menu');
        var menuToggle = document.querySelector('.menu-toggle');
        if (!menu.contains(document.activeElement) && document.activeElement !== menuToggle) {
            menu.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }
});

// Review Slider functionality
let currentReviewIndex = 0;
const totalReviews = document.querySelectorAll('.review-slide').length;
const slider = document.querySelector('.review-slider');
const slideWidth = document.querySelector('.review-slide').offsetWidth;

function showReview(index) {
    const offset = -index * slideWidth;
    slider.style.transform = `translateX(${offset}px)`;
}

function nextReview() {
    currentReviewIndex = (currentReviewIndex + 1) % totalReviews;
    showReview(currentReviewIndex);
}

function prevReview() {
    currentReviewIndex = (currentReviewIndex - 1 + totalReviews) % totalReviews;
    showReview(currentReviewIndex);
}

document.querySelector('.next-btn').addEventListener('click', nextReview);
document.querySelector('.prev-btn').addEventListener('click', prevReview);

showReview(currentReviewIndex);


// Contact form functionality
document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();

    if (name === '' || email === '' || message === '') {
        alert('Please fill out all fields.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    this.reset();
});

        // If all validations pass, form submission
        //next steps: data to server using AJAX xample:
            // const formData = new FormData(this);
            // fetch("submit.php", {
            //     method: "POST",
            //     body: formData
            // })
            // .then(response => {
            //     // Handle response
            // })
            // .catch(error => {
            //     // Handle error
            // });
        //BUT: need server-side code (like PHP) to handle form submissions and process the data

   



