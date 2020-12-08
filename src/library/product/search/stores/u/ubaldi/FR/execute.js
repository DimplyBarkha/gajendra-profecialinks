
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'ubaldi',
    domain: 'ubaldi.fr',
    url: 'https://www.ubaldi.com/accueil/',
    loadedSelector: 'div[id="main-liste-articles"] > div div[class="la-image-container"] img',
    noResultsXPath: '//div[@class="recherche-vide"]/span[contains(text(), "La recherche")]',
    zipcode: '',
  },
  implementation: async function  (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    console.log('params', parameters);
    await context.goto(parameters.url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await context.waitForSelector('form[name="recherche2"]');
   
  
    try {
      await context.setInputValue('#input_recherche2', inputs.keywords);
    } catch (err) {
      console.log('Set input value, error - ' + err);
    }
  
    try {
      await context.clickAndWaitForNavigation('#recherche2 > button', {}, { timeout: 50000 });
    } catch (err) {
      console.log('Click & Navigation error' + err);
    }
  
    const doesShopAllLinkExist = await context.evaluate(function () {
      return Boolean(document.evaluate('//div[@class="la-image-container"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue);
    });
  
    if (doesShopAllLinkExist) {
      await context.evaluate(function () {
        document.evaluate('//div[@class="la-image-container"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
      });
    }
  
    if (parameters.loadedSelector) {
      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 20000 }, parameters.loadedSelector, parameters.noResultsXPath);
    }
  
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  }
};
