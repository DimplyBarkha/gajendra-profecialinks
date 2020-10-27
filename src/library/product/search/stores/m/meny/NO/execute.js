async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  const applyScroll = async function (context) {
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 20000) {
        // const seeAllSelector = document.querySelector("div[id='ws-search-block-products']>button[class*='ws-link']");
        // if (seeAllSelector) {
        //   console.log('See all selector found');
        //   seeAllSelector.click()
        //   console.log('See all selector clicked');
        //   await new Promise(resolve => { setTimeout(resolve, 20000) })
        // }

          const products = document.evaluate('//li[@class="ws-product-list-vertical__item"]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          const productsCount = products.snapshotLength;
          scrollTop += 1000;
          window.scroll(0, scrollTop);
          const doesLoadMoreExists = document.querySelector('button[class*="ws-button ws-button--primary"]');

          if (doesLoadMoreExists) {
            console.log('Clicking on load more btn');
            // @ts-ignore
            const doesLoadMoreExists = document.querySelector('button[class*="ws-button ws-button--primary"]');
            document.querySelector('button[class*="ws-button ws-button--primary"]').click();
            await stall(10000);
          } else {
            console.log('load more btn is not present - ' + doesLoadMoreExists);
            break;
          }
          if (scrollTop === 20000 || productsCount > 160) {
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
    country: 'NO',
    store: 'meny',
    domain: 'meny.no',
    url: 'https://meny.no/Sok/?query={searchTerms}',
    loadedSelector: 'picture[class="ws-product-vertical__image"]',
    noResultsXPath: null,
    zipcode: '',
  },
  implementation
};


