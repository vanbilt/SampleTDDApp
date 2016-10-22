// photo-lister.js
'use strict';
var PhotoLister = {
	photoToListItem: function (photo) {
		return ['<li>', '<figure>',
			'<img src="', photo.url, '" alt=""/>',
			'<figcaption>', photo.title, '</figcaption>',
			'</figure>', '</li>'
		].join('');
	},
	photoListToHtml: function (photos) {
		return ['<ul>',
			// Array.map returns an array
			// - add .join('') to the end to remove comma
			photos.map(PhotoLister.photoToListItem).join(''),
			'</ul>'
		].join('');
	},
	addPhotosToElement: function ($, selector, list) {
		return $(selector).append(list);
	}
};

if((typeof module !== 'undefined') &&
  (typeof module.exports !== 'undefined')) {
  module.exports = PhotoLister;
}