// flickr-fetcher.js
FlickrFetcher = {
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
  }
};

module.exports = FlickrFetcher;