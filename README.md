# PhotoGallery
A web page that shows a grid of photo thumbnails. When a thumbnail is clicked, the photo should be displayed in a lightbox view, with the ability to move to the next / previous photos and display the photo title.

- Written in Javascript with ES6 syntax. Use babel to transpile to ES5 in order to support more browsers. 
- The ability to load more contents once scroll to the end.
- Ability to search images using flickr backend service.
- Responsive Javascript implemented masonry layout with the ability to set the image width and gap among images in the config.json file.
- Ability to adjust the column showing on the screen dynamically based on the viewport size.
- Responsive UI with spinner showing when loading images.

# Browser support
Tested on latest versions of Chrome, Safari, Firefox and IE (IE11 and Edge).

# Things can do in the future
- Enable less;
- Add cache;

# Prerequisites
Please install Node.js and npm.

# Install dependencies of app
    $ npm install

# Transpile ES6 to ES5 (This will be done automatically after "npm install")
    $ gulp

# Run the app:
    $ npm start

# Launch in browser locally:
    http://127.0.0.1:3000/

# Launch in browser:
    https://flickr-photo-gallery.herokuapp.com/
