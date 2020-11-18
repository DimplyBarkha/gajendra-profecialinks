
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  const { transform } = parameters;
  await context.evaluate(async function (context) {
    await context.waitForSelector('a[class="cmpboxbtn cmpboxbtnyes"]', { timeout: 70000 });
    const cookieSelector = document.querySelector('a[class = "cmpboxbtn cmpboxbtnyes"]');
    if (cookieSelector) {
      cookieSelector.click();
    }
    return await context.extract(productDetails, { transform });
  },

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
          const products = document.evaluate('//a[contains(@class,"productlist__tile")]/@href', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          const productsCount = products.snapshotLength;
          console.log('Length: ' + productsCount);
          await stall(1000);
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          if (scrollTop === 20000 || productsCount > 160) {
            await stall(5000);
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
    const loadProducts = async function (contenxt) {
      await context.evaluate(async function () {
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
    await loadProducts(context);
    console.log('Checking no results', parameters.noResultsXPath);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
  );
}
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'docmorris',
    domain: 'docmorris.de',
    url: 'https://www.docmorris.de/search?query={searchTerms}&page=0&resultsPerPage=108',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
