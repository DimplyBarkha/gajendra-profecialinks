
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'beautye',
    domain: 'beautye.it',
    // url: 'https://www.beautye.it/search/{searchTerms}',
    url: 'https://www.beautye.it/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'li.product-item div div.product-item-photo a img.product-image-photo',
    noResultsXPath: '//div[@class="message notice"]/div/text()',
    zipcode: '',
  },
  
};
 



