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

        this.fetchRecent();
    }

    /**
     * Fetch a list of the latest public photos uploaded to flickr.
     * TODO: Add fail handler
     */
    fetchRecent() {
        fetchData(url(this.baseUrl, this.recentArgs)).then((imagesData) => {
            this.fetchImages(imagesData);
        });
    }

    /**
     * Fetch a list of photos matching the search term. 
     * Photos who's title, description or tags contain the text will be returned.
     * TODO: Add fail handler
     * @param searchTerm A string contains the text that is going to be searched.
     */
    searchImages(searchTerm) {
        this.searchArgs.push(`text=${searchTerm}`);
        fetchData(url(this.baseUrl, this.searchArgs)).then((imagesData) => {
            this.images = [];
            this.fetchImages(imagesData);
        });
    }

    /**
     * Create an instance of ImageModel for each images in the list.
     * TODO: Add fail handler
     * @param imagesData A json object that contains a list of image data fetched from flickr.
     */
    fetchImages(imagesData) {
        if (imagesData.stat !== "ok" || 
        !imagesData.hasOwnProperty("photos") || 
        !imagesData.photos.hasOwnProperty("photo")) {
            // something wrong!
            return;
        }

        imagesData.photos.photo.forEach((photo) => {
            let image = new ImageModel(photo.id, photo.title, photo.farm, photo.server, photo.secret);
            this.appendImages(image);
        });
    }

    /**
     * Recalculate the position of each images and refresh this.images array.
     * Will be called when the images position got changed for example on window resize.
     */
    rearrangeImages() {
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
        image.imageLoaded.then(() => {
            if (!image.imageMeta) {
                return;
            }

            this.calcImagePos(image);
            imageGallery.appendImage(image);
        });
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

