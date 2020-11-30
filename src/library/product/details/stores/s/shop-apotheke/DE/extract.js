const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    transform,
    domain: 'shop-apotheke.com',
  },
  implementation: async (inputs, { country, domain, transform }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // @ts-ignore
      const dataObj = window.dataLayer[0].product;
      function addElementToDocument(key, value) {
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
        addElementToDocument('pd_mpn', mainDataObj.variants[0].manufacturerCode);
        addElementToDocument('pd_image', mainDataObj.product.thumbnailURL);
        // addElementToDocument('pd_variant_ids', mainDataObj.variants.slice(1).map(elm=>elm.id));
        if (mainDataObj.product.rating) {
          addElementToDocument('pd_aggregateRating', mainDataObj.product.rating);
        }
        if (mainDataObj.variants.length > 1) {
          const variantIds = mainDataObj.variants.slice(1).map(elm => elm.id);
          addElementToDocument('pd_variant_ids', variantIds);
          addElementToDocument('pd_first_variant', dataObj.unitQuantityString + ' ' + dataObj.unit);
          addElementToDocument('pd_variant_info', mainDataObj.currentVariantId);
        } else {
          console.log('variant not found');
        }
      }
    });
    await context.extract(productDetails, { transform });
  },
};
