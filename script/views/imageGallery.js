'use strict';

class ImageGallery {
    
    constructor() {
        this.stickyHeader = document.getElementsByClassName("sticky-header")[0];
        this.photoContainer = document.getElementsByClassName("photo-container")[0];
        this.photoGallery = document.getElementsByClassName("photo-gallery")[0];
        this.preview = document.getElementsByClassName("preview")[0];
        this.previewImage =  document.getElementsByClassName("preview-image")[0];
        this.arrowLeft = document.getElementsByClassName("arrow-left")[0];
        this.arrowRight = document.getElementsByClassName("arrow-right")[0];        
        this.imageTitle = document.getElementsByClassName("image-title")[0];

        this.preview.addEventListener("click", () => this.closePreview());
        this.arrowLeft.addEventListener("click", (e) => this.showPrevious(e));
        this.arrowRight.addEventListener("click", (e) => this.showNext(e));

        this.previewIdx = null;
        this.colNum = this.getColumnNum();
        this.setGalleryWidth();

        // listen to window resize
        const LazyResizeWaitInMilliseconds = 300;
        window.addEventListener("resize", debounce(() => this.handleResize(), LazyResizeWaitInMilliseconds), false);

        // listen to window scroll
        const originOffsetTop = this.stickyHeader.offsetTop;
        window.onscroll = () => {
            let scrollTop = window.pageYOffset;
            if(scrollTop > originOffsetTop){
                this.stickyHeader.classList.add("sticky");
            } else { 
                this.stickyHeader.classList.remove("sticky");
            }
        }

        this.search();
    }

    handleResize() {
        const newColNum = this.getColumnNum();
        if (this.colNum !== newColNum) {
            this.colNum = newColNum;
            this.setGalleryWidth();
            this.photoGallery.innerHTML = "";
            imageCollection.rearrangeImages();
        }
    }

    appendImage(image, targetSize) {
        const imgSrc = image.imageMeta.source;//image.getImageUrlForSize(targetSize);
        if (imgSrc) {
            let div = document.createElement("div");
            div.className = 'thumbnail';
            div.addEventListener("click", () => this.openPreview(imgSrc, image.title, image.index));
            // let txt = document.createTextNode(image.title);
            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("alt", image.title);
            img.style.top = image.y + "px";
            img.style.left = image.x + "px";
            div.appendChild(img);
            this.photoGallery.appendChild(div);
        }
    }

    openPreview(imageSrc, imageTitle, index) {
        this.previewIdx = index;
        this.previewImage.setAttribute("src", imageSrc);
        if (imageTitle) {
            this.imageTitle.innerHTML = imageTitle;
            this.imageTitle.classList.remove("hidden");
        } else {
            this.imageTitle.classList.add("hidden");
        }
        
        this.preview.classList.remove("hidden");
    }

    closePreview() {
        this.preview.classList.add("hidden");
    }

    showPrevious(e) {
        e.stopPropagation();
        const nextIdx = this.previewIdx - 1, // > 0 ? this.previewIdx - 1 : 0,
            x = ~~(nextIdx / this.colNum),
            y = nextIdx % this.colNum,
            preImg = imageCollection.images[x] && imageCollection.images[x][y];
        if (preImg) {
            const imgSrc = preImg.imageMeta.source;//preImg.getImageUrlForSize("Medium"); // TODO
            this.openPreview(imgSrc, preImg.title, preImg.index);  
        } 
    }

    showNext(e) {
        e.stopPropagation();
        const nextIdx = this.previewIdx + 1,// < imageCollection.images.length ? this.previewIdx + 1 : imageCollection.images.length - 1,
            x = ~~(nextIdx / this.colNum),
            y = nextIdx % this.colNum,
            nextImg = imageCollection.images[x] && imageCollection.images[x][y];
        if (nextImg) {
            const imgSrc = nextImg.imageMeta.source;//preImg.getImageUrlForSize("Medium"); // TODO
            this.openPreview(imgSrc, nextImg.title, nextImg.index);  
        }   
    }

    getColumnNum() {
        const containerWidth = this.photoContainer.offsetWidth;
        const imgWidth = globalConfig.size.width;
        const imgGap = globalConfig.size.gap;
        let colNum = ~~(containerWidth / (imgWidth + imgGap));
        if ((colNum + 1) * imgWidth + colNum * imgGap <= containerWidth) {
            colNum += 1;
        } 
        
        return colNum;
    }

    setGalleryWidth() {
        this.photoGallery.style.width = this.colNum * globalConfig.size.width + (this.colNum - 1) * globalConfig.size.gap + "px";
    }

    search() {
        // get vars
        var searchEl = document.querySelector("#input");
        var labelEl = document.querySelector("#label");

        // register clicks and toggle classes
        labelEl.addEventListener("click",function(){
            if (searchEl.classList.contains("focus")) {
                searchEl.classList.remove("focus");
                labelEl.classList.remove("active");
            } else {
                searchEl.classList.add("focus");
                labelEl.classList.add("active");
            }
        });

        // register clicks outisde search box, and toggle correct classes
        document.addEventListener("click",function(e){
            var clickedID = e.target.id;
            if (clickedID != "search-terms" && clickedID != "search-label") {
                if (searchEl.classList.contains("focus")) {
                    searchEl.classList.remove("focus");
                    labelEl.classList.remove("active");
                }
            }
        });

        const element = document.querySelector('form');
        element.addEventListener('submit', event => {
            event.preventDefault();
            // actual logic, e.g. validate the form
            console.log('Form submission cancelled.');
            this.searchImages();
        });
    }

    searchImages() {
        const searchTerm = 
        this.photoGallery.innerHTML = "";
        imageCollection.searchImages(document.querySelector("input").value);
    }
}