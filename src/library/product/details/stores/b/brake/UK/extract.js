const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'brake',
    transform: cleanUp,
    domain: 'brake.co.uk',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 5000));
    await context.evaluate(async () => {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const text = element ? element.textContent : null;
        return text;
      }

      function getServingSizeUom (value) {
        const ServingSizeUom = value.match(/\((\w+)\)/);
        const uomValue = ServingSizeUom ? ServingSizeUom[1] : null;
        return uomValue;
      }

      addElementToDocument('productUrl', window.location.href);
      const addToCartBtn = document.querySelector('div.product-details__price-panel.visible-md a.cart__add-button');
      const productAvailability = addToCartBtn ? 'In stock' : 'Out of stock';
      addElementToDocument('productAvailability', productAvailability);
      // @ts-ignore
      const productBrand = window.dataLayer[1].ecommerce.detail.products[0].brand;
      if (productBrand)addElementToDocument('brand', productBrand);
      const discountedPrice = document.querySelector('div.product-details__price-panel.visible-md span.product-details-price--current-price.has-was-price');
      const priceBeforeDiscount = document.querySelector('div.product-details__price-panel  span.product-details-price--was-price');
      const listPrice = discountedPrice && priceBeforeDiscount ? priceBeforeDiscount.textContent : '';
      addElementToDocument('listPrice', listPrice);

      const description = getEleByXpath('//div[contains(@class, "product-details__price-panel visible-md")]//following-sibling::div[@id="jsProductDetailsDesc"]/div');
      const descriptionText = description ? description.replace(/\.\.\./, '') : '';
      addElementToDocument('descId', descriptionText);

      const alcoholContentText = description ? description.match(/\d+% ABV/) : null;
      const alcoholContent = alcoholContentText ? alcoholContentText[0] : '';
      addElementToDocument('alcoholContentId', alcoholContent);

      const imageZoom = document.querySelector('div.zoom-trap');
      if (imageZoom) {
        addElementToDocument('zoomExistId', 'Yes');
      } else {
        addElementToDocument('zoomExistId', 'No');
      }

      const packSizeInfo = document.querySelector('div.product-details__price-panel.visible-md div.product-size__item.product-size__item--size-pack');
      const packSizeText = packSizeInfo ? packSizeInfo.textContent : null;
      const packSize = packSizeText ? packSizeText.replace(/Pack size: /, '') : '';
      addElementToDocument('packSizeid', packSize);

      const fatInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "Fat")]');
      const fatPerServingUom = fatInfo ? getServingSizeUom(fatInfo) : '';
      const saturatedFatInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "saturates")]');
      const saturatedFatPerServingUom = saturatedFatInfo ? getServingSizeUom(saturatedFatInfo) : '';
      const proteinInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "Protein")]');
      const proteintPerServingUom = proteinInfo ? getServingSizeUom(proteinInfo) : '';
      const sugarInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "sugars")]');
      const sugarPerServingUom = sugarInfo ? getServingSizeUom(sugarInfo) : '';
      const fibreInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "Fibre")]');
      const fibrePerServingUom = fibreInfo ? getServingSizeUom(fibreInfo) : '';
      const carboInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "Carbohydrates")]');
      const carboPerServingUom = carboInfo ? getServingSizeUom(carboInfo) : '';
      const saltInfo = getEleByXpath('//div[@id="collapse2"]//th[contains(text(), "Salt")]');
      const saltPerServingUom = saltInfo ? getServingSizeUom(saltInfo) : '';

      addElementToDocument('totalFatPerServingUom', fatPerServingUom);
      addElementToDocument('saturatedFatPerServingUom', saturatedFatPerServingUom);
      addElementToDocument('proteintPerServingUom', proteintPerServingUom);
      addElementToDocument('sugarPerServingUom', sugarPerServingUom);
      addElementToDocument('fibrePerServingUom', fibrePerServingUom);
      addElementToDocument('carboPerServingUom', carboPerServingUom);
      addElementToDocument('saltPerServingUom', saltPerServingUom);
    });
    await context.extract(productDetails, { transform });
  },
};
