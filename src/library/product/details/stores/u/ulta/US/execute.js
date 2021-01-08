
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'ulta',
    domain: 'ulta.com',
    loadedSelector: '.ProductDetail__content',
    // noResultsXPath: '//p[contains(text(),"Sorry, we can not find a ULTA.com page that matches your request")]',
    noResultsXPath: '//div[@class="no-result-lt"]/h2',
    zipcode: '',
  },
};
