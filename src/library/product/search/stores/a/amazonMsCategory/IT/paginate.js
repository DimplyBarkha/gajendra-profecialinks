
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'amazonMsCategory',
    loadedSelector: 'ol>li span[class*="item"]>a:nth-child(1)',
    noResultsXPath: '//img[contains(@alt,"Dogs of Amazon")] | //*[contains(text(),"Cerchi qualcosa in particolare")] | /html[not(//ol/li)] | //a[contains(@href,"ref=cs_503_link")]',
    openSearchDefinition: {
      template: 'https://www.amazon.it/gp/bestsellers/*/{searchTerms}?pg={page}#[!opt!]{"force200":true}[/!opt!]',
    },
    domain: 'amazon.it',
    zipcode: '',
  },
};
