module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'BR',
    store: 'drogaraia',
    domain: 'drogaraia.com.br',
    loadedSelector: 'ul.ts-reviews-list > li',
    noResultsXPath: null,
    reviewUrl: 'https://busca.drogaraia.com.br/search?w={id}',
    zipcode: '',
  },
};
