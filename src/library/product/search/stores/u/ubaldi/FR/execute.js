
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    domain: 'ubaldi.com',
    url: 'https://www.ubaldi.com/recherche/{searchTerms}.php#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'div[id="main-liste-articles"] > div div[class="la-image-container"] img',
    noResultsXPath: '/html[not(//div[@class="h1 titre-page as-butee-haut label-recherche"])] | //div[@class="recherche-vide"]',
    zipcode: '',
  },
};
