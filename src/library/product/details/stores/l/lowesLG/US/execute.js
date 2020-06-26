async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // If price is not available then load the nearest store to the zip code 1360
  const price = await context.evaluate(function () {
    const element = document.evaluate('//span[@class="aPrice large"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    console.log('Element' + element);
    const text = element ? element.textContent : null;
    return text;
  });

  if (price) {
    console.log('price is available, do not load store page');
    return;
  }
  const NEAREST_STORE_URL = 'https://www.lowes.com/store/MA-Hadley/1916';
  await context.goto(NEAREST_STORE_URL, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  const storeClicked = await context.evaluate(function () {
    const shopButtonEle = document.evaluate('//button[contains(.,\'SHOP THIS STORE\')]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (shopButtonEle) {
      shopButtonEle.singleNodeValue.click();
      return true;
    }
  });
  if (storeClicked) {
    const locationSelector = 'a.selected-store';
    await context.waitForFunction((selector) => {
      return !document.querySelector(selector);
    }, { timeout: 50000 }, locationSelector);
    await dependencies.goto({ url });
  }
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'lowesLG',
    domain: 'lowes.com',
    loadedSelector: 'div.header',
    noResultsXPath: null,
  },
  implementation,
};
