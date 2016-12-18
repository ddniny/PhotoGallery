let imageGallery;
let imageCollection;
let globalConfig;

(function() {
    // initialization
    // the DOM will be available here
    const success = (config) => {
        globalConfig = config;
        imageGallery = new ImageGallery();
        imageCollection = new ImageCollection();
    };

    const error = () => {
        console.error("Failed at loading config.json file.");
    };

    fetchData("config.json", success, error);
})();