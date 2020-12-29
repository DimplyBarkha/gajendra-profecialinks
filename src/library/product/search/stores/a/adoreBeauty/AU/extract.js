const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adoreBeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: "''",
    mergeType: 'MERGE_ROWS',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform, mergeType } = parameters;
    // async function getProductsCount(context) {
    //   return context.evaluate(async function () {
    //     const products = document.evaluate("//div[@class='ais-InfiniteHits']//li[contains(@class,'ais-InfiniteHits-item')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //     return products.snapshotLength;
    //   });
    // }
    // let productsCount = 0;
    // while (productsCount < 150) {
    //   const doesLoadMoreExists = await context.evaluate(function () {
    //     return Boolean(document.querySelector('.ais-InfiniteHits > button[disabled="disabled"]'));
    //   });
    //   productsCount = await getProductsCount(context);
    //   console.log('productsCount' + productsCount);
    //   if (productsCount >= 150) {
    //     break;
    //   }
    //   if (!doesLoadMoreExists) {

    //     await context.evaluate(async function () {
    //       console.log('Clicking on load more button');
    //       const btn = document.evaluate('//button[contains(.,"More Products")][not(contains(@disabled,"disabled"))]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
    //       for (let i = 0; i < btn.snapshotLength; i++) {
    //         //@ts-ignore
    //         btn.snapshotItem(i).click();
    //       }
    //       await new Promise((resolve, reject) => setTimeout(resolve, 10000));

    //     });

    //   }
    // }

    async function addProductCode () {
      async function getProductCodeFromUrl (url) {
        const response = await fetch(url);
        const html = await response.text();
        const code = html.match(/(meta itemprop="sku" content=|"code":)"([^"]+)/);
        if (!code) return '';
        return code[2];
      }
      const nodes = Array.from(document.querySelectorAll('a[class*="border-neutral-600"]'));
      const urls = nodes.map(elm => elm.href);
      const promises = urls.map(url => getProductCodeFromUrl(url));
      const productCodes = await Promise.all(promises);
      await Promise.all(promises);
      for (let index = 0; index < nodes.length; index++) {
        nodes[index].setAttribute('product-code', productCodes[index]);
      }
    }
    await context.evaluate(addProductCode);
    const mergeOptions = !mergeType ? { transform } : { transform, type: mergeType };
    const data = await context.extract(productDetails, mergeOptions);
    return { data, mergeType };
  },
};
