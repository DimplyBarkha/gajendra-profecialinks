
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

  const domain = 'walgreens.com';
  url = url.replace('=/', '=%22') + '%22';
  console.log(url);

  await dependencies.goto({ url });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  const hasProduct = await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);

  if (hasProduct) {
    const path = await context.evaluate(() => {
      const xpathFirstResult = '//div[contains(@class,"card__product")]//div[contains(@class,"product__text")]//a//@href';
      const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      if (node && node.singleNodeValue) {
        return node.singleNodeValue.nodeValue;
      } else {
        return false;
      }
    });

    console.log('!!!!path');

    console.log(path);

    if (path) {
      await dependencies.goto({ url: `https://${domain}${path}` });

      await context.waitForFunction(function (sel, xp) {
        return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
      }, { timeout: 10000 }, 'div#product, h1#productName', parameters.noResultsXPath);

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
  return hasProduct;
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    domain: 'walgreens.com',
    loadedSelector: 'div.card__product',
    noResultsXPath: '//h1[contains(@id, "zero-result-alert")]|//span[contains(text(), "This product is no longer available on our site.")]',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
  },
  implementation,
};
