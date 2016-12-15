'use strict';

function fetchData(url) {
    return new Promise((resolve, reject) => {
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
                if (xmlhttp.status == 200) {
                    resolve(JSON.parse(xmlhttp.responseText));
                } else {
                    alert('something else other than 200 was returned');
                    reject();
                }
            }
        };

        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });
}

function url(baseUrl, args) {
    return `${baseUrl}?${args.join("&")}`;
}