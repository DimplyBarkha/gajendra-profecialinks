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
      await context.waitForSelector('button[label="Change store"]');
      await context.click('button[label="Change store"]');
      const storeID = await context.evaluate(async function () {
        const storeIDSplit = document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__label"]') ? document.querySelector('li[data-automation-id="selectFlyoutItem"] span[class^="AddressPanel__label"]').textContent.split('#') : [];
        const storeID = storeIDSplit.length > 1 ? storeIDSplit[1] : '0';
        return storeID;
      });
      await context.waitForSelector('button[data-automation-id="flyout-close"]');
      await context.click('button[data-automation-id="flyout-close"]');
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
        if (document.querySelector('button[label="Change store"]')) {
          document.querySelector('button[label="Change store"]').click();
        }

        console.log('waiting for api request....');
        // Default storeId=5260: As customer has been using this storeID for search feed.
        const url = `https://www.walmart.com/grocery/v3/api/products/${id}?itemFields=all&storeId=${storeID}`;
        var refURL = window.location.href;

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
              // throw err;
              return {};
            }

            return await fetchItems(numberOfRetries++);
          }

          console.log(response);
          console.log(response.status);
        }

        data = await fetchItems();

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
          const salePrice = (data.store && data.store.price && data.store.price.list) ? data.store.price.list : '';
          const listPrice = (data.store && data.store.price && data.store.price.previousPrice) ? data.store.price.previousPrice : '';
          const available = (data.store && data.store.isInStock) ? data.store.isInStock : availableSelector();
          const pricePerUnit = (data.store && data.store.price && data.store.price.unit) ? data.store.price.unit : '';
          const pricePerUnitUOM = (data.store && data.store.price && data.store.price.displayUnitPrice) ? data.store.price.displayUnitPrice.split('/')[data.store.price.displayUnitPrice.split('/').length - 1] : '';

          addHiddenDiv('iio_image', image);

          addHiddenDiv('iio_variants', varianceList.join(' | '));
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
    return await context.extract(productDetails, { transform: transformParam });
  },

};
