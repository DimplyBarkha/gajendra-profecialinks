
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'onofre',
    domain: 'busca.onofre.com.br',
    // url: 'https://busca.onofre.com.br/search?w={searchTerms}',
    url: 'https://busca.onofre.com.br/search?p=Q&srid=S1-3DFWP&lbc=on&ts=custom-on&w=={searchTerms}&uid=262059915&method=or&isort=score&view=grid&srt=0',
    loadedSelector: 'ul.products-grid li.item',
    noResultsXPath: '//div[@class="sli_noresults_container_inner"]',
    zipcode: '',
  },
};
