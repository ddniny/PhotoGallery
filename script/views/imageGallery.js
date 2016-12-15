'use strict';

class ImageGallery {

    constructor() {
        this.photoGallery = document.getElementsByClassName("photo-gallery")[0];
        this.preview = document.getElementsByClassName("preview")[0];
        this.previewImage =  document.getElementsByClassName("preview-image")[0];
        this.preview.addEventListener("click", () => this.closePreview());
    }

    appendImage(image, targetSize) {
        const imgSrc = image.getImageUrlForSize(targetSize);
        if (imgSrc) {
            let div = document.createElement("div");
            div.className = 'thumbnail';
            div.addEventListener("click", () => this.openPreview(imgSrc, image.title));
            // let txt = document.createTextNode(image.title);
            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("alt", image.title);
            div.appendChild(img);
            this.photoGallery.appendChild(div);
        }
    }

    openPreview(imageSrc, imageTitle) {
        this.previewImage.setAttribute("src", imageSrc);
        this.preview.classList.remove("hidden");
    }

    closePreview() {
        this.preview.classList.add("hidden");
    }
}