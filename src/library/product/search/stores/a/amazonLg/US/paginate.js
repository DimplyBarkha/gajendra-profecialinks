
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'amazonLg',
    nextLinkSelector: 'ul.a-pagination > li.a-last a',
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    domain: 'amazon.com',
    zipcode: '',
  },
};
