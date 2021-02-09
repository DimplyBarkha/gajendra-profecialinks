const { cleanUp } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    transform: cleanUp,
    domain: 'sportsdirect.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 6000));
    await context.evaluate(async function (context) {
      const isColors = document.querySelector('ul[id="ulColourImages"]');
      if (isColors) {
        // @ts-ignore
        const colors = [...document.querySelectorAll('ul[id="ulColourImages"] li')];
        colors.forEach((ele) => {
          ele.setAttribute('position', colors.indexOf(ele));
        });
      }
      const isSizes = document.querySelector('ul[id="ulSizes"]');
      if (isSizes) {
        const position = document.querySelector('ul[id="ulColourImages"] li.variantHighlight') ? document.querySelector('ul[id="ulColourImages"] li.variantHighlight').getAttribute('position') : 0;
        const array = document.querySelectorAll('ul#ulSizes li:not([class*="greyOut"])');
        var obj = JSON.parse(document.querySelector('span.ProductDetailsVariants').getAttribute('data-variants'))[position];
        for (let i = 0; i < array.length; i++) {
          array[i].setAttribute('sku', obj.SizeVariants[i].SizeVarId);
          array[i].setAttribute('firstvariant', obj.SizeVariants[0].SizeVarId);
          array[i].setAttribute('nameextended', `${document.querySelector('div.logontitle h1').textContent} ${obj.SizeVariants[i].SizeName} ${document.querySelector('span#colourName').textContent}`);
        }

        try {
          // @ts-ignore
          document.querySelector('ul#ulSizes li:not([class*="greyOut"])').click();
        } catch (error) {
          console.log('error');
        }
        await new Promise((resolve, reject) => setTimeout(resolve, 4000));
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
