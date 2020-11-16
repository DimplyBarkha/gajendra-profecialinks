async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  const responseStatus = await context.goto(url, {
    firstRequestTimeout: 10000,
    waitUntil: 'load',
    checkBlocked: false,
  });
  console.log('Status :', responseStatus.status);
  console.log('URL :', responseStatus.url);
  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, {
      timeout: 10000,
    }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        const products = document.evaluate('//img[@data-sizes="auto"]/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        console.log('Length: ' + productsCount);
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000 || productsCount > 160) {
          await stall(10000);
          await stall(5000);
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
      const loadProducts = async function (contenxt) {
          await context.evaluate(async function () {
              function stall(ms) {
                  return new Promise((resolve, reject) => {
                      setTimeout(() => {
                          resolve();
                      }, ms);
                  });
              }
              let products = document.evaluate('//img[@data-sizes="auto"]/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
              let productsCount = products.snapshotLength;
              const seeAllSelector = document.querySelector('div[class="show-more"] > button');
              while (productsCount <= 150 && seeAllSelector !== null) {
                  console.log('Length: ' + productsCount);
                  seeAllSelector.click();
                  await stall(1000);
                  products = document.evaluate('//img[@data-sizes="auto"]/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
                  productsCount = products.snapshotLength;
                  console.log("count button");
            };
        });
    };
    await applyScroll(context);
    await loadProducts(context);
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
        country: 'IN',
        store: 'Bigbasket_Mweb',
        domain: 'bigbasket_Mweb.in',
        url: 'https://www.bigbasket.com/ps/?q={searchTerms}',
        loadedSelector: 'img[data-sizes="auto"]',
        noResultsXPath: '//div[@class="uiv2-no-results-new"]',
        zipcode: '',
    },
    implementation,
};