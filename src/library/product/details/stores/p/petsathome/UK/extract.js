const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'petsathome',
    transform,
    domain: 'petsathome.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      
      var firstVariant = document.querySelector('ul.selector__list li input');
      if (firstVariant) {
        // @ts-ignore
        firstVariant.click();
      }


      function timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
      const selectedVariant = document.querySelector('input:not(.disabled) + span.selector__value');
      const getVariant = async function () {
        let finalVariantArr = [];
        // @ts-ignore
        const variantRows = [...document.querySelectorAll('ul.selector__list li input.disabled')];
        if (variantRows.length > 0) {
          for (let index = 0; index < variantRows.length; index++) {
            variantRows[index].click();
            await timeout(3000);
            const variant = document.querySelector('span.pdp-accordion__content-partNumber').textContent;
            finalVariantArr.push(variant);
            await timeout(1000);
          }
          // @ts-ignore
          selectedVariant.click();
        }
        return finalVariantArr;
      }
      const variantIds = await getVariant();
      variantIds.map(elm => {
        let newlink = document.createElement('a');
        newlink.setAttribute('class', 'variants-id');
        newlink.textContent = elm;
        document.body.appendChild(newlink);
    })
      // var finalArray = [];
    //   function removeHeader(text) {
    //     if (text) {
    //       return text.split(':')[1].trim();
    //     } else {
    //       return '';
    //     }
    //   }
    //   function getElementsByXPath(xpath, parent) {
    //     const results = [];
    //     const query = document.evaluate(xpath, parent || document,
    //       null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //     for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    //       const node = query.snapshotItem(i) && query.snapshotItem(i).textContent && query.snapshotItem(i).textContent.trim();
    //       results.push(node);
    //     }
    //     return results.filter(e => e);
    //   }
    //   const dataArr = getElementsByXPath('//div[@id="pdp-accordion__description"]/text() | //div[@id="pdp-accordion__nutrition"]/text()');
    //   var ingredient = removeHeader(dataArr && dataArr.find(e => e.includes('Ingredients')));
    //   var direction = removeHeader(dataArr.find(e => e.includes('Feeding Guide')));
    //   var dimensions = removeHeader(dataArr.find(e => e.includes('Approximate Dimensions')));
    //   var obj = {ingredient,direction,dimensions };
    //   finalArray.push(obj);
    //   if (finalArray) {
    //     for (const key in finalArray[0]) {
    //         document.body.setAttribute(key, finalArray[0][key]);
    //     }
    // }    
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform });
  },
};
