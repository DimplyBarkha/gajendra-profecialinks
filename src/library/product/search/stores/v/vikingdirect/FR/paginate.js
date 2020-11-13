
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    nextLinkSelector: 'ul.searchPagePagination li.next',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.clearfix.block.top',
    noResultsXPath: '//h1[contains(text(), "Mince ! Rien ne correspond à ")]|//div[@class="skuTopDetailsContainer"]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'vikingdirect.fr',
    zipcode: '',
  },
};
