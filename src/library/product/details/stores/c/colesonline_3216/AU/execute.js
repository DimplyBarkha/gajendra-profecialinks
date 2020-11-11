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
  // await dependencies.goto({ url, zipcode, storeId });
  const timeout = parameters.timeout ? parameters.timeout : 10000;
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  await context.goto('https://shop.coles.com.au/#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', {
    firstRequestTimeout: 60000,
    timeout: timeout,
    waitUntil: 'load',
    checkBlocked: false,
  });
  const locationSet = await context.evaluate(() => {
    const location = document.querySelector("span[class*='localised-suburb']") ? document.querySelector("span[class*='localised-suburb']").innerText : '';
    return location.includes('Waurn Ponds, VIC');
  });
  // -------------To set location-----------------
  if (!locationSet) {
    await context.waitForSelector("button[id*='changeLocationBar']", { timeout: 30000 });
    await context.click("button[id*='changeLocationBar']");
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 30000 });
    await context.setInputValue("input[id*='localisation-search']", 'WAURN PONDS, 3216');
    await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", { timeout: 30000 });
    await context.clickAndWaitForNavigation("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", {}, { timeout: 60000 });
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
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
  await new Promise((resolve) => setTimeout(resolve, 6000));
  const link = await context.evaluate(() => {
    const link = document.querySelector("section[id*='product-list'] a[class*='product-image-link']") ? document.querySelector("section[id*='product-list'] a[class*='product-image-link']").getAttribute('href') : '';
    return link;
  });
  console.log('Link:::', link);
  await context.goto('https://shop.coles.com.au' + link, {
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // TODO: Check for not found?
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_3216',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div[class*="product-hero-image-container"] img',
    noResultsXPath: "//h1[contains(@class,'error-heading')] | //nav[not(contains(@class,'ng-hide'))]//ol[contains(@id,'tablist')]//li",
    zipcode: '',
  },
  implementation,
};
