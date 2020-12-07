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
        addElementToDocument('product_variant_url', wholeVariants[i]);
      }
    });
    return await context.extract(variants, { transform });
  },
};
