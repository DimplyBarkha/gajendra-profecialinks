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
  console.log('results : ', inputs.results);

  // Check if accept cookies dialog pops up
  const doesAcceptCookiesBtnExists = await context.evaluate(function () {
    return Boolean(document.querySelector('#accept-cookies'));
  });

  if (doesAcceptCookiesBtnExists) {
    console.log('Clicking on accept cookies btn');
    await context.click('#accept-cookies');
    await context.waitForNavigation();
  }

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }

  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function (results) {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        // Check if load more exists
        const doesLoadMoreExists = document.querySelector('button[data-testhook="load-more"]');

        if (doesLoadMoreExists) {
          console.log('Clicking on load more btn');
          // @ts-ignore
          document.querySelector('button[data-testhook="load-more"]').click();
          await stall(5000);
        } else {
          console.log('load more btn is not present - ' + doesLoadMoreExists);
          break;
        }

        const products = document.evaluate('//div[contains(@id,\'search-lane\')]//article//div//img[contains(@data-testhook,\'product-image\')]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000 || productsCount > results) {
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
    }, inputs.results);
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
    country: 'NL',
    store: 'albertheijn',
    domain: 'ah.nl',
    url: 'https://www.ah.nl/zoeken?query={searchTerms}',
    loadedSelector: '#search-lane > div[data-testhook="search-lane"]',
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")] | //p[contains(.,"niet ge­von­den")]',
  },
  implementation,
};
