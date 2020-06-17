
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
        addElementToDocument('pd_aggregateRating', mainDataObj.product.rating);
        addElementToDocument('pd_image', mainDataObj.product.thumbnailURL);
      }
      const descriptionIterator = document.evaluate('//div[@class="o-ProductDescriptions"]//div[contains(@class,"o-ProductDescriptions__general")]/section', document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
      let description = descriptionIterator.iterateNext();
      let descriptionString = '';
      while (description) {
        descriptionString += `${description.innerText};`;
        description = descriptionIterator.iterateNext();
      }
      if (descriptionString) {
        addElementToDocument('pd_description', descriptionString.trim());
      }
      let manufacturerDescription = document.evaluate('//h2[contains(text(), "Produktdetails & Pflichtangaben")]/following-sibling::*/child::*[contains(@class,"o-ProductAdditionalInformation")]/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      manufacturerDescription = manufacturerDescription ? manufacturerDescription.src : '';
      addElementToDocument('pd_manufacturerImages', manufacturerDescription);
      const listPrice = document.evaluate('//*[contains(@class,"m-ProductVariant__label--last")]/div[2]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (listPrice) {
        const replaceChars = { '.': ',', ',': '.' };
        const priceData = (listPrice.innerText).replace(/[./,]/g, function (match) { return replaceChars[match]; });
        addElementToDocument('pd_listPrice', priceData);
      }
    });
    await context.extract(productDetails);
  },
};
