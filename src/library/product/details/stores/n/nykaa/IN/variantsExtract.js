const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    transform: cleanUp,
    domain: 'nykaa.com',
    zipcode: '',
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
        variants.forEach((element) => {
          element.click();
          variantColorArr.push(window.location.href);
        })
      }
      const sizeVariants = document.querySelectorAll('div[class*="sizes"]>ul>li>label>span');
      const sizeArr = [];
      if (sizeVariants.length) {
        sizeVariants.forEach((element) => {
          element.click();
          sizeArr.push(window.location.href);
        })
      }
      const wholeVariants = [...variantColorArr, ...sizeArr];

      const variantId = [];
      wholeVariants.forEach((element) => {
        let skuId = element.match(/(skuId=)(\d+)/g)[0];
        let id = skuId.match(/(\d+)/g)[0];
        variantId.push(id);
      })
      variantId.forEach((element, index) => {
        const appendDiv = document.querySelector('div');
        appendDiv.className = 'variantinfos';
        appendDiv.setAttribute('variantid', variantId[index]);
        appendDiv.setAttribute('varianturl', wholeVariants[index]);
        document.body.append(appendDiv);
      })
    });
    return await context.extract(variants , { transform });
  }
};
