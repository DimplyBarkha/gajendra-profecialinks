async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  var brandid = keywords;
  if (keywords.toLowerCase().includes('velo')) {
    brandid = 'velo?brand=344';
  } else if (keywords.toLowerCase().includes('zyn')) {
    brandid = 'zyn?brand=267';
  } else if (keywords.toLowerCase().includes('on!')) {
    brandid = 'on?brand=263';
  } else if (keywords.toLowerCase().includes('rogue')) {
    brandid = 'rogue?brand=360';
  } else {
    brandid = brandid + '?';
  }
  const destinationUrl = url.replace(/{searchTerms}/g, brandid);
  await dependencies.goto({ ...inputs, url: destinationUrl });

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 20000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'nicokick',
    domain: 'nicokick.com',
    url: 'https://nicokick.com/us/nicotine-pouches/{searchTerms}&product_list_limit=all',
    loadedSelector: 'div#layer-product-list',
    noResultsXPath: '//*[contains(text(),"Your search returned no results")]',
    zipcode: '',
  },
  implementation,
};
