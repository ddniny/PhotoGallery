'use strict';

class ImageModel {

    constructor(photoId, title) {
        this.photoId = photoId;
        this.title = title;

        this.baseUrl = globalConfig.baseUrl;
        this.args = [
            "method=flickr.photos.getSizes",
            `api_key=${globalConfig.apiKey}`,
            `photo_id=${this.photoId}`,
            "format=json",
            "nojsoncallback=1"

        ];
        
        this.sizeToUrlMap = new Map();
        this.imageLoaded = this.getSizes();
    }

    getSizes() {
        return fetchData(url(this.baseUrl, this.args)).then((imageSizes) => {
            this.parseSizes(imageSizes);
        });
    }

    parseSizes(imageSizes) {
        console.log(imageSizes);
        if (imageSizes.stat !== "ok" || !imageSizes.hasOwnProperty("sizes")) {
            // something wrong!
            return;
        }

        imageSizes.sizes.size.forEach((size) => {
            this.sizeToUrlMap.set(size.label, size.source);
        });
    }

    getImageUrlForSize(targetSize) {
        return this.sizeToUrlMap.get(targetSize);
    }
}