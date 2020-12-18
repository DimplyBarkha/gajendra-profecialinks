
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'idealo',
    transform: null,
    domain: 'idealo.de',
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
      try {
        let price = document.querySelector('span[class*="oopStage-priceRangePrice"]');
        // @ts-ignore
        price = price ? price.innerText.trim() : '';
        if (price) {
          // @ts-ignore
          if (price.includes('–')) {
            // @ts-ignore
            addElementToDocument('pd_price', price.replace(/(.+)\s*–\s*(.+)/g, '$2'));
          } else {
            addElementToDocument('pd_price', price);
          }
        }
      } catch (error) {
        console.log('price not present');
      }
      try {
        // @ts-ignore
        const dataObj = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText.trim());
        if (dataObj) {
          dataObj && dataObj.aggregateRating && dataObj.aggregateRating.ratingValue && addElementToDocument('agg_rating', dataObj.aggregateRating.ratingValue);
          dataObj && dataObj.aggregateRating && dataObj.aggregateRating.ratingCount && addElementToDocument('rating_count', dataObj.aggregateRating.ratingCount);
          dataObj && dataObj.manufacturer && dataObj.manufacturer.name && addElementToDocument('pd_manufacturer', dataObj.manufacturer.name);
        }
      } catch (error) {
        console.log('json one not present');
      }
      try {
        const dataObjTwo = JSON.parse(document.querySelector('meta[name="ipc-init"]').getAttribute('data-ipc-init').trim());
        if (dataObjTwo) {
          dataObjTwo && dataObjTwo.productId && addElementToDocument('pd_variant_id', dataObjTwo.productId);
        }
      } catch (error) {
        console.log('json two not present');
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
