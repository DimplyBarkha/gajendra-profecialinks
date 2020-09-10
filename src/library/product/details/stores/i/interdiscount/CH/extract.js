const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'interdiscount',
    transform,
    domain: 'interdiscount.ch',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let skuNumber = document.evaluate('//span[contains(text(),"Online-Artikel-Nr")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      skuNumber = skuNumber ? skuNumber.innerText.match(/\d+/)[0] : '';
      if (skuNumber) {
        // @ts-ignore
        const dataObj = window.__INITIAL_STATE__.products[skuNumber];
        console.log(dataObj);
        try {
          if (dataObj) {
            dataObj.ean && addElementToDocument('pd_gtin', dataObj.ean);
            dataObj.code && addElementToDocument('pd_sku', dataObj.code);
            dataObj.ratings && addElementToDocument('pd_aggregateRating', dataObj.ratings.ratingAvg);
            dataObj.ratings && addElementToDocument('pd_ratingCount', dataObj.ratings.ratingCount);
            dataObj.ratings && addElementToDocument('pd_ratingCount', dataObj.ratings.ratingCount);
            const image = dataObj.customImageData ? dataObj.customImageData[0].sizes.pop() : '';
            image && addElementToDocument('pd_image', `https://www.interdiscount.ch/${image.url}`);
            const alternateImages = dataObj.customImageData;
            alternateImages.shift();
            alternateImages && alternateImages.length && alternateImages.forEach(element => {
              const currrentImage = element.sizes.pop();
              image && addElementToDocument('pd_alternateImages', `https://www.interdiscount.ch/${currrentImage.url}`);
            });
            dataObj.productPriceData && dataObj.productPriceData.insteadPrice && addElementToDocument('pd_listPrice', dataObj.productPriceData.insteadPrice.value);
            dataObj.productPriceData && dataObj.productPriceData.finalPrice && addElementToDocument('pd_price', dataObj.productPriceData.finalPrice.value);
            dataObj.manufacturer && addElementToDocument('pd_manufacturer', dataObj.manufacturer);
            if (dataObj.productVariants) {
              addElementToDocument('pd_variantCount', dataObj.productVariants[0].options.length);
              dataObj.productVariants[0].options.forEach(item => {
                addElementToDocument('pd_variants', item.product.code);
              });
            }
          }
        } catch (error) {
          console.log('Adding element to Dom Failed!!');
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
