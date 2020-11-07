
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
  if (parameters.loadedSelector) {
    await context.waitForFunction( function (sel, xp){
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 50000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  // Apply scroll
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        const products = document.evaluate('//div[@class="searchResultsContainer active"]//img/@src', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const productsCount = products.snapshotLength;
        console.log('Length: ' + productsCount);
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000 || productsCount > 160) {
          await stall(10000);
          await stall(5000);
          break;
        }
      }
        function stall(ms){
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
    country: 'SE',
    store: 'apotekhjartat',
    domain: 'apotekhjartat.se',
    url: 'https://www.apotekhjartat.se/soksida/?query={searchTerms}&type=Products&sortBy=relevance%3Adesc&filter=requiresprescription%3Afalse&sortBy=relevance%3Adesc&count=150',
    loadedSelector: 'div[class="prodImageContainer"]>a',
    noResultsXPath: '//p[contains(@class,"noSearchResultText")]',
    zipcode: '',
  },
};
