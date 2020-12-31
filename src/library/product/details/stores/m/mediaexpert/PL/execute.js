
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediaexpert',
    domain: 'mediaexpert.pl',
    loadedSelector: 'div.is-productName',
    noResultsXPath: '//div[contains(@class, "is-noResults")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    
    const searchUrl = `https://www.mediaexpert.pl/search?query[menu_item]=&query[querystring]=${inputs.id}`;
    await context.goto(searchUrl, {
      timeout: 30000,
      waitUntil: 'load',
      checkBlocked: true,
      js_enabled: true,
      css_enabled: false,
      random_move_mouse: true,
    });
    
    
    const productDetailsLink = await context.evaluate(function (inputs) {
      const productList = document.querySelectorAll('div.c-grid_col.is-grid-col-1');
      for (let i = 0; i < productList.length; i++) {
        const productCodeEle = productList[i].querySelector('div.is-productCode');
        if (productCodeEle) {
          const productCode = productCodeEle.textContent.trim();
          if (productCode.includes(inputs.id) || productList.length === 1) {
            const productDetailsEle = productList[i].querySelector('div.c-offerBox_photo a');
            return productDetailsEle ? productDetailsEle.getAttribute('href') : null;
          }
        }
      }
    }, inputs);
    if (productDetailsLink) {
      console.log('found product');
      const url = `https://www.mediaexpert.pl${productDetailsLink}`;
      await context.goto(url, {
        timeout: 60000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      const noProductsFound = await context.evaluate(function (inputs) {
        const noResults = document.querySelector('div.is-noResults');
        return noResults;
      });
      if (noProductsFound || noProductsFound === undefined) {
        console.log('Checking no results', parameters.noResultsXPath);
        return await context.evaluate(function (xp) {
          const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
          console.log(xp, r);
          const e = r.iterateNext();
          console.log(e);
          return !e;
        }, parameters.noResultsXPath);
      }
    }
    await context.waitForNavigation({ timeout: 60000, waitUntil: 'networkidle0' });
    
  },
};
