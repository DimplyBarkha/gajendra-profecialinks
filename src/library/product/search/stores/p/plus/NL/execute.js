
async function implementation (
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

  const doesAcceptCookiesBtnExists = await context.evaluate(function () {
    return Boolean(document.querySelector('button[id="cookies-action"]'));
  });

  if (doesAcceptCookiesBtnExists) {
    console.log('Clicking on accept cookies btn');
    await context.click('button[id="cookies-action"]');
    await context.waitForNavigation();
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
        const searchUrl = window.location.href;
        const appendElements = document.querySelectorAll('li[class*="ish-productList-item"]');
        if (appendElements.length) {
          appendElements.forEach((element) => {
            if (element.getAttribute('searchurl') == null) {
              element.setAttribute('searchurl', searchUrl);
            }
          });
        }
        await new Promise(resolve => setTimeout(resolve, 20000));

        // Check if load more exists
        const doesLoadMoreExists = document.querySelector('button[id="showMoreProducts"]');

        if (doesLoadMoreExists) {
          console.log('Clicking on load more btn');
          // @ts-ignore
          document.querySelector('button[id="showMoreProducts"]').click();
          await stall(10000);
        } else {
          console.log('load more btn is not present - ' + doesLoadMoreExists);
          break;
        }

        const products = document.evaluate('//li[@class="ish-productList-item"]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        scrollTop += 3000;
        window.scroll(0, scrollTop);
        if (scrollTop >= 80000 || productsCount > 160) {
          await stall(10000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
  };

  await applyScroll(context);
  await context.evaluate(() => {
    const searchUrl = window.location.href;
    const appendElements = document.querySelectorAll('li[class*="ish-productList-item"]');
    if (appendElements.length) {
      appendElements.forEach((element) => {
        if (element.getAttribute('searchurl') == null) {
          element.setAttribute('searchurl', searchUrl);
        }
      });
    }
  });

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
    country: 'NL',
    store: 'plus',
    domain: 'plus.nl',
    url: 'https://www.plus.nl/zoekresultaten?SearchTerm={searchTerms}',
    loadedSelector: 'img[class="lazy"]',
    noResultsXPath: '//div[@class="ish-search-noResults-block"]//div//p',
    zipcode: '',
  },

  implementation,
};
