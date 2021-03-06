'use strict';

/**
 * A model class for image collection. 
 * Responsible for:
 * 1. talking with flickr backend to fetch images data
 * 2. storing all image objects/models
 * 3. calculating the position of each image in order to have a mansory layout
 */
class ImageCollection {
    constructor() {
        // initialize instance variables
        this.baseUrl = globalConfig.baseUrl;
        this.recentArgs = [
            "method=flickr.photos.getRecent",
            `api_key=${globalConfig.apiKey}`,
            "format=json", //response in JSON format
            "nojsoncallback=1" //just want the raw JSON, with no function wrapper
        ];

        this.searchArgs = [
            "method=flickr.photos.search",
            `api_key=${globalConfig.apiKey}`,
            "format=json", //response in JSON format
            "nojsoncallback=1" //just want the raw JSON, with no function wrapper
        ];

        this.images = [];
        this.currentPage = 1;
        this.lastCalledGetRecentApi = true;
        this.lastSearchTerm = "";
        this.fetchRecent(false, []);
    }

    /**
     * Load more images from flickr backend service.
     */
    loadMore() {
        console.log("Loading more images...");
        if (this.lastCalledGetRecentApi) {
            this.fetchRecent(true, [`page=${++this.currentPage}`]);
        } else {
            this.searchImages(this.lastSearchTerm, true, [`page=${++this.currentPage}`]);
        }
    }

    /**
     * Fetch a list of the latest public photos uploaded to flickr.
     * @param isLoadMore Indicate whether or not loading more data or fetch new data.
     * @param options More arguments need to be passed through url.
     */
    fetchRecent(isLoadMore, options) {
        this.lastCalledGetRecentApi = true;
        const success = (imagesData) => {
            this.fetchImages(imagesData);
        };

        const error = (errorMsg) => {
            console.warn("Fetch latest public photos failed. " + errorMsg);
            imageGallery.showErrorMsg(errorMsg);
        };
        
        if (!isLoadMore) {
            this.images = [];
            this.currentPage = 1;
        }
        
        fetchData(url(this.baseUrl, this.recentArgs.concat(options)), success, error);
    }

    /**
     * Fetch a list of photos matching the search term. 
     * Photos who's title, description or tags contain the text will be returned.
     * 
     * @param searchTerm A string contains the text that is going to be searched.
     * @param isLoadMore Indicate whether or not loading more data or fetch new data.
     * @param options More arguments need to be passed through url.
     */
    searchImages(searchTerm, isLoadMore, options) {
        this.lastCalledGetRecentApi = false;
        this.lastSearchTerm = searchTerm;
        options.push(`text=${encodeURIComponent(searchTerm)}`);
        const success = (imagesData) => {
            this.fetchImages(imagesData);
        };

        const error = (errorMsg) => {
            console.warn("Fetch data for search term: " + searchTerm + " failed. " + errorMsg);
            imageGallery.showErrorMsg(errorMsg);
        };
        
        if (!isLoadMore) {
            this.images = [];
            this.currentPage = 1;
        }
        
        fetchData(url(this.baseUrl, this.searchArgs.concat(options)), success, error);
    }

    /**
     * Create an instance of ImageModel for each images in the list.
     * 
     * @param imagesData A json object that contains a list of image data fetched from flickr.
     */
    fetchImages(imagesData) {
        if (imagesData.stat !== "ok" || 
        !imagesData.hasOwnProperty("photos") || 
        !imagesData.photos.hasOwnProperty("photo")) {
            let message = imagesData.message.trim() || "Someting wrong. Please try again later.";
            imageGallery.showErrorMsg(message);
            return;
        }

        if (!imagesData.photos.photo.length && imagesData.photos.page === 1) {
            imageGallery.showErrorMsg("No image found.");   
            return;
        }

        if (imagesData.photos.page > imagesData.photos.pages) {
            console.log("Last page loaded.");
            return;
        }

        imagesData.photos.photo.forEach((photo) => {
            let image = new ImageModel(photo.id, photo.title);
            image.load(() => this.appendImages(image));
        });
    }

    /**
     * Recalculate the position of each images and refresh this.images array.
     * Will be called when the images position got changed for example on window resize.
     */
    rearrangeImages() {
        if (!this.images || !this.images.length) return;
        const oldImages = this.images.concat(),
            rowLen = oldImages.length,
            colLen = oldImages[0].length;

        this.images = [];
        
        for (let i = 0; i < rowLen; i++) {
            for (let j = 0; j < colLen && oldImages[i][j]; j++) {
                this.appendImages(oldImages[i][j]);
            }
        }
    }

    /**
     * Calculate the position for a given image and append to dom.
     * @param image A ImageModel instance.
     */
    appendImages(image) {
        if (!image.imageMeta) {
            return;
        }

        this.calcImagePos(image);
        imageGallery.appendImage(image);
    }

    /**
     * Calculate the position and index for a given image.
     * @param image A ImageModel instance.
     */
    calcImagePos(image) {
        let lastRow = this.images[this.images.length - 1];
        // add the image to the last existing row
        if (lastRow && lastRow.length < imageGallery.colNum) {
            let preRow = this.images[this.images.length - 2];
            if (preRow) { 
                let imgAbove = preRow[lastRow.length];
                image.y = imgAbove.y + imgAbove.height + globalConfig.size.gap;
                image.x = imgAbove.x;
            } else { // add the image to the first row
                let lastImg = lastRow[lastRow.length - 1];
                image.y = 0;
                image.x = lastImg.x + lastImg.width + globalConfig.size.gap;
            }

            lastRow.push(image);
        } else { // add the first image in a new row
            image.x = 0;
            if (lastRow) {
                let imgAbove = lastRow[0];
                image.y = imgAbove.y + imgAbove.height + globalConfig.size.gap;
            } else { // add the first row
                image.y = 0;
            }

            this.images.push([image]);
        }

        image.index = (this.images.length - 1) * imageGallery.colNum + this.images[this.images.length - 1].length - 1;
    }
}

