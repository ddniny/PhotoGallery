'use strict';

class ImageModel {

    constructor(photoId, title, farmId, serverId, secret) {
        // TODO: clean params
        this.photoId = photoId;
        this.title = title;
        this.farmId = farmId;
        this.serverId = serverId;
        this.secret = secret;
        this.index = null;

        this.baseUrl = globalConfig.baseUrl;
        this.args = [
            "method=flickr.photos.getSizes",
            `api_key=${globalConfig.apiKey}`,
            `photo_id=${this.photoId}`,
            "format=json",
            "nojsoncallback=1"

        ];
        
        this.sizeToUrlMap = new Map();
        this.targetSize = globalConfig.targetImgSize;
        this.imageLoaded = this.getSizes();

        // this.imgSrc = this.construcImgSrc();

        // TODO
        this.imageMeta = null;
        this.x = -1;
        this.y = -1;
        this.width = -1;
        this.height = -1;
    }

    // construcImgSrc() {
    //     return `https://farm${this.farmId}.staticflickr.com/${this.serverId}/${this.photoId}_${this.secret}.jpg`;
    // }

    getSizes() {
        return fetchData(url(this.baseUrl, this.args)).then((imageSizes) => { 
            this.parseSizes(imageSizes, this.targetSize);
        });
    }

    parseSizes(imageSizes, targetSize) {
        console.log(imageSizes);
        if (imageSizes.stat !== "ok" || !imageSizes.hasOwnProperty("sizes")) {
            // something wrong!
            return;
        }

        // imageSizes.sizes.size.forEach((size) => {
        //     this.sizeToUrlMap.set(size.label, size.source);
        // });
        this.imageMeta = imageSizes.sizes.size.find((size) => {
            return size.label === targetSize;
        });

        if (this.imageMeta) {
            this.width = globalConfig.size.width;
            this.height = (this.width / this.imageMeta.width) * this.imageMeta.height;
        }
    }

    getImageUrlForSize(targetSize) {
        return this.sizeToUrlMap.get(targetSize);
    }
}