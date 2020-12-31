const implementation = async ({ url, id, zipcode, storeId }, { loadedSelector, noResultsXPath }, context, dependencies) => {
  if (!url) {
    if (!id) throw new Error('No id provided');
    else url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId });

  await context.evaluate(async function (url) {
    const response = url && url.match(/q=(\d+)/) && url.match(/q=(\d+)/)[1] && await fetch(`https://www.homedepot.ca/product/${url.match(/q=(\d+)/)[1]}`)
      .then(response => response.text())
      .catch(error => console.error('Error:', error));
    if (response) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(response, 'text/html');
      doc && doc.getElementsByTagName('html') && doc.getElementsByTagName('html')[0] && document.body.appendChild(doc.getElementsByTagName('html')[0]);
    }
  }, url);

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);
};

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    loadedSelector: 'product,div[class="hdca-product"],div[evtperfname="product-localized-container"]',
    noResultsXPath: '//message[contains(text(),"not found")] | //errorList | //product-not-found-container[@evtperfname="product-not-found-container"]//div[contains(text(), "temporarily unavailable")] | //product-not-found-container[@evtperfname="product-not-found-container"]//h1[contains(text(), "temporarily unavailable")] | //div[contains(@class,"hdca-container") and not(.//div[@acl-breadcrumbs])]',
    zipcode: '',
  },
  implementation,
};
