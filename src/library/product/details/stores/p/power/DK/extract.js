module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'power',
    transform: null,
    domain: 'power.dk',
    zipcode: '',
  },

  implementation: async ({
    inputString,
  }, {
    country,
    domain,
  }, context, {
    productDetails,
  }) => {
    await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i');
    await context.click('#product-information-tabs > div:nth-child(1) > div > i');
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }

      const eangtin = getElementByXpath('//*[@id="product-information-tabs"]//*[contains(text(),"EAN")]/../../../..') ?
        getElementByXpath('//*[@id="product-information-tabs"]//*[contains(text(),"EAN")]/../../../..').textContent : '';
      if (eangtin) addElementToDocument('eangtin', eangtin);

      const color = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[2]/div[2]/div[2]/span') ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[2]/div[2]/div[2]/span').textContent : '';
      if (color) addElementToDocument('color', color);

      const weightNet = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[6]/div[2]/span') ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[6]/div[2]/span').textContent : '';
      if (weightNet) addElementToDocument('weightNet', weightNet);

      const specifications = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[5]/div[2]/span') ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[8]/div[5]/div[2]/span').textContent : '';
      if (specifications) addElementToDocument('specifications', specifications);

      const mpc = getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[1]/div[2]/div[2]/span') ? getElementByXpath('//*[@id="product-tab-general"]/div/pwr-product-specifications/div[1]/div[2]/div[2]/span').textContent : '';
      if (mpc) addElementToDocument('mpc', mpc);

      const alternateImagesURLs = document.querySelectorAll('.image-wrapper') ? document.querySelectorAll('.image-wrapper') : '';
      if (alternateImagesURLs) {
        const ul = document.createElement('ul');
        alternateImagesURLs.forEach(elem => ul.appendChild(elem));
        ul.id = 'alternateImagesURLs';
        document.body.appendChild(ul);
      }

      // ratingCount does not exist in DOM when opended via robot
      const ratingCount = getElementByXpath('//*[@id="num-reviews-button"]') ? getElementByXpath('//*[@id="num-reviews-button"]').textContent : '';
      if (ratingCount) addElementToDocument('ratingCount', ratingCount);
    });

    await context.extract(productDetails);
  },
};

//   implementation: async ({
//     inputString,
//   }, {
//     country,
//     domain,
//   }, context, {
//     productDetails,
//   }) => {
//     await context.waitForSelector('#product-information-tabs > div:nth-child(1) > div > i"]');
//     await context.click('#product-information-tabs > div:nth-child(1) > div > i');
//     await context.evaluate(async function () {

//       function addElementToDocument(key, value) {
//         const catElement = document.createElement('div');
//         catElement.id = key;
//         catElement.textContent = value;
//         catElement.style.display = 'none';
//         document.body.appendChild(catElement);
//       }
//       const gtin = document.querySelector('#product-tab-general > div > pwr-product-specifications > div:nth-child(2) > div:nth-child(3) > div.col-sm-4.col-xs-4 > span > font > font')
//         // @ts-ignore
//         ?
//         document.querySelector('#product-tab-general > div > pwr-product-specifications > div:nth-child(2) > div:nth-child(3) > div.col-sm-4.col-xs-4 > span > font > font').innerText : '';
//       if (gtin) {
//         addElementToDocument('gtin', gtin);
//       }
//     });
//     await context.extract(productDetails);
//   },
// };