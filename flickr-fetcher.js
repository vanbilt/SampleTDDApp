// flickr-fetcher.js
'use strict';
var util = require('util');
const urlTemplate = 'https://api.flickr.com/services/rest/' +
      '?method=flickr.photos.search' +
      '&api_key=%s' +
      '&text=pugs' +
      '&format=json' +
      '&nojsoncallback=1';
var FlickrFetcher = {
  photoObjToURL: function (photoObj) {
    return ['https://farm',
      photoObj.farm, '.staticflickr.com/',
      photoObj.server, '/',
      photoObj.id, '_',
      photoObj.secret, '_b.jpg'
    ].join('');
  },
  transformPhotoObj: function (photoObj) {
    return {
          title: photoObj.title,
          // could also use `this` instead of FlickrFetcher
          url: FlickrFetcher.photoObjToURL(photoObj)
        };
  },
  fetchFlickrData: function (apiKey, fetch) {
    if((!fetch) && (typeof jQuery !== 'undefined')) {
      fetch = jQuery.getJSON.bind(jQuery);
    }

    return fetch(util.format(urlTemplate, apiKey.toString()))
  },
  fetchPhotos: function (apiKey, fetch) {
    return FlickrFetcher.fetchFlickrData(apiKey, fetch)
      .then(function (data) {
        return data.photos.photo.map(FlickrFetcher.transformPhotoObj);
      })
  }
};

if((typeof module !== 'undefined') &&
  (typeof module.exports !== 'undefined')) {
  module.exports = FlickrFetcher;
}