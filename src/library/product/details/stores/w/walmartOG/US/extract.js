/* eslint-disable no-useless-escape */
const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',

  parameterValues: {
    country: 'US',
    store: 'walmartOG',
    zipcode: '72758',
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

        function addHiddenDiv (elementID, content) {
          const newDiv = document.createElement('div');
          newDiv.id = elementID;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        console.log('waiting for api request....');
        // Default storeId=5260: As customer has been using this storeID for search feed.
        const url = `https://grocery.walmart.com/v3/api/products/${id}?itemFields=all&storeId=5260`;
        var refURL = window.location.href;

        const response = await fetch(url, {
          accept: 'application/json, text/plain, */*',
          referrer: refURL,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: null,
          method: 'GET',
          mode: 'cors',
        });

        if (response && response.status === 404) {
          console.log('Product Not Found!!!!');
        }

        if (response && response.status === 200) {
          console.log('Product Found!!!!');
          data = await response.json();
          console.log(data);

          if (data) {
            console.log('parsing data ...');

            const asin = (data.USItemId) ? data.USItemId : '';
            const sku = (data.sku) ? data.sku : '';
            const gtin = (data.upc) ? data.upc : '';
            const variantId = (data.detailed && data.detailed.productCode) ? data.detailed.productCode : '';
            const brandText = (data.detailed && data.detailed.brand) ? data.detailed.brand : '';
            const varianceList = (data.variantOffers) ? Object.values(data.variantOffers).map(value => value.productId) : [];
            const image = (data.basic && data.basic.image && data.basic.image.large) ? (data.basic.image.large) : ((document.querySelector('img[class^="ProductPage__productImage"]')) ? document.querySelector('img[class^="ProductPage__productImage"]').getAttribute('src') : '');
            const title = document.querySelector('section[data-automation-id="productPage"] h1[data-automation-id="name"]') ? document.querySelector('section[data-automation-id="productPage"] h1[data-automation-id="name"]').textContent : '';

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
            addHiddenDiv('iio_product_url', `https://grocery.walmart.com/product/${id}`);

            iioObjects.forEach((item) => {
              addHiddenDiv(item.name, item.value);
            });
          }
        }
      }, inputs.id);
    }

    const { productDetails } = dependencies;
    return await context.extract(productDetails, { transform: transformParam });
  },

};
