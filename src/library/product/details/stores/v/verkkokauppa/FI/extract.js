const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FI',
    store: 'verkkokauppa',
    transform: cleanUp,
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      try {
        if (document.querySelector('ol[class*="product-list-detailed"] li:first-child')) {
          document.querySelector('ol[class*="product-list-detailed"] li:first-child div[class*="list-product__info"] >a').click();
        }
      } catch (err) {
        console.log(err);
      }
    });

    try {
      await context.waitForSelector('#tabs-page-select-tab0', { timeout: 50000 });
    } catch (err) {
      console.log(err);
    }

    await context.evaluate(async function () {
      function preFetchProductDetails () {
        let productInfo = findProductDetails('//script[@type="application/ld+json"]');
        productInfo = JSON.parse(productInfo.textContent);
        return productInfo;
      }

      function findProductDetails (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const productDetails = element;
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
      try {
        const productInfo = preFetchProductDetails();
        addEleToDoc('skuId', productInfo[0].sku);
        addEleToDoc('gtinId', productInfo[0].gtin13);
        addEleToDoc('priceCurrency', productInfo[0].offers[0].priceCurrency);

        const tempCheck = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"tat")]', document).iterateNext();
        if (tempCheck != null) {
          const shippingDimensionsData = document.evaluate('//section[contains(@class,"description-container__full-text")]//div//ul//li[contains(text(),"tat")]', document).iterateNext().textContent.trim();
          addEleToDoc('shippingDimensionsTempId', shippingDimensionsData);
        }

        const tempweightNet = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext();
        if (tempweightNet != null) {
          const tempweightNet1 = document.evaluate('//section[contains(@class,"description-container__full-text")]/div/ul/li[contains(text(),"Paino")]', document).iterateNext().textContent.trim();
          const tempweightNet2 = tempweightNet1.split(':');
          if (tempweightNet2 != null) {
            if (tempweightNet2.length === 1) {
              // var temp1234 = tempweightNet1.replace(/^\D+/g, '');
              addEleToDoc('weightNettempId', tempweightNet1.replace(/^\D+/g, ''));
            } else {
              const tempweightNet3 = tempweightNet2[1];
              let tempweightNet4 = tempweightNet2[1];
              if (tempweightNet3.indexOf('kg') === -1) {
                tempweightNet4 = tempweightNet2[1] + ' kg';
              }
              if (tempweightNet1.indexOf('runko') > 0) {
                tempweightNet4 = tempweightNet2[1].split('/')[1];
              }
              addEleToDoc('weightNettempId', tempweightNet4);
            }
          }
        }

        const tempDescription = document.evaluate('//div[contains(@class, "product-description__description-container")]', document).iterateNext();
        if (tempDescription != null) {
          const tempDescription1 = document.evaluate('//div[contains(@class, "product-description__description-container")]', document).iterateNext().textContent.trim();
          addEleToDoc('descriptionTempId', tempDescription1);
        }

        const tempManufactureImage = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src', document).iterateNext();
        if (tempManufactureImage != null) {
          const tempManufactureImage1 = document.evaluate('//a[contains(@class,"product-shop-logo")]/figure/img/@src', document).iterateNext().textContent.trim();
          addEleToDoc('tempManufactureImage1', tempManufactureImage1);
        }

        const tempVideos = document.evaluate('//li[contains(@class,"product-description-links__item")]//a//@src', document).iterateNext();
        if (tempVideos != null) {
          const tempVideos1 = document.evaluate('//ul[contains(@class,"product-description-links")]//a//@src', document).iterateNext().textContent.trim();
          var tempVideos2 = tempVideos1.split('/');
          addEleToDoc('tempVideosId', 'https://www.youtube.com/watch?v=' + tempVideos2[4]);
        }

        const tempcolor = document.evaluate('//section[contains(@class,"description-container__full-text")]//li[contains(text(),"Väri")]', document).iterateNext();
        if (tempcolor != null) {
          const tempcolor1 = tempcolor.textContent.trim();
          var tempcolor2 = tempcolor1.split(':');
          if (tempcolor2.length >= 1) {
            addEleToDoc('tempcolorId', tempcolor2[1]);
          }
        }

        const tempadditionalDescBulletInfo = document.querySelectorAll('div.product-description__description-container div ul li').length;
        if (tempadditionalDescBulletInfo > 0) {
          // const i = 0;
          const nodeList = document.querySelectorAll('div.product-description__description-container div ul li');
          let variantArray = '';
          nodeList.forEach(element => {
            if (variantArray.length === 0) {
              variantArray = element.innerHTML;
            } else {
              variantArray = variantArray + ' || ' + element.innerHTML;
            }
          });

          variantArray = variantArray.replace(/<a[^>]*>|<\/a>/g, '');
          variantArray = variantArray.replace(/<p[^>]*>|<\/p>/g, '');
          variantArray = variantArray.replace(/<div[^>]*>|<\/div>/g, '');
          variantArray = variantArray.replace(/<br[^>]*>|<\/div>/g, '');
          variantArray = variantArray.replace(/<strong[^>]*>|<\/strong>/g, '');
          variantArray = variantArray.replace(/<bold[^>]*>|<\/bold>/g, '');
          variantArray = variantArray.replace(/<ul[^>]*>|<\/ul>/g, '');
          variantArray = variantArray.replace(/<li[^>]*>/g, '');
          variantArray = variantArray.replace(/<\/li>/g, ' ||');
          variantArray = variantArray.replace('&nbsp;', '');
          variantArray = variantArray.replace(/&amp;nbsp;/g, '');
          variantArray = variantArray.replace(/\u00a0/g, '');
          variantArray = variantArray.replace(/&nbsp;/gi, 's');

          addEleToDoc('tempadditionalDescBulletInfoId', variantArray);
        }
        const tempDescriptionBullet1 = document.querySelectorAll('div.product-description__description-container div ul li').length;
        addEleToDoc('tempDescriptionBullet1', tempDescriptionBullet1);
      } catch (err) {
        console.log(err);
      }
    });

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector('#tabs-page-select-tab1', { timeout: 50000 });
    const productAvailable = await isSelectorAvailable('nav[class^="Tabs"]');
    if (productAvailable) {
      await context.click('#tabs-page-select-tab1');
      await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
      await context.waitForSelector('section.product-details', { timeout: 55000 });
    }

    // production fixes
    const aa = await context.evaluate(() => {
      return Boolean(document.querySelector('nav[role="tablist"]'));
    });
    if (aa) {
      try {
        await context.evaluate(() => {
          document.querySelector('nav[role="tablist"]').scrollIntoView({ behavior: 'smooth' });
        });
        await context.click('#tabs-page-select-tab0');
        await context.waitForSelector('div[class*="AspectRatio"]', { timeout: 30000 });
      } catch (err) {
        console.log('No Enhanced Content');
      }
    }

    return await context.extract(productDetails, { transform: transformParam });
  },
};
