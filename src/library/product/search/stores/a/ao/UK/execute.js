module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'ao',
    domain: 'ao.com',
    url: 'https://ao.com/l/dyson/6/99/',
    loadedSelector: 'body',
    noResultsXPath: '//h1[@class="break-words mb-4 mt-6 text-center text-display font-regular"]/text()',
    zipcode: '',
  },
};