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

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const scroll = document.querySelector('div.copyright-top');
      console.log('scrolling');
      scroll.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'start',
      });
      await stall(10000);
    });
  };
  await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
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
    await applyScroll(context);
    return;
  }
  const NEAREST_STORE_URL = 'https://www.lowes.com/store/CA-Burbank/1144';
  await context.goto(NEAREST_STORE_URL, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
  const shopButtonEle = await context.evaluate(function () {
    return !!document.evaluate('//button[contains(.,\'SHOP THIS STORE\')]/button', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  });

  let storeClicked = false;
  if (shopButtonEle) {
    await context.click('header > button');
    await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
    storeClicked = true;
  }

  if (storeClicked) {
    const locationSelector = 'a.selected-store';
    await context.waitForFunction((selector) => {
      return !document.querySelector(selector);
    }, { timeout: 50000 }, locationSelector);
    await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    await applyScroll(context);
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
