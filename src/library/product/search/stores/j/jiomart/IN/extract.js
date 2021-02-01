const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.click('button[data-dismiss="modal"]', { timeout: 3000 })
    .catch(() => console.log('No modal present!'));

  // scroll, scroll!
  await context.evaluate(async () => {
    let moreResults = document.evaluate('boolean(//button[@class="ais-InfiniteHits-loadMore" and not(@disabled)])', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
    let numResultsOnPage = 0;

    while (moreResults && numResultsOnPage < 150) {
      window.scrollTo(0, document.body.scrollHeight);
      document.querySelector('button.ais-InfiniteHits-loadMore').click();
      await new Promise((resolve, reject) => setTimeout(resolve, 4000));

      moreResults = document.evaluate('boolean(//button[@class="ais-InfiniteHits-loadMore" and not(@disabled)])', document, null, XPathResult.BOOLEAN_TYPE, null).booleanValue;
      numResultsOnPage = document.querySelectorAll('div[class*=cat-item]').length;
    }
  });

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'jiomart',
    transform,
    domain: 'jiomart.com',
    zipcode: '',
  },
  implementation,
};
