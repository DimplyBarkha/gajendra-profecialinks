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
        });
      }
      const sizeVariants = document.querySelectorAll('div[class*="sizes"]>ul>li>label>span');
      const sizeArr = [];
      if (sizeVariants.length) {
        sizeVariants.forEach((element) => {
          element.click();
          sizeArr.push(window.location.href);
        });
      }
      const wholeVariants = [...variantColorArr, ...sizeArr];
      console.log(variantColorArr)
      console.log(sizeArr)
      console.log(wholeVariants)
      if (wholeVariants.length == 0) {
        const appendDiv = document.createElement('div');
        appendDiv.className = 'variantinfo';
        appendDiv.setAttribute('varianturl', window.location.href);
        const defaultUrl = window.location.href;
        let skuId = defaultUrl && defaultUrl.match(/(skuId=)(\d+)/g) && defaultUrl.match(/(skuId=)(\d+)/g)[0];
        if (skuId == undefined || skuId == null) {
          skuId = defaultUrl.match(/p\/\d+/g)[0];
        }
        const id = skuId && skuId.match(/(\d+)/g) && skuId.match(/(\d+)/g)[0];
        appendDiv.setAttribute('variantid', id);
        document.querySelector('body').appendChild(appendDiv);
      } else {
        const variantId = [];
        wholeVariants.forEach((element) => {
          const skuId = element.match(/(skuId=)(\d+)/g)[0];
          const id = skuId.match(/(\d+)/g)[0];
          variantId.push(id);
        });
        variantId.forEach((element, index) => {
          const appendDiv = document.createElement('div');
          appendDiv.className = 'variantinfos';
          appendDiv.setAttribute('variantid', variantId[index]);
          appendDiv.setAttribute('varianturl', wholeVariants[index]);
          document.body.append(appendDiv);
        });
      }
    });
    return await context.extract(variants, { transform });
  },
};
