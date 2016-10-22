// photo-lister-spec.js
'use strict';
var expect = require('chai').expect,
	util = require('util'),
	cheerio = require('cheerio'),
	PhotoLister = require('./photo-lister')
const input1 = {
		'title': 'This is a test',
		'url': 'http://loremflickr.com/960/593'
	},
	input2 = {
	  'title': 'This is another test',
	  'url': 'http://loremflickr.com/960/593/puppy'
	},
	expectedTemplate = '<li><figure><img src="%s"' +
	' alt=""/><figcaption>%s</figcaption></figure></li>',
	htmlTemplate = '<html><head></head><body><div id="mydiv">' +
		'</div></body></html>';

describe('PhotoLister', function () {
	it('should exist', function () {
		expect(PhotoLister).not.to.be.undefined;
	});
});

describe('#photoToListItem()', function () {
	it('should take a photo object and return a list item string',
		function () {
			var input = input1,
				expected = util.format(expectedTemplate, input.url, input.title);
			expect(PhotoLister.photoToListItem(input)).to.equal(expected);

			input = input2,
				expected = util.format(expectedTemplate, input.url, input.title);
        expect(PhotoLister.photoToListItem(input)).to.equal(expected);
	});
});

describe('#photoListToHtml', function () {
	it('should take an array of photo objects and convert them to an HTML list',
		function () {
			var input = [input1, input2],
				expected = ['<ul>',
					util.format(expectedTemplate, input1.url, input1.title),
					util.format(expectedTemplate, input2.url, input2.title),
					'</ul>'].join('');

				expect(PhotoLister.photoListToHtml(input)).to.be.equal(expected);
		});
});

describe('#addPhotosToElement()', function () {
	it('should take an HTML string of list items and add them to an element ' +
		'with a given selector', function () {
			var $ = cheerio.load(htmlTemplate),
				list = ['<ul>',
					util.format(expectedTemplate, input1.url, input1.title),
					util.format(expectedTemplate, input2.url, input2.title),
					'</ul>'].join(''),
				selector = '#mydiv',
				$div = PhotoLister.addPhotosToElement($, selector, list);

			expect($div.find('ul').length).to.equal(1);
			expect($div.find('li').length).to.equal(2);
			expect($div.find('figure').length).to.equal(2);
			expect($div.find('img').length).to.equal(2);
			expect($div.find('figcaption').length).to.equal(2);
	});
});