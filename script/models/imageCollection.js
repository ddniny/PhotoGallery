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
            let image = new ImageModel(photo.id, photo.title);
            this.images.push(image);
        });

        this.appendImages();
    }

    appendImages() {
        this.images.forEach((image) => {
            image.imageLoaded.then(() => {
                imageGallery.appendImage(image, "Medium");
            });
        });
    }
}

