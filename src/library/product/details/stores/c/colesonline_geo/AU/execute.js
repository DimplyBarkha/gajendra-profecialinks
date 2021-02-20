
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { zipcode, url, id } = inputs;
  const { loadedSelector, noResultsXPath } = parameters;
  // -------------To set location-----------------
  await context.setBlockAds(false);
  await context.setLoadAllResources(true);
  await context.setLoadImages(true);
  await context.setJavaScriptEnabled(true);
  await context.setAntiFingerprint(false);
  const firstUrl = 'https://shop.coles.com.au#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]';
  await context.goto(firstUrl, {
    firstRequestTimeout: 90000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });
  try {
    await context.waitForSelector("button[id*='changeLocationBar']", { timeout: 30000 });
  } catch (error) {
    console.log('Main page not loaded!!');
  }
  const locationName = zipcode || 'Sydney, NSW';
  const locationSet = await context.evaluate(async function (locationName) {
    // @ts-ignore
    const checkLocation = document.querySelector("span[class*='localised-suburb']") ? document.querySelector("span[class*='localised-suburb']").innerText : '';
    return checkLocation.trim().replace(/\s/gm, '').replace(/,/gm, '').toLowerCase().includes(locationName.replace(/\d/gm, '').replace(/\s/gm, '').replace(/,/gm, '').toLowerCase());
  }, locationName);

  async function changeLocation (locationName) {
    console.log('locations-->', locationName);
    let searchValue = locationName.split(' ')[0];
    if (locationName.split(' ').length > 3) {
      searchValue = `${searchValue} ${locationName.split(' ')[1]}`;
    } else {
      if (searchValue.length < 3) {
        searchValue = `${searchValue} ${locationName.split(' ')[1]}`;
      }
    }
    await context.waitForSelector("button[id*='changeLocationBar']", { timeout: 30000 });
    await context.click("button[id*='changeLocationBar']");
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 30000 });
    await context.setInputValue('input[id*="localisation-search"]', searchValue);
    await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", { timeout: 30000 });
    const positionOfMatchedLocation = await context.evaluate(async function (locationName) {
      const searchResults = Array.from(document.querySelectorAll('div[id*="search-autocomplete"] li[role*="option"]'));
      let positionIndex = 1;
      for (let index = 0; index < searchResults.length; index++) {
        const element = searchResults[index];
        // @ts-ignore
        if (element.innerText.trim().replace(/\s/gm, '').replace(/,/gm, '').toLowerCase().includes(locationName.replace(/\s/gm, '').replace(/,/gm, '').toLowerCase())) {
          positionIndex = index + 1;
          break;
        }
      }
      return positionIndex;
    }, locationName);
    const clickElement = `div[id*='search-autocomplete'] li[role*='option']:nth-child(${positionOfMatchedLocation})`;
    await context.clickAndWaitForNavigation(clickElement, {}, { timeout: 60000 });
    const waitingXpathName = `//span[contains(@class,"localised-suburb") and contains(text(),"${searchValue.substring(1).toLowerCase()}")]`;
    try {
      await context.waitForXPath(waitingXpathName, { timeout: 60000 });
    } catch (error) {
      console.log('');
    }
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 60000 });
  }
  try {
    console.log('is location set : ', locationSet);
    if (!locationSet) {
      await changeLocation(locationName);
    }
  } catch (error) {
    console.log('Not able to set store lets try again!!!', error);
    if (!locationSet) {
      await changeLocation(locationName);
    }
  }

  // ------------- GoTo requried URL --------------
  let builtUrl;
  if (!url) {
    if (!id) throw new Error('No id provided');
    else builtUrl = await dependencies.createUrl(inputs);
    if (!builtUrl) return false; // graceful exit when not able to create a url
  }

  builtUrl = builtUrl ? `${builtUrl}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]` : '';

  async function gotoListingPage (builtUrl, url) {
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    await context.goto(builtUrl || url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  }
  let productUrl = '';
  if (!url) {
    await gotoListingPage(builtUrl, url);
    try {
      await context.waitForSelector('section[id*="product-list"] a[class*="product-image-link"]');
    } catch (error) {
      console.log('products url not presents!!');
      // check if actually product is not present!
      const IS_PRODUCT_PRESENT = await context.evaluate(() => !document.getElementById('emptyCatalogEntryList'));
      if (IS_PRODUCT_PRESENT) {
        await gotoListingPage(builtUrl, url);
        try {
          await context.waitForSelector('section[id*="product-list"] a[class*="product-image-link"]');
        } catch (error) {
          console.log('products url not presents after second try!!');
        }
      }
    }
    productUrl = await context.evaluate(async function (id) {
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
  } else {
    productUrl = url;
  }

  async function gotoDetailsPage (productUrl) {
    productUrl = productUrl.includes('http') ? productUrl : `https://shop.coles.com.au${productUrl}`;
    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setLoadImages(true);
    await context.setJavaScriptEnabled(true);
    await context.setAntiFingerprint(false);
    productUrl = `${productUrl}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true,"cookies":[]}[/!opt!]`;
    await context.goto(productUrl, {
      firstRequestTimeout: 90000,
      timeout: 60000,
      waitUntil: 'load',
      checkBlocked: false,
    });
  }
  console.log('productUrl:::', productUrl);
  if (productUrl) {
    await gotoDetailsPage(productUrl);
    try {
      await context.waitForSelector('div[class*="product-hero-image-container"] img');
    } catch (error) {
      console.log('products is not loaded completely !!');
      // load details page again
      await gotoDetailsPage(productUrl);
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
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_geo',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div[class*="product-hero-image-container"] img',
    noResultsXPath: '//h1[contains(@class,"error-heading")] | //nav[not(contains(@class,"ng-hide"))]//ol[contains(@id,"tablist")]//li | //*[@id="emptyCatalogEntryList"]',
    zipcode: '',
  },
  implementation,
};
