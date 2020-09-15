
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    loadedSelector: 'div[id="main-liste-articles"] > div div[class="la-image-container"] img',
    noResultsXPath: '/html[not(//div[@class="h1 titre-page as-butee-haut label-recherche"])] | //div[@class="recherche-vide"]',
    openSearchDefinition: {
      template: 'https://www.ubaldi.com/recherche/{searchTerms}-page-{page}.php#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'ubaldi.com',
    zipcode: '',
  },
};
