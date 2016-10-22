// flicker-fetcher-spec.js
'use strict';
var expect = require('chai').expect,
  util = require('util'),
  FlickrFetcher = require('./flickr-fetcher');

const apiKey = 'does not matter much what this is right now',
  apiUrl = 'https://api.flickr.com/services/rest/' +
    '?method=flickr.photos.search&api_key=%s' +
    '&text=pugs&format=json&nojsoncallback=1',
  returnUrl = 'https://farm2.staticflickr.com/%s/%s_%s_b.jpg',
  fakePhoto1 = {
    'id': '24770505034',
    'owner': '97248275@N03',
    'secret': '31a9986429',
    'server': '1577',
    'farm': 2,
    'title': '20160229090898',
    'ispublic': 1,
    'isfriend': 0,
    'isfamily': 0
  },
  fakePhoto2 = {
    'id': '24770504484',
    'owner': '97248275@N03',
    'secret': '69dd90d5dd',
    'server': '1451',
    'farm': 2,
    'title': '20160229090903',
    'ispublic': 1,
    'isfriend': 0,
    'isfamily': 0
  },
  theOtherCate = {
    'id': '24765033584',
    'owner': '27294864@N02',
    'secret': '3c190c104e',
    'server': '1514',
    'farm': 2,
    'title': 'the other cate',
    'ispublic': 1,
    'isfriend': 0,
    'isfamily': 0
  },
  avoidLeash = {
    'id': '25373736106',
    'owner': '99117316@N03',
    'secret': '146731fcb7',
    'server': '1669',
    'farm': 2,
    'title': 'Dog goes to desperate measure to avoid walking on a leash',
    'ispublic': 1,
    'isfriend': 0,
    'isfamily': 0
  },
  fakeData = {
    'photos': {
      'page': 1,
      'pages': 2872,
      'perpage': 100,
      'total': '287170',
      'photo': [
        avoidLeash,
        theOtherCate]
    }
  };

describe('FlickrFetcher', function() {
    it('should exist', function() {
        expect(FlickrFetcher).to.not.be.undefined;
    });
});

describe('#photoObjToURL', function() {
    it('should take a photo object from Flickr and return a string',
      function() {
        var input = fakePhoto1;
        var expected = util.format(returnUrl,
          input.server,
          input.id,
          input.secret);
        var actual = FlickrFetcher.photoObjToURL(input);
        expect(actual).to.eql(expected);

        input = fakePhoto2;
        expected = util.format(returnUrl,
          input.server,
          input.id,
          input.secret);
        actual = FlickrFetcher.photoObjToURL(input);
        expect(actual).to.eql(expected);
    });
});

/*
  What should happen if someone passes:
  * a string instead of an object?
  * no parameters?
  * an object that has the wrong property names?
  *an object with the right property names but the values aren’t strings?
*/

describe('#transformPhotoObj()', function() {
    it('should take a photo object and return an object ' +
      'with just title and URL',
      function() {
        var input = avoidLeash,
            expected = {
                title: input.title,
                url: util.format(returnUrl,
                  input.server,
                  input.id,
                  input.secret)
            },
            actual = FlickrFetcher.transformPhotoObj(input);
        expect(actual).to.eql(expected);

        input = theOtherCate,
          expected = {
              title: input.title,
              url: util.format(returnUrl,
                input.server,
                input.id,
                input.secret)
          },
          actual = FlickrFetcher.transformPhotoObj(input);

        expect(actual).to.eql(expected);
    });
});

describe('#fetchFlickrData()', function() {
    it('should take an API key and fetcher function argument and return a ' +
      'promise for JSON data.',
        function() {
            var fakeFetcher = function(url) {
                    var expectedURL = util.format(apiUrl, apiKey);
                    expect(url).to.equal(expectedURL);
                    return Promise.resolve(fakeData);
                };

            FlickrFetcher.fetchFlickrData(apiKey, fakeFetcher);
        });
});

describe('#fetchPhots', function() {
    it('should take an API key and fetcher function and return a promise ' +
      'for transformed photos',
        function() {
            var input1 = fakeData.photos.photo[0],
              input2 = fakeData.photos.photo[1],
              expected = [{
                  title: input1.title,
                  url:   util.format(returnUrl,
                    input1.server,
                    input1.id,
                    input1.secret)
                }, {
                  title: input2.title,
                  url:   util.format(returnUrl,
                    input2.server,
                    input2.id,
                    input2.secret)
                }],
                fakeFetcher = function(url) {
                    var expectedURL = util.format(apiUrl, apiKey);
                    expect(url).to.equal(expectedURL);
                    return Promise.resolve(fakeData);
                };

            return FlickrFetcher.fetchPhotos(apiKey, fakeFetcher)
                .then(function(actual) {
                    expect(actual).to.eql(expected);
                });
        });
});
