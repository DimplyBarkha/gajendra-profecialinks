
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
    loadedSelector: 'h1[class="product-title"]',
    noResultsXPath: null,
    reviewUrl: 'https://www.kruidvat.nl/search?q={id}&text={id}&searchType=manual',
    sortButtonSelectors: null,
    zipcode: '',
  },
  implementation,
};
async function implementation(
  { url, id, zipcode, date, days },
  { reviewUrl, sortButtonSelectors, loadedSelector, noResultsXPath },
  context,
  dependencies,
) {
  const patternReplace = () => {
    if (!reviewUrl) throw new Error('No pattern provided to generate a valid URL');
    let tempUrl = reviewUrl;
    if (id) tempUrl = tempUrl.replace(/{id}/g, encodeURIComponent(id));
    if (date) tempUrl = tempUrl.replace(/{date}/g, encodeURIComponent(date));
    if (days) tempUrl = tempUrl.replace(/{days}/g, encodeURIComponent(days));
    return tempUrl;
  };
  const destinationUrl = url || patternReplace();

  await dependencies.goto({ url: destinationUrl, zipcode });

  await context.waitForFunction((sel) => {
    return Boolean(document.querySelector(sel));
  }, { timeout: 10000 }, 'section[class="tile__product-slide-content"]');

  const finalURL = await context.evaluate(async function () {
    let searchURL = document.querySelector('div[class="tile__product-slide-image-container"] a').getAttribute('href');
    return 'https://www.kruidvat.nl' + searchURL;
  });
  await context.setCssEnabled(true);
  await context.setAntiFingerprint(false);
  await context.setJavaScriptEnabled(true);
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  const inputUrl = `${finalURL}#[!opt!]{"discard_CSP_header":true, "block_ads": false}[/!opt!]`;
  await context.goto(inputUrl, { timeout: 30000, waitUntil: 'load', checkBlocked: true });

  if (sortButtonSelectors) {
    const selectors = sortButtonSelectors.split('|');
    for (const selector of selectors) {
      await context.click(selector);
    }
  }
  if (loadedSelector) {
    await context.waitForFunction((sel, xp) => {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
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