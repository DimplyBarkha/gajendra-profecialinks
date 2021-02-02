const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa_mweb',
    transform: cleanUp,
    domain: 'nykaa.com',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { variants } = dependencies;
    const { transform } = parameters;

    const areVariants = await context.evaluate(() => {
      const sizeVariants = document.querySelectorAll('div[class*="sizes"]>ul>li>label>span');
      const variants = document.querySelectorAll('ul[class*="options-colors"]>li>label>span');
      return !!(sizeVariants.length || variants.length);
    });

    const slug = await context.evaluate(() => {
      const preloadedState = document.evaluate('//script[contains(text(), "window.__PRELOADED_STATE__")]', document, null, XPathResult.STRING_TYPE, null).stringValue;
      if (preloadedState) return preloadedState.match(/"slug":"(.*?)"/) ? preloadedState.match(/"slug":"(.*?)"/)[1] : '';
      return '';
    });

    if (slug && !areVariants) {
      await context.goto(`https://www.nykaa.com/${slug}`);
      await context.waitForSelector('div[class*=product-description] div.pd-main-image');
    }

    await context.evaluate(() => {
      const variants = document.querySelectorAll('ul[class*="options-colors"]>li>label>span');
      const variantColorArr = [];
      if (variants.length) {
        variants.forEach(async (element) => {
          // @ts-ignore
          element.click();
          variantColorArr.push(window.location.href);
        });
      }
      const sizeVariants = document.querySelectorAll('div[class*="sizes"]>ul>li>label>span');
      const sizeArr = [];
      if (sizeVariants.length) {
        sizeVariants.forEach(async (element) => {
          // @ts-ignore
          element.click();
          sizeArr.push(window.location.href);
        });
      }
      const wholeVariants = [...variantColorArr, ...sizeArr];

      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };

      for (let i = 0; i < wholeVariants.length; i++) {
        let variantUrl = wholeVariants[i];
        const text = variantUrl.match(/\d+\?(.*?)skuId=\d+/) ? variantUrl.match(/\d+\?(.*?)skuId=\d+/)[1] : '';
        if (text) variantUrl = variantUrl.replace(text, '');
        const variantUrlMatch = variantUrl.match(/(\d+\?skuId=(\d+))/);
        if (variantUrlMatch && variantUrlMatch.length === 3) variantUrl = variantUrl.replace(variantUrlMatch[1], variantUrlMatch[2]);
        addElementToDocument('product_variant_url', variantUrl);
      }
      if (!wholeVariants.length) addElementToDocument('product_variant_url', window.location.href);
    });
    return await context.extract(variants, { transform });
  },
};
