
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'Footlocker',
    domain: 'footlocker.co.uk',
    url: 'https://www.footlocker.co.uk/en/search?q={searchTerms}',
    // loadedSelector: '.fl-product-tile--image-container>.fl-picture > .fl-picture--img',
    noResultsXPath: '//div[@class="fl-status-page--content"]/h2[@class="fl-status-page--headline"][1]',
    zipcode: '',
  },
};
