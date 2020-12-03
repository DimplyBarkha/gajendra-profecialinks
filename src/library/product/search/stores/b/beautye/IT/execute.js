
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    domain: 'beautye.it',
    // url: 'https://www.beautye.it/search/{searchTerms}',
    url: 'https://www.beautye.it/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products-grid li.product-item',
    noResultsXPath: '//div[@class="message notice"]/div/text()',
    zipcode: '',
  },
};
