const { transform } = require('../shared');
// async function implementation (
//   inputs,
//   parameters,
//   context,
//   dependencies,
// ) {
//   const { transform } = parameters;
//   const { productDetails } = dependencies;
  // var variantLength = await context.evaluate(async () => {
  //   return (document.querySelectorAll('div.rd__col.rd__col--sm-12.rd__col--md-5.rd__col--lg-7')) ? document.querySelectorAll(' div.rd__col.rd__col--sm-12.rd__col--md-5.rd__col--lg-7').length : 0;
  // });
  // console.log("variantLength:: ", variantLength);
  // if (variantLength > 1) {
  //   // await preparePageForCommonElement(0, variantLength);
  //   for (let j = 0; j < variantLength; j++) {
  //     await context.evaluate(async (j) => {
  //       return document.querySelectorAll('div.rd__product-details.sd__product-details')[j].click();
  //     }, j);
  //     // await context.click(`ul.topic li label`);
  //     console.log('Inside variants', j);
  //     // await preparePage(j, variantLength);
  //     if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
  //   }
  // }
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
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.rd__blob img')) ? document.querySelectorAll('div.rd__blob img').length : 0;
  });
  console.log("variantLength:: ", variantLength);
  if (variantLength > 1) {
    for (let j = 0; j < variantLength; j++) {
      await context.evaluate(async (j) => {
        return document.querySelectorAll('div.rd__blob img.rd__img')[j].click();
      }, j);
      console.log('Inside variants', j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }, { type: 'APPEND' }); }
    }
  }
  
  var variantLength = await context.evaluate(async () => {
    return (document.querySelectorAll('div.rd__product-details.sd__product-details')) ? document.querySelectorAll('div.rd__product-details.sd__product-details').length : 0;
  });
  console.log('Variant Length', variantLength);
  if (variantLength >= 1) {
    for (let j = 1; j < variantLength; j++) {
      await preparePage(j, variantLength, true);
      console.log('Inside variants', j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }); }
    }
  }
  // const colorArray = await context.evaluate(async (j) => {
  //   return document.querySelectorAll('div.rd__product-details.sd__product-details').length;
  // });
  // if (colorArray) {
  //   for (let j = 0; j < colorArray; j++) {
  //     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  //     await context.evaluate(async (j) => {
  //       document.querySelectorAll('div.rd__product-details.sd__product-details')[j].click();
  //       const value = document.querySelectorAll('div.rd__product-details.sd__product-details')[j].getAttribute('value');
  //       document.querySelector('h2.rd__headlline').value = value;
  //       return document.querySelector('h2.rd__headlline').dispatchEvent(new Event('click'));
  //     }, j);
  //     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  //     await preparePage(j, variantLength, true);
  //     if (j !== colorArray - 1) {
  //       await context.extract(productDetails, { transform }, { type: 'APPEND' });
  //     }
  //   }
  // }



  async function preparePage(index, variantLength) {
    await context.evaluate(async (index, variantLength) => {
      function getSingleText(xpath, document, index) {
        const element = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element && element.snapshotLength > 0) {
          const elem = element.snapshotItem(index)
          return elem ? elem.textContent : '';
        } else {
          return '';
        } 
      }
      
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const qtyXpath = '//h2[@class="rd__headlline rd__headline--80"]';
      const quantity = getSingleText(qtyXpath, document, index - 1);
      addHiddenDiv('my-qty', quantity);

      const variantIdXpath = '//h2[@class="rd__headlline rd__headline--80"]/@title';
      const variantId = getSingleText(variantIdXpath, document, index - 1);
      addHiddenDiv('my-variantId', variantId);

      const priceXpath = '//span[contains(@class,"rd__headline--130")]/text()';
      const price = getSingleText(priceXpath, document, index - 1);
      addHiddenDiv('my-price', price);

      const availabXpath = "//div[contains(@class,'rd__slider-brand-nav__index__item--active')]";
      const availab = getSingleText(availabXpath, document, index - 1);
      addHiddenDiv('my-availab', availab);

      const listPriceXpath = '//div[@class="rd__product-details__options__price__item__amount sd__product-details__options__price__item__amount"]//div[contains(@class,"sd__product-details__options__price__item__quantity")]';
      const listPrice = getSingleText(listPriceXpath, document, index - 1);
      addHiddenDiv('my-listPrice', listPrice);

      // //const colorXpath = '//div[@class="rd__product-details__colors__select__collapsible__item rd__col--lg-12"]/@data-rd-color-name';
      const colorXpath = '//div[@class="rd__blob"]/img/@alt';
      const color = getSingleText(colorXpath, document, index - 1);
      addHiddenDiv('my-color', color);

      return [`#qty:${quantity}`, `#variantId:${variantId}`, `#price:${price}`, `#availab:${availab}`, `#color:${color}`, `#listPrice:${listPrice}`];
    }, index, variantLength);
  }
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
// 

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
