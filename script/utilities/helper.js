'use strict';

/**
 * Make an AJAX call to the backend service specified and return a promise.
 * @param url The backend service.
 * @param success A success callback function.
 * @param error A error callback function.
 * @return A promise indicating whether or not the data is successfully fetched from backend.
 */
function fetchData(url, success, error) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status == 200) {
                success && success(JSON.parse(xmlhttp.responseText));
            } else {
                error && error();
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Construct a url from baseUrl and arguments passed.
 * @param baseUrl The base url of the service.
 * @param args The arguments.
 * @return A url.
 */
function url(baseUrl, args) {
    return `${baseUrl}?${args.join("&")}`;
}

/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 * @param func The callback function.
 * @param wait The timeout in milliseconds.
 * @param immediate Indicate whether or not trigger the callback on leading edge or trailing edge.
 * @return A function, that, as long as it continues to be invoked, will not be triggered.
 */
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};