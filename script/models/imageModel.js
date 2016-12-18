'use strict';

/**
 * A model class for individual image. 
 * Responsible for:
 * 1. talking with flickr backend to fetch a single image data
 * 2. storing a single image data
 */
class ImageModel {

    constructor(photoId, title) { 
        // initialize instance variables
        this.photoId = photoId;
        this.title = title;
        this.baseUrl = globalConfig.baseUrl;
        this.targetSize = globalConfig.targetImgSize; // the size users want to use (can be configured in config.json file)
        this.args = [
            "method=flickr.photos.getSizes",
            `api_key=${globalConfig.apiKey}`,
            `photo_id=${this.photoId}`,
            "format=json",
            "nojsoncallback=1"

        ];
        
        this.index = -1;
        // a promise indicating if the image loading is done
        this.imageLoaded = this.getSizes();
        // origin image metadata got from flickr service
        this.imageMeta = null;
        // the image coordinates on the page
        this.x = -1;
        this.y = -1;
        // the image width and height after scaled that can be configured in config.json file 
        this.width = -1; 
        this.height = -1;
    }

    /**
     * Fetch a list of available sizes and corresponding source urls for a photo from flickr service.
     * TODO: Add fail handler
     */
    getSizes() {
        return fetchData(url(this.baseUrl, this.args)).then((imageSizes) => { 
            this.parseSizes(imageSizes, this.targetSize);
        });
    }

    /**
     * Parse a list of available sizes for a photo from flickr service.
     * @param imageSizes A list of aailable sizes for a image.
     * @param targetSize The size the user want to use which can be configured in config.json file.
     */
    parseSizes(imageSizes, targetSize) {
        if (imageSizes.stat !== "ok" || 
        !imageSizes.hasOwnProperty("sizes") ||
        !imageSizes.sizes.hasOwnProperty("size")) {
            // something wrong!
            return;
        }

        this.imageMeta = imageSizes.sizes.size.find((size) => {
            return size.label === targetSize;
        });

        // scale the image using image's original width, height 
        // and the desired width configured in config.json file
        if (this.imageMeta) {
            this.width = globalConfig.size.width;
            this.height = (this.width / this.imageMeta.width) * this.imageMeta.height;
        }
    }
}