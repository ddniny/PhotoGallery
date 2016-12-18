'use strict';

/**
 * A view class for image gallery. 
 * Responsible for manipulating dom elements and communicating with model classes.
 */
class ImageGallery {
    
    constructor() {
        // find dom elements
        this.app = document.getElementById("app");
        this.stickyHeader = document.getElementsByClassName("sticky-header")[0];
        this.searchEl = document.getElementById("search-input");
        this.labelEl = document.getElementById("search-label");
        this.searchForm = document.getElementById("search");
        this.photoContainer = document.getElementsByClassName("photo-container")[0];
        this.errorMsg = document.getElementsByClassName("error-message")[0];
        this.loader = document.getElementsByClassName("loader")[0];
        this.photoGallery = document.getElementsByClassName("photo-gallery")[0];
        this.preview = document.getElementsByClassName("preview")[0];
        this.previewImage =  document.getElementsByClassName("preview-image")[0];
        this.arrowLeft = document.getElementsByClassName("arrow-left")[0];
        this.arrowRight = document.getElementsByClassName("arrow-right")[0];        
        this.imageTitle = document.getElementsByClassName("image-title")[0];

        // initialize non-dom inistance variables
        this.isShowingLoader = true;
        this.LazyResizeWaitInMilliseconds = 300;
        this.previewIdx = -1; // the index of an image that is currently opened in preview
        this.initHeaderOffset = this.stickyHeader.offsetTop;
        this.colNum = this.getColumnNum();
        this.setGalleryWidth();
        
        // register event listenters 
        this.registerEventsHandler();

        // show loader before getting any data
        this.showLoader(true);
    }

    /**
     * Register event listeners on elements.
     */
    registerEventsHandler() {
        // register clicks and toggle classes
        this.labelEl.addEventListener("click", () => this.onSearchIconClicked());
        this.app.addEventListener("click",(e) => this.onGalleryClicked(e));
        this.searchForm.addEventListener("submit", (e) => this.onSearchFormSubmit(e));
        this.preview.addEventListener("click", () => this.closePreview());
        this.arrowLeft.addEventListener("click", (e) => this.showPreOrNextImg(e, -1));
        this.arrowRight.addEventListener("click", (e) => this.showPreOrNextImg(e, 1));
        // listen to window resize
        window.addEventListener("resize", debounce(() => this.onWindowResize(), this.LazyResizeWaitInMilliseconds), false);
        // listen to window scroll
        window.addEventListener("scroll", () => this.onWindowScroll(), false);
    }

    /**
     * Event handler will be called when app element is clicked.
     *
     * @param e A dom event.
     */
    onGalleryClicked(e) {
        const clickedID = e.target.id;
        if (clickedID != "search-terms" && clickedID != "search-icon") {
            if (this.searchEl.classList.contains("focus")) {
                this.searchEl.classList.remove("focus");
            }
        }
    }

    /**
     * Event handler will be called when search element is clicked.
     */
    onSearchIconClicked() {
        if (this.searchEl.classList.contains("focus")) {
            this.searchEl.classList.remove("focus");
        } else {
            this.searchEl.classList.add("focus");
        }
    }

    /**
     * Event handler will be called when search form is submited.
     *
     * @param e A dom event.
     */
    onSearchFormSubmit(e) {
        e.preventDefault();
        this.searchImages();
    }

    /**
     * Event handler will be called when window is resized.
     */
    onWindowResize() {
        const newColNum = this.getColumnNum();
        if (this.colNum !== newColNum) {
            this.colNum = newColNum;
            this.setGalleryWidth();
            this.photoGallery.innerHTML = "";
            imageCollection.rearrangeImages();
        }
    }

    /**
     * Event handler will be called when window is scrolled.
     */
    onWindowScroll() {
        const scrollTop = window.pageYOffset;
        if(scrollTop > this.initHeaderOffset){
            this.stickyHeader.classList.add("sticky");
        } else { 
            this.stickyHeader.classList.remove("sticky");
        }
    }

    /**
     * Create dom elments for an image and append it to dom.
     *
     * @param image A "ImageModel" instance.
     */
    appendImage(image) {
        const imgSrc = image.imageMeta.source;
        if (imgSrc) {
            // create "thumbnail" element and bind click listener
            let div = document.createElement("div");
            div.className = 'thumbnail';
            div.addEventListener("click", () => this.openPreview(imgSrc, image.title, image.index));

            // create img div and set attributes
            let img = document.createElement("img");
            img.setAttribute("src", imgSrc);
            img.setAttribute("alt", image.title);
            img.style.top = image.y + "px";
            img.style.left = image.x + "px";
            div.appendChild(img);

            // hide loader
            if (this.isShowingLoader) {
                this.showLoader(false);
            }

            // append to photoGallery element
            this.photoGallery.appendChild(div);
        }
    }

    /**
     * Open preview for a given image.
     * TODO: Hide left/right arrow when showing first/last image.
     * @param imageSrc The image src url.
     * @param imageTitle The image title.
     * @param index The index of the image.
     */
    openPreview(imageSrc, imageTitle, index) {
        this.previewIdx = index;
        this.previewImage.setAttribute("src", imageSrc);
        // show image title if there is any otherwise hide it.
        if (imageTitle && imageTitle.trim()) {
            this.imageTitle.innerHTML = imageTitle;
            this.imageTitle.classList.remove("hidden");
        } else if (!this.imageTitle.classList.contains("hidden")) {
            this.imageTitle.classList.add("hidden");
        }
        
        if (this.preview.classList.contains("hidden")) {
            this.preview.classList.remove("hidden");
        }
    }

    /**
     * Close preview.
     */
    closePreview() {
        if (!this.preview.classList.contains("hidden")) {
            this.preview.classList.add("hidden");
        }
    }

    /**
     * Show previous 
     *
     * @param e A dom event.
     * @param preOrNext A number should be -1(previous) or 1(next).
     */
    showPreOrNextImg(e, preOrNext) {
        e.stopPropagation();
        const nextIdx = this.previewIdx + preOrNext,
            x = ~~(nextIdx / this.colNum),
            y = nextIdx % this.colNum,
            img = imageCollection.images[x] && imageCollection.images[x][y];
        if (img) {
            const imgSrc = img.imageMeta.source;
            this.openPreview(imgSrc, img.title, img.index);  
        } 
    }

    /**
     * Dynamically calculate the column number that can be shown on screen 
     * based on the container width and image width and gap
     * configured in the config.json file.
     * @return The number of columns.
     */
    getColumnNum() {
        const containerWidth = this.photoContainer.offsetWidth,
            imgWidth = globalConfig.size.width,
            imgGap = globalConfig.size.gap;
        
        return Math.floor((containerWidth + imgGap) / (imgWidth + imgGap));
    }

    /**
     * Set the width of the gallery element.
     * Should be called after the window resize and hence the this.colNum is changed
     * in order to properly center the photoGallery element.
     */
    setGalleryWidth() {
        this.photoGallery.style.width = this.colNum * globalConfig.size.width + (this.colNum - 1) * globalConfig.size.gap + "px";
    }

    /**
     * Get search term, empty photoGallery and call imageCollection to search images.
     */
    searchImages() {
        const searchTerm = document.getElementById("search-terms").value;
        this.photoGallery.innerHTML = "";
        this.showLoader(true);
        imageCollection.searchImages(searchTerm);
    }

    /**
     * Show error messages on screen.
     * @param message The error message should show.
     */
    showErrorMsg(message) {
        if (this.isShowingLoader) {
            this.showLoader(false);
        }

        this.errorMsg.innerHTML = message;
    }

    /**
     * Clear error messages on screen.
     */
    clearErrorMsg() {
        this.errorMsg.innerHTML = "";
    }

    /**
     * Show or hide loader.
     * @param shouldShow A boolean type. Show loader if set to true otherwise hide it.
     */
    showLoader(shouldShow) {
        if (shouldShow) {
            this.clearErrorMsg();
            this.loader.classList.remove("hidden");
        } else {
            this.loader.classList.add("hidden");
        }

        this.isShowingLoader = shouldShow;
    }   
}