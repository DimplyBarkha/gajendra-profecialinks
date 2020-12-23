

async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));

  const responseStatus = await context.goto(url, {
    firstRequestTimeout: 60000,
    timeout: 60000,
    waitUntil: 'load',
    checkBlocked: false,
  });

  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);
  try {
    await context.waitForSelector('div[class="buttons"]>button[class*="btn green"]', { timeout: 10000 });
    console.log('cookies selector is present');
  } catch (e) {
    console.log('cookies button is not present');
  }

  const doesAcceptCookiesBtnExists = await context.evaluate(function () {
    return Boolean(document.querySelector('div[class="buttons"]>button[class*="btn green"]'));
  });

  if (doesAcceptCookiesBtnExists) {
    console.log('Clicking on accept cookies btn');
    await new Promise(resolve => { setTimeout(resolve, 2000); });
    await context.evaluate(function () {
      document.querySelector('div[class="buttons"]>button[class*="btn green"]').click();
    });
    await context.waitForNavigation({ timeout: 10000 });
    console.log('Clickicked sucessfully');
  }
  try {
    await context.waitForSelector('.product .price', { timeout: 10000 });
    console.log('selector of price exist');
  } catch (e) {
    console.log("selector of price doesn't exist");
  }
  const checkSelectorExistence = async (selector) => {
    return await context.evaluate(async (currentSelector) => {
      return await Boolean(document.querySelector(currentSelector));
    }, selector);
  };
  const selectorExists = await checkSelectorExistence('.subnavigation-body a.sub-link[href*="root"]');
  if (selectorExists) {
    await context.click('.subnavigation-body a.sub-link[href*="root"]');
    await context.waitForNavigation({ timeout: 10000 });
    console.log('clicked the button successfully');
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        const doesLoadMoreExists = document.querySelector('div.show-more-wrapper button');

        if (doesLoadMoreExists) {
          console.log('Clicking on load more btn');
          // @ts-ignore
          document.querySelector('div.show-more-wrapper button').click();
          await stall(5000);
        } else {
          console.log('load more btn is not present - ' + doesLoadMoreExists);
          break;
        }

        const products = document.evaluate('//div[@class="product-grid"]//div[@class="product"]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        scrollTop += 3000;
        await stall(2000);
        window.scroll(0, scrollTop);
        if (scrollTop >= 80000 || productsCount > 160) {
          await stall(2000);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);

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
    country: 'FI',
    store: 'stockmann',
    domain: 'stockmann.com',
    url: 'https://www.stockmann.com/haku?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//h1[@class="header page-title" and contains(text(),"Pahoittelemme, haullasi ei löytynyt tuloksia")]',
    zipcode: "''",
  },
  implementation,
};