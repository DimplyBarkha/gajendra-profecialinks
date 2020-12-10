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

      await context.evaluate(async function getDataFromAPI (id) {
        console.log('getDataFromAPI');
        let data = {};
        const iioObjects = [];
        let productInfo = null;
        let productNotFound = false;

        function addHiddenDiv (elementID, content) {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        console.log('waiting for api request....');
        // Default storeId=5260: As customer has been using this storeID for search feed.
        const url = `https://www.walmart.com/grocery/v3/api/products/${id}?itemFields=all&storeId=5260`;
        var refURL = window.location.href;

        async function fetchItems () {
          const response = await fetch(url, {
            accept: 'application/json, text/plain, */*',
            referrer: refURL,
            referrerPolicy: 'no-referrer-when-downgrade',
            body: null,
            method: 'GET',
            mode: 'cors',
          });

          console.log(response);
          console.log(response.status);

          if (response && response.status === 404) {
            console.log('Product Not Found!!!!');
            productNotFound = true;
          }

          if (response && response.status === 200) {
            console.log('Product Found!!!!');
            data = await response.json();
            productInfo = data;
            return productInfo;
          }

          return {};
        }

        productInfo = await fetchItems();

        if (Object.keys(productInfo).length === 0 && productNotFound === false) {
          productInfo = await fetchItems();
        }

        data = productInfo;

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

        if (data) {
          console.log('parsing data ...');
          console.log(data);

          const asin = (data.USItemId) ? data.USItemId : '';
          const sku = (data.sku) ? data.sku : '';
          const gtin = (data.upc) ? data.upc : '';
          const variantId = (data.detailed && data.detailed.productCode) ? data.detailed.productCode : '';
          const brandText = (data.detailed && data.detailed.brand) ? data.detailed.brand : '';
          const varianceList = (data.variantOffers) ? Object.values(data.variantOffers).map(value => value.productId) : [];
          const image = (data.basic && data.basic.image && data.basic.image.large) ? (data.basic.image.large) : ((document.querySelector('img[class^="ProductPage__productImage"]')) ? document.querySelector('img[class^="ProductPage__productImage"]').getAttribute('src') : '');
          const title = document.querySelector('section[data-automation-id="productPage"] h1[data-automation-id="name"]') ? document.querySelector('section[data-automation-id="productPage"] h1[data-automation-id="name"]').textContent : '';
          const salePrice = (data.store && data.store.price && data.store.price.list) ? data.store.price.list : (document.querySelector('div[data-automation-id="old-price"]') ? document.querySelector('div[data-automation-id="old-price"]').textContent : '');
          const listPrice = (data.store && data.store.price && data.store.price.previousPrice) ? data.store.price.previousPrice : (document.querySelector('div[data-automation-id="salePrice"]') ? document.querySelector('div[data-automation-id="salePrice"]').textContent : '');
          const available = (data.store && data.store.isInStock) ? data.store.isInStock : availableSelector();

          addHiddenDiv('iio_quantity', title);

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
            // iioObjects.push({ name: 'iio_caloriesPerServing', value: data.nutritionFacts.calorieInformation.caloriesPerServing });
              const keys = Object.keys(data.nutritionFacts.calorieInformation);
              for (const key of keys) {
                iioObjects.push({ name: `iio_nutrient_${key}`, value: data.nutritionFacts.calorieInformation[key] });
              }
            }

            if (data.nutritionFacts.servingInformation) {
            // iioObjects.push({ name: 'iio_caloriesPerServing', value: data.nutritionFacts.calorieInformation.caloriesPerServing });
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

          iioObjects.forEach((item) => {
            addHiddenDiv(item.name, item.value);
          });
        }
      }, inputs.id);
    }

    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform: transformParam });
  },

};
