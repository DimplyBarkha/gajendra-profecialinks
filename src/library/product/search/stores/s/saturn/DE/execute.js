
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      let documentScrollHeight = document.body.scrollHeight;
      while (scrollTop < documentScrollHeight) {
        await stall(2000);
        scrollTop += 600;
        window.scroll(0, scrollTop);
        documentScrollHeight = document.body.scrollHeight;
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

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  const productsCount = await context.evaluate(async function () {
    const element = document.evaluate('//div[@data-test=\'mms-search-srp-headlayout\']//div[contains(@class,\'HeadLayout__StyledHeadline\')]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (element.singleNodeValue) {
      let count = parseInt(element.singleNodeValue.textContent.match(/(\d+)/g)[0]);
      count = count % 12 > 0 ? Math.floor(count / 12) + 1 : count / 12;
      return count;
    }
    return false;
  });

  // Assuming 15 times load more to fetch maximum 150 products
  for (let i = 0; i < 15; i++) {
    const loadMoreLink = await context.evaluate((selector) => !!document.querySelector(selector), 'button[data-test="mms-search-srp-loadmore"]');
    const currentPage = await context.evaluate(function () {
      const doPagesExist = document.URL.match(/page=(\d+)/g);
      if (doPagesExist) {
        return parseInt(doPagesExist[0].replace('page=', ''));
      }
      return false;
    });
    console.log('current page' + currentPage + 'estimated products' + productsCount);

    if (productsCount === false || productsCount === 1) {
      // Scroll down the page to load results
      await applyScroll(context);
      break;
    }

    if (productsCount <= currentPage) {
      break;
    }

    if (loadMoreLink) {
      console.log('Clicking load more', loadMoreLink);
      await context.click('button[data-test="mms-search-srp-loadmore"]');
      if (parameters.loadedSelector) {
        await context.waitForFunction(function (sel, xp) {
          return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
        }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
      }
    }
    // Scroll down the page to load results
    await applyScroll(context);
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
    country: 'DE',
    store: 'saturn',
    domain: 'saturn.de',
    url: 'https://www.saturn.de/de/search.html?query={searchTerms}',
    loadedSelector: 'div[data-test="mms-search-srp-productlist"]',
    noResultsXPath: '//div[contains(@class,"ZeroResultsView")]',
  },
  implementation,
};
