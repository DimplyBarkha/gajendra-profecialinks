const { transform } = require('../../../../shared');

const implementation = async (inputs, parameters, context, dependencies) => {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const addSku = async function (context) {
    await context.evaluate(async function () {
      const regex = /(?<=\w\/\w\/\w\/).+(?=_.jpg|_\w.jpg)/;
      const skuList = document.querySelectorAll('.result-thumbnail > img');
      skuList.forEach((sku) => {
        // @ts-ignore

        let skuRaw = sku.src.match(regex);
        if (!skuRaw) {
          return;
        } else {
          skuRaw = skuRaw[0];
        }
        if (
          (skuRaw.includes('_') && skuRaw.slice(-5).includes('duplo')) ||
          skuRaw.includes('_ml_duplokit') ||
          skuRaw.includes('_mlph')
        ) {
          skuRaw = skuRaw.slice(-11);
          sku.setAttribute('sku', skuRaw);
          return;
        }
        if (skuRaw.includes('_burdeos')) {
          skuRaw = skuRaw.slice(-9);
          sku.setAttribute('sku', skuRaw);
          return;
        }
        if (skuRaw.slice(-4).includes('x2_')) {
          skuRaw = skuRaw.slice(-9, -1);
          sku.setAttribute('sku', skuRaw);
          return;
        }
        if (skuRaw.includes('duplo_mf')) {
          skuRaw = skuRaw.slice(-8);
          sku.setAttribute('sku', skuRaw);
          return;
        }

        if (skuRaw.includes('_')) {
          skuRaw = skuRaw.slice(-6);
          sku.setAttribute('sku', skuRaw);
        } else {
          sku.setAttribute('sku', skuRaw);
        }
      });
    });
  };
  await context.evaluate(async function () {
    let scrollTop = 0;
    while (scrollTop <= 10000) {
      await stall(200);
      scrollTop += 1000;
      window.scroll(0, scrollTop);
      if (scrollTop === 10000) {
        await stall(200);
        break;
      }
    }
    function stall (ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
  });

  await context.evaluate(() => {
    const rating = document.querySelectorAll('.rating');
    rating.forEach((el) => {
      // @ts-ignore
      const trimmedAndDivided = el.style.width.slice(0, -1) / 20;
      const numericRate1Decimal = trimmedAndDivided.toFixed(1);
      el.setAttribute('numericrating', numericRate1Decimal);
    });
  });
  const addSearchUrl = async function (context) {
    await context.evaluate(async function () {
      const productList = document.querySelectorAll('.ais-hits > div');
      const url = window.location.href;
      productList.forEach((product) => product.setAttribute('searchurl', url));
    });
  };
  await addSearchUrl(context);
  await addSku(context);

  return await context.extract(productDetails, { transform });
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    transform,
    domain: 'mifarma.es',
    zipcode: '',
  },
  implementation,
};
