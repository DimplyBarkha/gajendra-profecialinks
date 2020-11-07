const { transform } = require('../shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
//   var variantLength = await context.evaluate(async () => {
//     return (document.querySelectorAll('div.rd__col.rd__col--sm-12.rd__col--md-5.rd__col--lg-7')) ? document.querySelectorAll(' div.rd__col.rd__col--sm-12.rd__col--md-5.rd__col--lg-7').length : 0;
//   });
//   console.log("variantLength:: ", variantLength);
//   if (variantLength > 1) {
//     // await preparePageForCommonElement(0, variantLength);
//     for (let j = 0; j < variantLength; j++) {
//       await context.evaluate(async (j) => {
//         return document.querySelectorAll('div.rd__product-details.sd__product-details')[j].click();
//       }, j);
//       // await context.click(`ul.topic li label`);
//       console.log('Inside variants', j);
//       // await preparePage(j, variantLength);
//       if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
//     }
//   }
//   return await context.extract(productDetails, { transform });
// }
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    //const tabHeaders = document.querySelectorAll('div.rd__product-details__description > div.rd__tabs.rd__checkout-details__section__description > div.rd__priority-scroll > div > nav > ul > li');
    const tabHeaders = document.querySelectorAll('div.rd__product-details__description div.rd__priority-scroll > div > nav > ul > li');
    const tabPanels = document.querySelectorAll('div.rd__product-details__description >div.rd__product-details__description div.rd__tabs__content');
    if (tabHeaders) {
      const length = tabHeaders.length;
      if (length > 1) {
        for (let i = 0; i < length; i++) {
          const tabHeader = tabHeaders[i].textContent;
          if (tabHeader.indexOf('Usos') > -1) {
            const usageInfo = tabPanels[i].textContent;
            addHiddenDiv('my-usage-text', usageInfo);
          }
          if (tabHeader.indexOf('Ingredientes') > -1) {
            const ingredientesInfo = tabPanels[i].textContent;
            addHiddenDiv('my-ingredient-text', ingredientesInfo);
          }
        }
      }
    }
  });

  console.log('ready to extract');

  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'douglas',
    transform: transform,
    domain: 'douglas.es',
    zipcode: '',
  },
  implementation,
};
