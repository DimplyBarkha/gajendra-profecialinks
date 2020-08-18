
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
  url = url.replace('=/', '=');
  console.log(url);

  await dependencies.goto({ url });

  if (parameters.loadedSelector) {
    const hasProductPage = await context.waitForFunction(function (sel, xp) {
      console.log('waitForFunction');
      console.log(document.querySelector(sel));
      console.log(Boolean(document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()));
      console.log(Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext()));
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);

    console.log('hasProductPage');
    console.log(hasProductPage);
    if (hasProductPage === false) {
      return false;
    }
  }

  const path = await context.evaluate(() => {
    const xpathFirstResult = '//div[@id="product-row-0"]//a[@name="product-title"]/@href';
    const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (node && node.singleNodeValue) {
      return node.singleNodeValue.nodeValue;
    } else {
      return false;
    }
  });

  if (path) {
    await dependencies.goto({ url: `https://${domain}${path}` });

    const hadProductInfo = await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, 'div#product', parameters.noResultsXPath);

    console.log(hadProductInfo);
    if (!hadProductInfo) {
      return false;
    }
  }
  // TODO: Check for not found?
}

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'us',
    store: 'walgreens',
    domain: 'walgreens.com',
    loadedSelector: 'div.wag-product-card-details',
    noResultsXPath: '//h1[contains(@id, "zero-result-alert")]|//h1[contains(@id, "zero-result-alert")]|//span[contains(text(), "This product is no longer available on our site.")]',
  },
  dependencies: {
    goto: 'action:navigation/goto',
    createUrl: 'action:product/details/createUrl',
  },
  implementation,
};
