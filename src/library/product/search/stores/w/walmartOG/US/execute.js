
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    domain: 'grocery.walmart.com',
    url: null,
    loadedSelector: 'div[data-automation-id="productsList"] div[data-automation-id="productTile"]',
    noResultsXPath: '//div[@data-automation-id="productsListPage"]//*[@data-automation-id="noResultsSearchTerm"]',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { timeout = 20000, waitUntil = 'load', checkBlocked = true } = {};
    const domain = 'grocery.walmart.com';
    const mainUrl = `https://${domain}`;
    const searchTerms = inputs.keywords;
    await context.goto(mainUrl, { timeout, waitUntil, checkBlocked });
    await context.evaluate(async function () {
      if (document.querySelector('div.ReactModalPortal')) {
        document.querySelector('div.ReactModalPortal').remove();
      }
    });
    await context.waitForSelector('button[label="Change store"]');
    await context.evaluate(async function () {
      const button = document.querySelector('button[label="Change store"]');
      if (button) {
        button.click();
      }
    });
    await context.waitForSelector('input[data-automation-id="zipSearchField"]');
    await context.setInputValue('input[data-automation-id="zipSearchField"]', '72758');
    await context.click('button[data-automation-id="zipSearchBtn"]');

    await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]');
    await context.waitForSelector('li[data-automation-id="selectFlyoutItem"]:first-child input');
    await context.evaluate(async function () {
      const searchZipCode = document.querySelector('input[data-automation-id="selectFlyoutItemBtn"]:first-child');
      if (searchZipCode !== undefined) {
        searchZipCode.click();
      }
    });

    await context.click('button[data-automation-id="locationFlyout-continueBtn"]');
    await context.waitForSelector('button[data-automation-id="confirmFulfillmentBtn"]');
    await context.click('button[data-automation-id="confirmFulfillmentBtn"]');
    const searchUrl = `https://grocery.walmart.com/search/?query=${searchTerms}`;
    // await context.goto(searchUrl, { timeout, waitUntil, checkBlocked });
    await context.goto(searchUrl);
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
  },
};

// module.exports = {
//   implements: 'product/details/createUrl',
//   parameterValues: {
//     domain: 'walgreens.com',
//     prefix: null,
//     url: null,
//     store: 'walgreens',
//     country: 'us',
//   },
//   implementation: async ({ id }, parameters, context, dependencies) => {
//     const { timeout = 20000, waitUntil = 'load', checkBlocked = true } = {};
//     const domain = 'walgreens.com';
//     const searchUrl = `https://${domain}/search/results.jsp?Ntt=${id}`;
//     // await gotoUrl({ url: searchUrl }, { domain }, context);
//     await context.goto(searchUrl, { timeout, waitUntil, checkBlocked });
//     const path = await context.evaluate(() => {
//       const xpathFirstResult = '//div[@id="product-row-0"]//a[@name="product-title"]/@href';
//       const node = document.evaluate(xpathFirstResult, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//       if (node && node.singleNodeValue) {
//         return node.singleNodeValue.nodeValue;
//       } else {
//         return false;
//       }
//     });
//     if (!path) {
//       context.extract('product/details/stores/w/walgreens/us/extract')
//         .then(() => {
//           throw new Error('404: Item not found');
//         });
//     } else {
//       console.log(`https://${domain}${path}`);
//       return `https://${domain}${path}`;
//     }
//   },
// };
