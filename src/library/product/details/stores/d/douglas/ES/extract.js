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
    return (document.querySelectorAll('div.rd__product-details')) ? document.querySelectorAll('div.rd__product-details').length : 0;
  });
  console.log('Variant Length', variantLength);
  if (variantLength > 1) {
    for (let j = 1; j < variantLength; j++) {
      await preparePage(j, variantLength, true);
      console.log('Inside variants', j);
      if (j !== variantLength - 1) { await context.extract(productDetails, { transform }); }
    }
  }

  async function preparePage (index, variantLength) {
    await context.evaluate(async (index, variantLength) => {
      function getSingleText (xpath, document, index) {
        const element = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element && element.snapshotLength > 0) {
          const elem = element.snapshotItem(index);
          return elem ? elem.textContent : '';
        } else {
          return '';
        }
      }

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const qtyXpath = '//h2[contains(@class,"rd__headline--80")]';
      const quantity = getSingleText(qtyXpath, document, index - 1);
      addHiddenDiv('my-qty', quantity);

      // const nameExtXpath = 'concat(//h1[@itemprop="name"]//div[@class="rd__col sd__no-float"]/text(), ' ',//h2[contains(@class,"rd__headline--80")])';
      // const nameExt = getSingleText(nameExtXpath, document, index - 1);
      // addHiddenDiv('my-nameExt', nameExt);

      const variantIdXpath = '//div[@data-vendor]/@data-product-id |//h2[contains(@class,"rd__headline--80")]/@title';
      const variantId = getSingleText(variantIdXpath, document, index - 1);
      addHiddenDiv('my-variantId', variantId);
      let variantInf = '';
      if (variantLength > 2) {
        const variantInfXpath = '//h2[contains(@class,"rd__headline--80")]';
        variantInf = getSingleText(variantInfXpath, document, index - 1);
        addHiddenDiv('my-variantInf', variantInf);
      }

      const priceXpath = '//span[contains(@class,"rd__headline--130")]/text() | //div[contains(@class,"rd__order-detail__header rd__list-services__headline")]//span[contains(@class,"rd__headline--130")]/text()';
      const price = getSingleText(priceXpath, document, index - 1);
      addHiddenDiv('my-price', price);

      const availabXpath = '//div[contains(text(),"Descatalogado")] | //div[contains(text(),"No disponible hoy")]';
      const availab = getSingleText(availabXpath, document, index);
      addHiddenDiv('my-availab', availab);

      const availabXpath1 = '//div[contains(text(),"No disponible hoy")]';
      const availab1 = getSingleText(availabXpath1, document, index);
      addHiddenDiv('my-availab1', availab1);

      const listPriceXpath = '//div[@class="rd__product-details__options__price__item__amount sd__product-details__options__price__item__amount"]//div[contains(@class,"sd__product-details__options__price__item__quantity")] | //div[contains(text(), "Precio base hidratante:")]//..//following-sibling::span[@class="rd__headline--130"]';
      const listPrice = getSingleText(listPriceXpath, document, index - 1);
      addHiddenDiv('my-listPrice', listPrice);

      // //const colorXpath = '//div[@class="rd__product-details__colors__select__collapsible__item rd__col--lg-12"]/@data-rd-color-name';
      const colorXpath = '//div[@class="rd__blob"]/img/@alt';
      const color = getSingleText(colorXpath, document, index - 1);
      addHiddenDiv('my-color', color);

      return [`#qty:${quantity}`, `#variantInf:${variantInf}`, `#availab1:${availab1}`, `#availab:${availab}`, `#variantId:${variantId}`, `#price:${price}`, `#color:${color}`, `#listPrice:${listPrice}`]; // `#nameExt:${nameExt}`,
    }, index, variantLength);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  var variantLength1 = await context.evaluate(async () => {
    return (document.querySelectorAll('div.rd__blob img.rd__img')) ? document.querySelectorAll('div.rd__blob img.rd__img').length : 0;
  });
  console.log('Variant Length1', variantLength1);
  if (variantLength1 > 1) {
    for (let j = 1; j < variantLength1; j++) {
      await preparePage1(j, variantLength1);
      console.log('Inside variants1', j);
      if (j !== variantLength1 - 1) { await context.extract(productDetails, { transform }); }
    }
  }
  async function preparePage1 (index, variantLength1) {
    await context.evaluate(async (index, variantLength1) => {
      function getSingleText (xpath, document, index) {
        const element = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (element && element.snapshotLength > 0) {
          const elem = element.snapshotItem(index);
          return elem ? elem.textContent : '';
        } else {
          return '';
        }
      }

      function addHiddenDiv1 (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const qtyXpath = '//h2[contains(@class,"rd__headline--80")]';
      const quantity = getSingleText(qtyXpath, document, index);
      addHiddenDiv1('my-qty', quantity);

      const variantIdXpath = '//div[@data-vendor]/@data-product-id | //h2[contains(@class,"rd__headline--80")]/@title';
      const variantId = getSingleText(variantIdXpath, document, index - 1);
      addHiddenDiv1('my-variantId', variantId);

      const priceXpath = '//span[contains(@class,"rd__headline--130")]/text() | //div[contains(@class,"rd__order-detail__header rd__list-services__headline")]//span[contains(@class,"rd__headline--130")]/text()';
      const price = getSingleText(priceXpath, document, index);
      addHiddenDiv1('my-price', price);
      let variantInf = '';
      if (variantLength1 > 2) {
        const variantInfXpath = '//h2[contains(@class,"rd__headline--80")]';
        variantInf = getSingleText(variantInfXpath, document, index - 1);
        addHiddenDiv1('my-variantInf', variantInf);
      }

      const availabXpath = '//div[contains(text(),"Descatalogado")] | //div[contains(text(),"No disponible hoy")]';
      const availab = getSingleText(availabXpath, document, index - 1);
      addHiddenDiv1('my-availab', availab);

      const listPriceXpath = '//div[@class="rd__product-details__options__price__item__amount sd__product-details__options__price__item__amount"]//div[contains(@class,"sd__product-details__options__price__item__quantity")] | //div[contains(@class,"rd__headline--100 rd__copytext--50")]';
      const listPrice = getSingleText(listPriceXpath, document, index - 1);
      addHiddenDiv1('my-listPrice', listPrice);

      // //const colorXpath = '//div[@class="rd__product-details__colors__select__collapsible__item rd__col--lg-12"]/@data-rd-color-name';
      const colorXpath = '//div[@class="rd__blob"]/img/@alt';
      const color = getSingleText(colorXpath, document, index - 1);
      addHiddenDiv1('my-color', color);

      const availabXpath1 = '//div[contains(text(),"No disponible hoy")]';
      const availab1 = getSingleText(availabXpath1, document, index - 1);
      addHiddenDiv1('my-availab1', availab1);

      return [`#variantId:${variantId}`, `#availab:${availab}`, `#availab1:${availab1}`, `#color1:${color}`, `#listPrice1:${listPrice}`, `#variantInf1:${variantInf}`];
    }, index, variantLength1);
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 5000));

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // const tabHeaders = document.querySelectorAll('div.rd__product-details__description > div.rd__tabs.rd__checkout-details__section__description > div.rd__priority-scroll > div > nav > ul > li');
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
