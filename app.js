let imageGallery;
let imageCollection;
let globalConfig;

(function() {
    // initialization
    // the DOM will be available here
    fetchData("config.json").then((config) => {
        globalConfig = config;
        imageGallery = new ImageGallery();
        imageCollection = new ImageCollection();
    });
})();