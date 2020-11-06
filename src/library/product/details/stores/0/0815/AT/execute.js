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
  await dependencies.goto({ url, zipcode, storeId });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  await context.waitForSelector('.product-image-link');
  const pageLink = await context.evaluate(() => document.querySelector('.product-image-link').getAttribute('href'));
  const rpc = pageLink.split('/').pop();
  if (id.toString() === rpc.toString()) {
    await context.goto(pageLink, {
      blockAds: false,
      loadAllResources: true,
      imagesEnabled: true,
      timeout: 100000,
      waitUntil: 'networkidle0',
    });
    await context.waitForSelector('div[class*="is-button-buy"]', { timeout: 100000 });
    await context.evaluate(() => {
      const div = document.evaluate("//div[contains(@class,'product-detail-buy')]//div[contains(@class,'custom-price-style') and not (contains(@class,'instead'))]", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      div.innerText = div.innerText.replace(',', '.').replace('\n', '');
      const ava2 = document.createElement('div');
      ava2.setAttribute('id', 'availablity');
      ava2.innerText = 'In Stock';
      document.body.append(ava2);

      const desc = document.querySelector('div[class*="custom-detail-short-description"]').innerText;
      const name = document.querySelector('h2[class*="custom-detail-headline"]');
      name.innerText = name.innerText + ' ' + desc;
    });
  } else {
    await context.evaluate(() => {
      document.querySelector('meta[property="og:image"]').setAttribute('content', '');
    });
  }
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: '0815',
    domain: '0815.at',
    loadedSelector: "div[class*='product-listing-wrapper']",
    noResultsXPath: '//h1[not(contains(.,"1 Produ"))]',
    zipcode: '',
  },
  implementation,
};
