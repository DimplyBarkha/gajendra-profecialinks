
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_macquariePark',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div[class*="product-hero-image-container"] img',
    noResultsXPath: '//h1[contains(@class,"error-heading")] | //nav[not(contains(@class,"ng-hide"))]//ol[contains(@id,"tablist")]//li | //*[@id="emptyCatalogEntryList"]',
    zipcode: '',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { url, id } = inputs;
  const { loadedSelector, noResultsXPath } = parameters;
  // -------------To set location-----------------
  await context.goto('https://shop.coles.com.au', {
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });
  const locationSet = await context.evaluate(() => {
    // @ts-ignore
    const location = document.querySelector("span[class*='localised-suburb']") ? document.querySelector("span[class*='localised-suburb']").innerText : '';
    return location.includes('Macquarie Park, NSW');
  });

  async function changeLocation () {
    await context.waitForSelector("button[id*='changeLocationBar']", { timeout: 30000 });
    await context.click("button[id*='changeLocationBar']");
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 30000 });
    await context.setInputValue("input[id*='localisation-search']", 'macquarie park');
    await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", { timeout: 30000 });
    await context.clickAndWaitForNavigation("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", {}, { timeout: 60000 });
    await context.waitForXPath('//span[contains(@class,"localised-suburb") and contains(text(),"Macquarie Park, NSW")]', { timeout: 60000 });
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 60000 });
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  try {
    if (!locationSet) {
      await changeLocation();
    }
  } catch (error) {
    console.log('Not able to set store lets try again!!!', error);
    if (!locationSet) {
      await changeLocation();
    }
  }

  // ------------- GoTo requried URL --------------
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
    if (!builtUrl) return false; // graceful exit when not able to create a url
  }
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);

  builtUrl = builtUrl ? `${builtUrl}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]` : '';

  await context.goto(builtUrl || url, {
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });

  try {
    await context.waitForSelector('section[id*="product-list"] a[class*="product-image-link"]');
  } catch (error) {
    console.log('products url not presents!!');
  }

  let productUrl = await context.evaluate((id) => {
    const productXpath = `//h3[contains(@class,'product-title') and @data-partnumber="${id}"]//ancestor::section[contains(@id,'product-list')]//div[@tile='tile' and @data-ng-switch-when="product"]//a[contains(@class,'product-image-link')]`;
    let link = document.evaluate(productXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    console.log('url element : ', link);
    if (link) {
      // @ts-ignore
      return link.href;
    } else {
      // @ts-ignore
      link = document.querySelector("section[id*='product-list'] a[class*='product-image-link']") ? document.querySelector("section[id*='product-list'] a[class*='product-image-link']").getAttribute('href') : '';
      console.log('url--->', link);
      return link;
    }
  }, id);

  console.log('productUrl:::', productUrl);
  if (productUrl) {
    // await new Promise((resolve) => setTimeout(resolve, 6000));
    productUrl = productUrl.includes('http') ? productUrl : `https://shop.coles.com.au${productUrl}`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    productUrl = `${productUrl}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]`;
    await context.goto(productUrl, {
      firstRequestTimeout: 90000,
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: false,
    });
    try {
      await context.waitForSelector('div[class*="product-hero-image-container"] img');
    } catch (error) {
      console.log('products is not loaded completely !!');
    }
  }

  if (loadedSelector) {
    await context.waitForFunction(
      (selector, xpath) => {
        return !!(document.querySelector(selector) || document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue);
      },
      { timeout: 10000 },
      loadedSelector,
      noResultsXPath,
    );
  }
  return await context.evaluate((xpath) => !document.evaluate(xpath, document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue, noResultsXPath);

  // TODO: Check for not found?
}
