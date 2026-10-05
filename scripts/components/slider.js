import { getSlider } from "../services/sliderService.js";




function createSlider() {

    const sliderData = getSlider();  // get data from service

    const slider = document.createElement("section");  // section element

    slider.classList.add("brand-slider");


    const viewport = document.createElement("div");  // div element

    viewport.classList.add("slider-viewport");


    const track = document.createElement("div");  // div element

    track.classList.add("slider-track");


    sliderData.forEach(data => {

        const slide = document.createElement("div");  // div element

        slide.classList.add("brand-slide");


       const image = document.createElement("img");

        image.alt = data.alt;
        image.src = data.image;


        // Slide content
        const content = document.createElement("div");  // div element

        content.classList.add("slide-content");


        const brandName = document.createElement("span");  // span element

        brandName.classList.add("brand-name");

        brandName.textContent = data.brand;


        const title = document.createElement("h1");  // h1 element

        title.textContent = data.title;


        const description = document.createElement("p");  // paragraph element

        description.textContent = data.description;


        content.append(brandName, title, description);


        slide.append(image, content);

        track.append(slide);

    });


    viewport.append(track);

    slider.append(viewport);


    // ================= SLIDER BUTTONS =================

    const leftButton = document.createElement("button");  // button element

    leftButton.classList.add("slider-btn", "left");

    leftButton.type = "button";

    leftButton.textContent = "‹";


    const rightButton = document.createElement("button");  // button element

    rightButton.classList.add("slider-btn", "right");

    rightButton.type = "button";

    rightButton.textContent = "›";


    slider.append(leftButton, rightButton );


    // ================= SLIDER LOGIC =================

    let currentSlide = 0;

    function showSlide() {

        track.style.transform = `translateX(-${currentSlide * 100}%)`;

    }


    function nextSlide() {

        currentSlide++;

        if (currentSlide >= sliderData.length) {

            currentSlide = 0;
        }

        showSlide();

    }


    function previousSlide() {

        currentSlide--;

        if (currentSlide < 0) {

            currentSlide = sliderData.length - 1;
        }

        showSlide();

    }


    leftButton.addEventListener("click", previousSlide);

    rightButton.addEventListener("click", nextSlide);


    setInterval(nextSlide, 3000);


    return slider;
}



export function loadSlider(sliderContainer) {

    const sliderStructure = createSlider();  // calling the function

    sliderContainer.append(sliderStructure);

}