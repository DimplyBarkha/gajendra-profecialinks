
async function implementation (
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

  // Click on load more
  const clickLoadMore = async function (context) {
    let productsCount = 0;
    while (productsCount < 150) {
      productsCount = await context.evaluate(function () {
        const products = document.evaluate('//div[contains(@id,\'search-lane\')]//article//div//img[contains(@data-testhook,\'product-image\')]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        return products.snapshotLength;
      });

      // Check if load more exists
      const doesLoadMoreExists = await context.evaluate(function () {
        return Boolean(document.querySelector('button.display-more-products'));
      });

      if (doesLoadMoreExists) {
        console.log('Clicking on load more btn');
        // @ts-ignore
        await context.click('button.display-more-products');
        await stall(10000);
      } else {
        console.log('load more btn is not present - ' + doesLoadMoreExists);
        break;
      }
    }
  };

  function stall (ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  await clickLoadMore(context);

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
    country: 'FR',
    store: 'courir',
    domain: 'courir.com',
    url: 'https://www.courir.com/fr/search?q={searchTerms}&lang=fr_FR',
    loadedSelector: 'ul.search-result-items',
    noResultsXPath: 'div.page-product-search-noresult',
  },
  implementation,
};
