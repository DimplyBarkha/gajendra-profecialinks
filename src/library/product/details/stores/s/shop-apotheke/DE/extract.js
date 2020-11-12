
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform: null,
    domain: 'shop-apotheke.com',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
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
      const descXpath = '//*[@id="o-ProductAdditionalInformation__teaser"]';
      let temp = document.evaluate(descXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
      temp = temp ? temp.innerText : '';
      addElementToDocument('pd_description', temp);
    });
    await context.extract(productDetails);
  },
};
