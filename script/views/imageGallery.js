'use strict';

class ImageGallery {

    constructor() {

    }

    appendImage(image, targetSize) {
        const imgSrc = image.getImageUrlForSize(targetSize);
        if (imgSrc) {
            let div = document.createElement("div");
            div.className = 'thumbnail';
            // let txt = document.createTextNode(image.title);
            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("alt", image.title);
            div.appendChild(img);
            document.getElementById("photo-gallery").appendChild(div);
        }
    }
}