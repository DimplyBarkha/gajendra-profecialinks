/* eslint-disable no-useless-escape */
const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',

  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    transform: transform,
    domain: 'grocery.walmart.com',
  },

  implementation: async (inputs, { country, domain, zipcode, transform: transformParam }, context, dependencies) => {
    if (inputs.id) {
      // CODE TO SEARCH FOR API in response
      // const req = await context.searchForRequest(`grocery.walmart.com/v3/api/products/${inputs.id}`, 'GET', 0, 60);
      // const data = (req && req.status === 200 && req.responseBody && req.responseBody.body) ? JSON.parse(req.responseBody.body) : null;
      // console.log('INPUTS');
      // console.log(inputs);
      let storeID = null;
      storeID = await context.evaluate(async function () {
        console.log('window.localStorage.storeId');
        console.log(window.localStorage.storeId);
        if (window.localStorage.storeId) {
          return window.localStorage.storeId;
        }
      });

      if (storeID === null) {
        await context.waitForSelector('button[label="Change store"]');
        await context.click('button[label="Change store"]');
        await context.waitForSelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__label"]');
        storeID = await context.evaluate(async function () {
          const storeIDSplit = document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__label"]') ? document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__label"]').textContent.split('#') : [];
          const storeID = storeIDSplit.length > 1 ? storeIDSplit[1] : '0';
          return storeID;
        });
        if (storeID === '0') {
          throw new Error('No store ID!');
        }
        await context.waitForSelector('button[data-automation-id="flyout-close"]');
        await context.click('button[data-automation-id="flyout-close"]');
      }

      await context.evaluate(async function getDataFromAPI (id, storeID) {
        console.log('getDataFromAPI');
        let data = {};
        const iioObjects = [];
        let productInfo = null;

        function addHiddenDiv (elementID, content) {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        console.log('waiting for api request....');
        const url = `https://www.walmart.com/grocery/v3/api/products/${id}?itemFields=all&storeId=${storeID}`;
        console.log(`api url is - ${url}`);
        var refURL = window.location.href;
        console.log('refurl is - ' + refURL);

        async function fetchItems (numberOfRetries = 0) {
          const response = await fetch(url, {
            accept: 'application/json, text/plain, */*',
            referrer: refURL,
            referrerPolicy: 'no-referrer-when-downgrade',
            body: null,
            method: 'GET',
            mode: 'cors',
          });
          console.log(numberOfRetries);

          try {
            if (response && response.status === 200) {
              console.log('Product Found!!!!');
              data = await response.json();
              productInfo = data;
              return productInfo;
            }

            if (response && response.status === 404) {
              console.log('Product Not Found!!!!');
              return {};
            }
          } catch (err) {
            if (numberOfRetries === 1) {
              return {};
            }

            return await fetchItems(numberOfRetries++);
          }

          console.log(response);
          console.log(response.status);
        }

        data = await fetchItems();
        console.log('data from api is - ');
        console.log(data);

        const availableSelector = () => {
          const outOfStock = document.querySelector('div[class^="ProductPage__outOfStock"]');
          if (outOfStock && outOfStock.getAttribute('data-automation-id')) {
            return !(outOfStock.getAttribute('data-automation-id') === 'out-of-stock-label');
          }

          const error = document.querySelector('section[class^="ProductPage__errorContainer"');
          if (error !== null) {
            return false;
          }
          return true;
        };
        console.log(`availableSelector - ${availableSelector}`);

        const cssListPrice = 'div[class*="ProductPage__priceContainer"] div[data-automation-id*="old-price"]';
        const listPriceDom = (document.querySelector(cssListPrice) && document.querySelector(cssListPrice).textContent) ? document.querySelector(cssListPrice).textContent : '';
        console.log('List price from the DOM : ' + listPriceDom);

        if (Object.keys(data).length) {
          console.log('parsing data ...');
          console.log(data);

          const asin = (data.USItemId) ? data.USItemId : '';
          const sku = (data.sku) ? data.sku : '';
          const gtin = (data.upc) ? data.upc : '';
          const variantId = (data.detailed && data.detailed.productCode) ? data.detailed.productCode : '';
          const brandText = (data.detailed && data.detailed.brand) ? data.detailed.brand : '';
          const varianceList = (data.variantOffers) ? Object.values(data.variantOffers).map(value => value.productId) : [];
          const image = (data.basic && data.basic.image && data.basic.image.large) ? (data.basic.image.large) : '';
          const salePrice = (data.store && data.store.price && data.store.price.list) ? data.store.price.list : '' || (data.store && data.store.price && data.store.price.displayPrice) ? data.store.price.displayPrice : '';
          const listPrice = (data.store && data.store.price && data.store.price.previousPrice) ? data.store.price.previousPrice : listPriceDom;
          const available = (data.store && data.store.isInStock) ? data.store.isInStock : availableSelector();
          const pricePerUnit = (data.store && data.store.price && data.store.price.unit) ? data.store.price.unit : '';
          const pricePerUnitUOM = (data.store && data.store.price && data.store.price.displayUnitPrice) ? data.store.price.displayUnitPrice.split('/')[data.store.price.displayUnitPrice.split('/').length - 1] : '';
          const shortDescription = document.querySelector('div[data-automation-id="productAttributeShortDescription"]') ? document.querySelector('div[data-automation-id="productAttributeShortDescription"]').textContent : '';
          const productAttributeDescription = document.querySelector('div[data-automation-id="details"] > div[class^="ProductAttribute__value"][data-automation-id="productAttributeValue"]');
          const productAttributeDescriptionText = productAttributeDescription ? productAttributeDescription.innerHTML.replace(/<(li)[^>]+>/ig, '<$1>').replace(/<li>/g, ' || ').replace(/<[^>]*>/gm, '') : '';
          const productDescription = shortDescription + ' ' + productAttributeDescriptionText;

          console.log(productDescription);

          addHiddenDiv('iio_image', image);

          addHiddenDiv('iio_variants', varianceList.join(' | '));

          addHiddenDiv('iio_productDescription', productDescription);
          // nutritionFacts
          if (data.nutritionFacts) {
            if (data.nutritionFacts.keyNutrients) {
              data.nutritionFacts.keyNutrients.forEach((item) => {
                if (item.name && item.amountPerServing) {
                  iioObjects.push({ name: `iio_nutrient_${item.name}`, value: item.amountPerServing });
                }
              });
            }
            if (data.nutritionFacts.calorieInformation) {
              const keys = Object.keys(data.nutritionFacts.calorieInformation);
              for (const key of keys) {
                iioObjects.push({ name: `iio_nutrient_${key}`, value: data.nutritionFacts.calorieInformation[key] });
              }
            }

            if (data.nutritionFacts.servingInformation) {
              const keys = Object.keys(data.nutritionFacts.servingInformation);
              for (const key of keys) {
                iioObjects.push({ name: `iio_nutrient_${key}`, value: data.nutritionFacts.servingInformation[key] });
              }
            }
          }

          // Write objects to HTML
          addHiddenDiv('iio_asin', asin);
          addHiddenDiv('iio_sku', sku);
          addHiddenDiv('iio_gtin', gtin);
          addHiddenDiv('iio_variantId', variantId);
          addHiddenDiv('iio_brandText', brandText);
          addHiddenDiv('iio_listPrice', listPrice);
          addHiddenDiv('iio_onlinePrice', salePrice);
          addHiddenDiv('iio_available', (available ? 'In Stock' : 'Out of Stock'));
          addHiddenDiv('iio_product_url', `https://grocery.walmart.com/product/${id}`);
          addHiddenDiv('iio_pricePerUnit', pricePerUnit);
          addHiddenDiv('iio_pricePerUnitUOM', pricePerUnitUOM);

          iioObjects.forEach((item) => {
            addHiddenDiv(item.name, item.value);
          });
        }
      }, inputs.id, storeID);
    }

    const { productDetails } = dependencies;
    const mainImageSelector = '.prod-HeroImage-container img';
    try {
      await context.waitForSelector(mainImageSelector, { timeout: 20000 });
    } catch (error) {
      console.log('Cannot find ".prod-HeroImage-container img" selector');
    }
    return await context.extract(productDetails, { transform: transformParam });
  },

};
