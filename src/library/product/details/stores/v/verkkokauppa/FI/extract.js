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
    try {
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

      try {
        if (document.querySelectorAll('button[id*="allow-cookies"]').length === 1) {
          await context.click('button[id*="allow-cookies"]');
          await new Promise((resolve) => setTimeout(resolve, 8000));
        } else {
          console.log('cannot find the cookie button - either not present or need to update the xpath');
        }
      } catch (err) {
        console.log(err);
      }

      await context.evaluate(async function () {
        let prodNum = null;
        if (document.querySelector('section.page__product') && document.querySelector('section.page__product').hasAttribute('data-pid')) { prodNum = document.querySelector('section.page__product').getAttribute('data-pid'); }
        // if (prodNum !== null) {
        //   const jsonData = document.querySelector('script[type="application/json"]').innerText;
        //   const jsonFormatData = JSON.parse(jsonData);
        //   const brandText = jsonFormatData.products.itemsByPid[prodNum].brand.name;
        //   addEleToDoc('brandText', brandText);
        // }
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

          // const tempVideos = document.evaluate('//li[contains(@class,"product-description-links__item")]//a//@src', document).iterateNext();
          // if (tempVideos != null) {
          //   const tempVideos1 = document.evaluate('//ul[contains(@class,"product-description-links")]//a//@src', document).iterateNext().textContent.trim();
          //   var tempVideos2 = tempVideos1.split('/');
          //   addEleToDoc('tempVideosId', 'https://www.youtube.com/watch?v=' + tempVideos2[4]);
          // }

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

      const inTheBox = await context.evaluate(async () => {
        const selector = document.querySelector('section.description-container__full-text > div> ul');
        let inTheBoxText = '';

        if (selector) {
          const temp = document.querySelector('section.description-container__full-text > div> ul').innerText;

          if (temp) {
            const inTheBoxTextTemp = temp.split('Mukana:');
            if (inTheBoxTextTemp[1]) {
              inTheBoxText = inTheBoxTextTemp[1].replace(/,/g, ' || ');
            }
          }
        }

        return inTheBoxText;
      });

      console.log('.....waiting......');
      await context.waitForSelector('#tabs-page-select-tab1', { timeout: 50000 });
      const productAvailable = await isSelectorAvailable('nav[class^="Tabs"]');
      if (productAvailable) {
        await context.click('#tabs-page-select-tab1');
        await context.waitForNavigation({ timeout: 50000, waitUntil: 'load' });
        await context.waitForSelector('section.product-details', { timeout: 55000 });
      }

      const brandText = await context.evaluate(async () => {
        let brandTextStr = '';
        const brandTextElm = document.querySelectorAll("tr[class*='product-details-row'] td[class*='product-details-row__value'] a");
        if (brandTextElm.length > 0) {
          console.log('we have some brand text');
          if (brandTextElm[0] && brandTextElm[0].innerText) {
            brandTextStr = brandTextElm[0].innerText;
          }
          console.log('brand text retrieved is - ' + brandTextStr);
        } else {
          console.log('if not extracted brandtext- check with the xpath');
        }
        return brandTextStr;
      });

      const mpcExt = await context.evaluate(async () => {
        let mpc = '';
        const mpcXpath = '//section[contains(@class,"product-details")]/div[1]/table/tbody//tr[contains(@class,"product-details-row")][contains(.,"Tuotekoodi")]/td[contains(@class,"product-details-row__value")]';
        const mpcElm = document.evaluate(mpcXpath, document, null, 7, null);
        if (mpcElm.snapshotLength > 0) {
          mpc = mpcElm.snapshotItem(0).textContent.trim();
          console.log('we have the mpc extracted as - ' + mpc);
        } else {
          console.log('we do nat have mpc extracted - please check with the xpath');
        }
        return mpc;
      });

      const shippingDim = await context.evaluate(async () => {
        let shippingDimText = '';
        const sdXpath = '//td[contains(text(), "Pakkauksen koko")]/following::td[1]';
        const sdElm = document.evaluate(sdXpath, document, null, 7, null);
        if (sdElm.snapshotLength > 0) {
          shippingDimText = sdElm.snapshotItem(0).textContent.trim();
          console.log('we have the shipping dim extracted as - ' + shippingDimText);
        } else {
          console.log('we did not get the shipping dimensions');
        }
        return shippingDimText;
      });

      const shippingWeight = await context.evaluate(async () => {
        let shippingWeightText = '';
        const swXpath = '//td[contains(text(), "Pakkauksen paino")]/following::td[1]';
        const swElm = document.evaluate(swXpath, document, null, 7, null);
        if (swElm.snapshotLength > 0) {
          shippingWeightText = swElm.snapshotItem(0).textContent.trim();
          console.log('we have the shipping weight extracted as - ' + shippingWeightText);
        } else {
          console.log('we did not get the shipping weight');
        }
        return shippingWeightText;
      });

      const warranty = await context.evaluate(async () => {
        let warrantyText = '';
        const warrantyXpath = '//td[contains(text(), "Takuuaika")]/following::td[1]';
        const warrantyElm = document.evaluate(warrantyXpath, document, null, 7, null);
        if (warrantyElm.snapshotLength > 0) {
          warrantyText = warrantyElm.snapshotItem(0).textContent.trim();
          console.log('we have the warranty extracted as - ' + warrantyText);
        } else {
          console.log('we did not get the warranty');
        }
        return warrantyText;
      });

      let specification = []; // div[contains(@class,"product-details__category")]
      specification = await context.evaluate(async () => {
        const specificationArr = [];
        const specificationXpath = '//div[contains(@class,"product-details__category")]';
        const specificationElms = document.evaluate(specificationXpath, document, null, 7, null);
        if (specificationElms.snapshotLength > 0) {
          console.log('we have a total of ' + specificationElms.snapshotLength + ' specs elms');
          console.log('specs are as follows');
          for (let i = 0; i < specificationElms.snapshotLength; i++) {
            let thisSpecStr = '';
            if (specificationElms.snapshotItem(i).textContent) {
              thisSpecStr = specificationElms.snapshotItem(i).textContent.trim();
              specificationArr.push(thisSpecStr);
              console.log(thisSpecStr);
            } else {
              console.log('we do not have any text for ' + i + 'th spec elm');
            }
          }
        } else {
          console.log('we do not have any specification');
        }
        return specificationArr;
      });

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
          await context.waitForSelector('div[class*="AspectRatio"]', { timeout: 5000 });
        } catch (err) {
          console.log('No Enhanced Content');
        }
      }

      await context.evaluate(async () => {
        async function addHiddenInfo (elementID, content) {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const youtubeVideo = document.querySelectorAll('li[class*="product-description-links__item"] a[class*="product-description-links-item--youtube"]');
        const youtubeVideosArr = [];
        if (youtubeVideo.length > 0) {
          for (let i = 0; i < youtubeVideo.length; i++) {
            if (youtubeVideo[i].hasAttribute('href') && !(youtubeVideosArr.includes(youtubeVideo[i].getAttribute('href')))) {
              youtubeVideosArr.push(youtubeVideo[i].getAttribute('href'));
              console.log(youtubeVideo[i].getAttribute('href'));
            } else {
              console.log('we do not have src in this iframe');
            }
          }
        } else {
          console.log('we do not have any video - please check the xpath');
        }
        // await addHiddenInfo(`youtube-video`, youtubeVideosArr.join('|'));
        for (let i = 0; i < youtubeVideosArr.length; i++) {
          await addHiddenInfo(`youtube-video-${i + 1}`, youtubeVideosArr[i]);
          console.log('added the video - ' + youtubeVideosArr[i]);
        }
      });

      async function addHiddenInfoAsync (elementID, content) {
        await context.evaluate(async function (elementID, content) {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }, elementID, content);
      }

      try {
        await context.waitForSelector('#tabs-page-select-tab0', { timeout: 50000 });
      } catch (err) {
        console.log(err);
      }
      try {
        await context.click('#tabs-page-select-tab0');
        await context.waitForSelector('div[class*="AspectRatio"]', { timeout: 5000 });
      } catch (err) {
        console.log('No Enhanced Content');
      }

      addHiddenInfoAsync('brand-text', brandText);
      addHiddenInfoAsync('mpc-ext', mpcExt);
      addHiddenInfoAsync('shipping-dim', shippingDim);
      addHiddenInfoAsync('shipping-weight', shippingWeight);
      addHiddenInfoAsync('warranty', warranty);
      addHiddenInfoAsync('specs', specification.join(' || '));
      addHiddenInfoAsync('inTheBox_', inTheBox);

      // await context.evaluate(async (specification) => {
      //   async function addHiddenInfo (elementID, content) {
      //     const newDiv = document.createElement('div');
      //     newDiv.id = elementID;
      //     newDiv.textContent = content;
      //     newDiv.style.display = 'none';
      //     document.body.appendChild(newDiv);
      //   }

      //   for(let i = 0; i < specification.length; i++) {
      //     await addHiddenInfo(`specification-${i + 1}`, specification[i]);
      //     console.log('added the spec - ' + specification[i]);
      //   }
      // }, specification);

      return await context.extract(productDetails, { transform: transformParam });
    } catch (err) {
      console.log('we got some error - ', err.message);
    }
  },
};
