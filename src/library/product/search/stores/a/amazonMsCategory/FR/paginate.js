
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsCategory',
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '/html[not(//script[contains(text(),\'pageType: "zeitgeist"\')])] | //a//img[contains(@src,"503.png")] | //a[contains(@href,"ref=cs_503_link")] | //script[contains(text(),"PageNotFound")] | //img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Vous recherchez une page")] | /html[not(//ol/li)]',
    openSearchDefinition: {
      template: 'https://www.amazon.fr/gp/bestsellers/*/{searchTerms}?pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.fr',
    zipcode: '',
  },
};
