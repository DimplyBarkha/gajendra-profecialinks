async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  let { url, id, zipcode, storeId } = inputs;
  if (!url) {
    if (!id) {
      throw new Error('no id provided');
    }
    url = await dependencies.createUrl({ id });
  }
  await dependencies.goto({ url, zipcode, storeId, id });

  if (id) {
    const firstItemUrl = await context.evaluate(() => {
      const firstItem = document.querySelector('li.item.first.btn_line a');
      return firstItem.getAttribute('href');
    });
    await dependencies.goto({url: firstItemUrl});
  }
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  await autoScroll(context);
  // code to switch currency.
  async function changeCurrency() {
    const currency = await context.evaluate(() => document.querySelector('#currency-autoswitch-list').getAttribute('data-current'));
    if(currency !== 'AED') {
      const newUrl = await context.evaluate(() => document.querySelector('#currency-autoswitch-list a[data-code="AED"]').href);
      await context.goto(newUrl, { waitUntil: 'networkidle0', block_ads: false, js_enabled: true });
    }
  }
  await changeCurrency();
  const currency = await context.evaluate(() => document.querySelector('#currency-autoswitch-list').getAttribute('data-current'));
  if(currency !== 'AED')
  throw new Error('Incorrect Currency');

  async function autoScroll (page) {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
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

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'mumzworld',
    domain: 'mumzworld.com',
    loadedSelector: 'img#image',
    noResultsXPath: '//img[@class="valignmid"]',
    zipcode: '',
  },
  implementation,
};
