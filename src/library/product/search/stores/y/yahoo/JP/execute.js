async function implementation (
  inputs,
  { url, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const { keywords } = inputs;
  var brandid = keywords;
  if (keywords.toLowerCase().includes('glo')) {
    brandid = 'brandid=16215&p=glo';
  } else if (keywords.toLowerCase().includes('ploom')) {
    brandid = 'brandid=15874&p=ploom';
  } else {
    brandid = 'p=' + brandid;
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
    country: 'JP',
    store: 'yahoo',
    domain: 'yahoo.co.jp',
    url: 'https://shopping.yahoo.co.jp/search?{searchTerms}&tab_ex=commerce&area=13&sc_i=shp_pc_search_brand_slctim',
    loadedSelector: 'div#searchResults',
    noResultsXPath: '//span[contains(text(),"に一致する商品は見つかりませんでした。")]',
    zipcode: '',
  },
  implementation,
};
