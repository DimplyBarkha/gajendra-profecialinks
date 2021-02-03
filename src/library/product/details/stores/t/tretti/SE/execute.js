
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'tretti',
    domain: 'tretti.se',
    loadedSelector: '#vipGalleryOnPage > div.gallery__details__outer > div.gallery__details.js-gallery-details > div > div:nth-child(1) > div > img',
    noResultsXPath: null,
    zipcode: '',
  },
};
