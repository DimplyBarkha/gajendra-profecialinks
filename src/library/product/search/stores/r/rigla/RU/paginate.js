
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'rigla',
    nextLinkSelector: null,
    // nextLinkSelector: 'div.catalog-content>div.catalog-toolbar div.catalog-toolbar-pages div.next-page__btn',
    // nextLinkSelector: 'div.catalog-toolbar-pages div.catalog-toolbar-pages__item_active ~ div.catalog-toolbar-pages__item',
    mutationSelector: null,
    spinnerSelector: null, //'svg[id="preloader_ApHW3oh8n"]',
    loadedSelector: 'div.catalog-content div.product-list-mode-grid div.product',
    // loadedSelector: 'div.catalog-content',
    noResultsXPath: '//div[@class="search-results__counts" and text()="(0)"]',
    // openSearchDefinition: null,
    // openSearchDefinition: {
      // offset: 150,
      // template: 'https://www.rigla.ru/search?limit=150&p={page}&q={searchTerms}',
    // },
    domain: 'rigla.ru',
    zipcode: "''",
  },
};
