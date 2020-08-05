const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain , transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // @ts-ignore
      const dataObj = window.dataLayer[0].product;
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      if (dataObj) {
        addElementToDocument('pd_id', dataObj.id);
        addElementToDocument('pd_name', dataObj.name);
        addElementToDocument('pd_category', dataObj.categoryPath);
        addElementToDocument('pd_quantity', dataObj.unitQuantityString + ' ' + dataObj.unit);
        addElementToDocument('pd_price', dataObj.priceBrutto);
      }
      // @ts-ignore
      const mainDataObj = window.__PRELOADED_STATE__[0].componentInitialState.ProductVariantsInitialState;
      if (mainDataObj) {
        addElementToDocument('pd_variantId', mainDataObj.currentVariantId);
        addElementToDocument('pd_availabilityText', mainDataObj.product.stockStatus.statusReason.trim());
        addElementToDocument('pd_sku', mainDataObj.currentVariantId);
        addElementToDocument('pd_ratingCount', mainDataObj.product.numberOfRatings);
        if (mainDataObj.product.rating) {
          addElementToDocument('pd_aggregateRating', mainDataObj.product.rating);
        }
        addElementToDocument('pd_image', mainDataObj.product.thumbnailURL);
      }
      const temp = document.querySelector('div[id="o-ProductAdditionalInformation__teaser"]');
      let descArray = [];
      if (temp) {
        for (let i = 0; i < temp.children.length; i++) {
          const arrayTemp = [];
          const ulElement = temp.children[i].querySelectorAll('ol li');
          if (ulElement.length) {
            ulElement.forEach(item => {
              const text = ` || ${item.innerText.trim()}`;
              arrayTemp.push(text);
            });
            descArray.push(`${arrayTemp.join('')} | `);
          } else {
            descArray.push(temp.children[i].innerText);
          }
        }
      }
      // @ts-ignore
      descArray = descArray && descArray.length ? descArray.join('') : '';
      descArray && addElementToDocument('pd_description', descArray);
    });
    return await context.extract(productDetails, { transform });
  },
};
