async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  let url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  // await dependencies.goto({ url, zipcode: inputs.zipcode });
  // -------------Search--------------------------
  const timeout = parameters.timeout ? parameters.timeout : 10000;
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  await context.goto('https://shop.coles.com.au/', {
    firstRequestTimeout: 60000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
  });
  // -------------To set location-----------------
  await context.waitForSelector("button[id*='changeLocationBar']");
  await context.click("button[id*='changeLocationBar']");
  await context.waitForSelector("input[id*='localisation-search']");
  await context.setInputValue("input[id*='localisation-search']", 'WAURN PONDS, 3216');
  await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)");
  await context.clickAndWaitForNavigation("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", {}, { timeout: 20000 });
  await context.waitForSelector("input[id*='localisation-search']", { timeout: 20000 });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // ------------- GoTo requried URL --------------
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]`;
  await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
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
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_3216',
    domain: 'shop.coles.com.au',
    url: 'https://shop.coles.com.au/a/waurn-ponds/everything/search/{searchTerms}?pageNumber=1',
    loadedSelector: "section[id*='product-list']",
    noResultsXPath: "//span[contains(@id,'emptyCatalogEntryList')] | //h1[contains(@class,'heading-error-404')] | //div[contains(@class,'error-wrapper')]",
    zipcode: '',
  },
  implementation,
};
