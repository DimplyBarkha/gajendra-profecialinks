
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsCategory',
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Buscas algo")] | /html[not(//ol/li)]',
    openSearchDefinition: {
      template: 'https://www.amazon.es/gp/bestsellers/*/{searchTerms}?&pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.es',
    zipcode: '',
  },
};
