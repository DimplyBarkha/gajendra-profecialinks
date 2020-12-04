
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'onofre',
    domain: 'busca.onofre.com.br',
    url: 'https://busca.onofre.com.br/search?w={searchTerms}',
    loadedSelector: 'ul.products-grid li.item',
    noResultsXPath: '//div[@class="sli_noresults_container_inner"]',
    zipcode: '',
  },
};
