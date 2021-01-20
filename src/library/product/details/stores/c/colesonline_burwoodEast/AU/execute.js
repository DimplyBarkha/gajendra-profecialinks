// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   let { url, id } = inputs;
//   if (!url) {
//     if (!id) {
//       throw new Error('no id provided');
//     }
//     url = await dependencies.createUrl({ id });
//   }
//   // await dependencies.goto({ url, zipcode, storeId });
//   const timeout = parameters.timeout ? parameters.timeout : 10000;
//   await context.setBlockAds(false);
//   await context.setLoadAllResources(true);
//   await context.setLoadImages(true);
//   await context.setJavaScriptEnabled(true);
//   await context.setAntiFingerprint(false);
//   await context.goto('https://shop.coles.com.au/#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]', {
//     firstRequestTimeout: 60000,
//     timeout: timeout,
//     waitUntil: 'load',
//     checkBlocked: false,
//   });
//   const locationSet = await context.evaluate(() => {
//     const location = document.querySelector("span[class*='localised-suburb']") ? document.querySelector("span[class*='localised-suburb']").innerText : '';
//     return location.includes('Burwood East');
//   });
//   // -------------To set location-----------------
//   if (!locationSet) {
//     await context.waitForSelector("button[id*='changeLocationBar']", { timeout: 30000 });
//     await context.click("button[id*='changeLocationBar']");
//     await context.waitForSelector("input[id*='localisation-search']", { timeout: 30000 });
//     await context.setInputValue("input[id*='localisation-search']", 'Burwood East');
//     await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", { timeout: 30000 });
//     await context.clickAndWaitForNavigation("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", {}, { timeout: 60000 });
//     await context.waitForSelector("input[id*='localisation-search']", { timeout: 60000 });
//     await new Promise((resolve) => setTimeout(resolve, 2000));
//   }
//   // ------------- GoTo requried URL --------------
//   await context.setBlockAds(false);
//   await context.setLoadAllResources(true);
//   await context.setLoadImages(true);
//   await context.setJavaScriptEnabled(true);
//   await context.setAntiFingerprint(false);
//   url = `${url}#[!opt!]{"block_ads":false,"anti_fingerprint":false,"load_all_resources":true}[/!opt!]`;
//   await context.goto(url, {
//     firstRequestTimeout: 60000,
//     timeout: timeout,
//     waitUntil: 'load',
//     checkBlocked: false,
//   });
//   if (id) {
//     await new Promise((resolve) => setTimeout(resolve, 6000));
//     const link = await context.evaluate(() => {
//       const link = document.querySelector("section[id*='product-list'] a[class*='product-image-link']") ? document.querySelector("section[id*='product-list'] a[class*='product-image-link']").getAttribute('href') : '';
//       return link;
//     });
//     console.log('Link:::', link);
//     await context.goto('https://shop.coles.com.au' + link, {
//       firstRequestTimeout: 60000,
//       timeout: 60000,
//       waitUntil: 'load',
//       checkBlocked: false,
//     });
//   }
//   if (parameters.loadedSelector) {
//     await context.waitForFunction(function (sel, xp) {
//       return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
//     }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
//   }

//   // TODO: Check for not found?
// }
async function implementation(
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
  const locationSet = await context.evaluate(() => {
    // @ts-ignore
    const location = document.querySelector("span[class*='localised-suburb']") ? document.querySelector("span[class*='localised-suburb']").innerText : '';
    return location.includes('Burwood East');
  });
  // -------------To set location-----------------
  if (!locationSet) {
    try {
      await context.waitForSelector("button[id*='changeLocationBar']");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log('error: ', error);
    }
    // await context.evaluate(async () => {
    //   const button = document.querySelector("button[id*='changeLocationBar']") ? document.querySelector("button[id*='changeLocationBar']") : '';
    //   if (button) {
    //     // @ts-ignore
    //     button.click();
    //   }
    //   let setInputValue = document.querySelector("input[id*='localisation-search']");
    //   if(setInputValue){
    //     // @ts-ignore
    //     setInputValue.value = "Burwood East";
    //   }
    //   await new Promise((resolve) => setTimeout(resolve, 2000));
    //   let clickFirstOption = document.querySelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)");
    //   if(clickFirstOption){
    //     // @ts-ignore
    //     clickFirstOption.click();
    //   }
    //   await new Promise((resolve) => setTimeout(resolve, 2000));
    // });
    await context.click("button[id*='changeLocationBar']");
    await context.waitForSelector("input[id*='localisation-search']");
    await context.setInputValue("input[id*='localisation-search']", 'Burwood East');
    await context.waitForSelector("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)");
    await context.clickAndWaitForNavigation("div[id*='search-autocomplete'] li[role*='option']:nth-child(1)", {}, { timeout: 20000 });
    await context.waitForSelector("input[id*='localisation-search']", { timeout: 20000 });
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
  await new Promise((resolve) => setTimeout(resolve, 3000));
  if (id) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
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
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
  // if (parameters.loadedSelector) {
  //   await context.waitForFunction(function (sel, xp) {
  //     return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
  //   }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  // }
}
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_burwoodEast',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div.product-image',
    // loadedSelector: 'div[class*="product-hero-image-container"] img',
    noResultsXPath: "//h1[contains(@class,'error-heading')] | //nav[not(contains(@class,'ng-hide'))]//ol[contains(@id,'tablist')]//li",
    zipcode: '',
  },
  implementation,
};
