'use strict';
class ImageCollection {
    constructor() {
        this.baseUrl = globalConfig.baseUrl;
        this.args = [
            "method=flickr.photos.getRecent",
            `api_key=${globalConfig.apiKey}`,
            "format=json", //response in JSON format
            "nojsoncallback=1" //just want the raw JSON, with no function wrapper
        ];
        this.images = [];

        fetchData(url(this.baseUrl, this.args)).then((imagesData) => {
            this.fetchImages(imagesData);
        });
    }

    fetchImages(imagesData) {
        if (imagesData.stat !== "ok" || !imagesData.hasOwnProperty("photos")) {
            // something wrong!
            return;
        }

        imagesData.photos.photo.forEach((photo) => {
            let image = new ImageModel(photo.id, photo.title, photo.farm, photo.server, photo.secret);
            this.appendImages(image);
        });
    }

    // appendImages(image) {
    //     image.imageLoaded.then(() => {
    //         if (image.imageMeta) {
    //             imageGallery.appendImage(image);
    //             this.images.push(image);
    //             image.index = this.images.length - 1;
    //         }
    //     });
    // }
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

    appendImages(image) {
        image.imageLoaded.then(() => {
            if (!image.imageMeta) {
                return;
            }

            let newX = 0;
            let newY = 0;
            let lastArray = this.images[this.images.length - 1];
            if (this.images && this.images.length && lastArray.length < imageGallery.colNum) {
                let preArray = this.images[this.images.length - 2];
                if (preArray) {
                    let imgAbove = preArray[lastArray.length];
                    image.y = imgAbove.y + imgAbove.height + globalConfig.size.gap;
                    image.x = imgAbove.x;
                } else {
                    let lastImg = lastArray[lastArray.length - 1];
                    image.y = 0;
                    image.x = lastImg.x + lastImg.width + globalConfig.size.gap; //TODO
                }

                lastArray.push(image);
            } else {
                image.x = 0;
                if (lastArray) {
                    let imgAbove = lastArray[0];
                    image.y = imgAbove.y + imgAbove.height + globalConfig.size.gap;
                } else {
                    image.y = 0;
                }

                this.images.push([image]);
            }

            image.index = (this.images.length - 1) * imageGallery.colNum + this.images[this.images.length - 1].length - 1;

            imageGallery.appendImage(image);
        });
    }
}

