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
        const doesLoadMoreExists = document.querySelector('button[class*="js-load-more"]');

        if (doesLoadMoreExists) {
          console.log('Clicking on load more btn');
          // @ts-ignore
          document.querySelector('button[class*="js-load-more"]').click();
          await stall(10000);
        } else {
          console.log('load more btn is not present - ' + doesLoadMoreExists);
          break;
        }

        const products = document.evaluate('//ul[contains(@class,"tile-container")]/li', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        scrollTop += 3000;
        window.scroll(0, scrollTop);
        await stall(2000);
        if (scrollTop >= 40000 || productsCount > 150) {
          await stall(10000);
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
    country: 'UK',
    store: 'salon-services',
    domain: 'salon-services.com',
    url: 'https://www.salon-services.com/search?q={searchTerms}',
    loadedSelector: 'img[class="tile-image"]',
    noResultsXPath: `//div[@class="no-results_message"][contains(text(),"We're unable to locate any merchandise")] | //p[@class="search-result_result"][contains(text(),"resulted in no products")]`,
    zipcode: '',
  },
  implementation,
};
