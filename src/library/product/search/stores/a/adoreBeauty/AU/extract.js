const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'adoreBeauty',
    transform,
    domain: 'adorebeauty.com.au',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productDetails } = dependencies;
    const { transform } = parameters;

    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(500);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(8000);
          break;
        }
      }
      function stall (ms) {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    
    const optionalWait = async (sel) => {
      async function getProductsCount (context) {
        return context.evaluate(async function () {
          const products = document.evaluate("//div[@class='ais-InfiniteHits']//li[contains(@class,'ais-InfiniteHits-item')]", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          return products.snapshotLength;
        });
      }
      

      let productsCount = 0;
      while (productsCount < 150) {
        const doesLoadMoreExists = await context.evaluate(function () {
          return Boolean(document.querySelector('div.ais-InfiniteHits > button'));
        });

        if (doesLoadMoreExists) {
          await context.evaluate(async function () {
            console.log('Clicking on load more button');
            document.querySelector(' div.ais-InfiniteHits > button').click();
            await new Promise((resolve, reject) => setTimeout(resolve, 10000));
          });
          productsCount = await getProductsCount(context);
          console.log('productsCount' + productsCount);
          if (productsCount >= 150) {
            break;
          }
          //  await applyScroll(context);
        } else {
          break;
        }
      }

      try {
        await context.waitForSelector(sel, { timeout: 30000 });
        console.log(`Selector => "${sel}" loaded`);
        return true;
      } catch (err) {
        console.log(`Selector => ${sel} did not load.`);
        return false;
      }
    };

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
    return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
  },
};
