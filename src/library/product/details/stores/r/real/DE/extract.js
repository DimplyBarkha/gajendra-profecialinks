const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'real',
    transform: cleanUp,
    domain: 'real.de',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    
    await context.evaluate(async function () {

      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      try {
        // XPATH Data Extraction For Aggregate Rating
        // @ts-ignore
        const aggregateRating = window.dataLayer[0].product.rating_average;
        addElementToDocument('addedAggregateRating', aggregateRating);

      } catch (error) {

      }

      try {
        // @ts-ignore
        // XPATH Data Extraction For Shipping Info
        const deliveryDuration = window.dataLayer[0].product.offers[0].delivery_duration;
        // @ts-ignore
        const ShippingCost = window.dataLayer[0].product.offers[0].shipping_cost;
        addElementToDocument('shippingInfo', 'delivery Duration:' + deliveryDuration + ', Shipping Charges:' + ShippingCost);
      } catch (error) {

      }
      try {
        // @ts-ignore
        const sku = window.dataLayer[0].product.id;
        addElementToDocument('sku', sku);
      } catch (error) {

      }

      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      try {
        // @ts-ignore
        const description = document.querySelector('div[class="rd-product-description"]').innerText
        addElementToDocument('description', description);
      } catch (error) {

      }

      try {
        var temp;
        const sliceURL = (data) => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].includes('background-image: url')) {
              temp = data[index];
              temp = temp.replace('100x100', '1024x1024');
              addElementToDocument('altImages', temp.split('("').join('")').split('")')[1]);
            }
          }
        };
        var backgroundURL = getAllXpath("//div[contains(@cs-id,'image-gallery-thumbnail') and not(contains(@class,'active'))]/@style", 'nodeValue');
        sliceURL(backgroundURL);
      } catch (error) {

      }

      try {
        // @ts-ignore
        var data = document.querySelectorAll('div.rd-product-sidebar__info-card')[0].dataset.overlayAttr;
        var updatedData = JSON.parse(data);
        const sellerName = updatedData.childProps.name;
        const sellerOnRealSince = updatedData.childProps.sellerOnRealSince;
        var shipping_details = sellerName + " verkauft auf real.de seit: " + sellerOnRealSince;
        addElementToDocument('shipping_details', shipping_details);
      } catch (error) {

      }
      try {
        // @ts-ignore
        var fullText = document.querySelector("div[class='rd-product-description__text']").innerText;
        fullText = fullText.replace(/\n/g, "_____");
        const seperateText = fullText.split('_____');
        var index;
        for (index = 0; index < seperateText.length; index++) {
          if (seperateText[index].includes("Paketgewicht")) {
            addElementToDocument('weightGross', seperateText[index]);
            break;
          }
        }
        var height, diameter, maxCapacity, package_weight, Alcohol, Material;
        for (index = 0; index < seperateText.length; index++) {
          if (seperateText[index].includes("Höhe")) {
            height = seperateText[index];
          }
          if (seperateText[index].includes("Durchmesser")) {
            diameter = seperateText[index];
          }
          if (seperateText[index].includes("Maximale Füllmenge")) {
            maxCapacity = seperateText[index];
          }
          if (seperateText[index].includes("Paketgewicht")) {
            package_weight = seperateText[index];
          }
          if (seperateText[index].includes("Alkoholgehalt")) {
            Alcohol = seperateText[index];
          }
          if (seperateText[index].includes("Material") || seperateText[index].includes("Material")) {
            Material = seperateText[index];
          }
        }
      } catch (error) {

      }

      try {
        if (height.length > 0 || diameter.length > 0 || maxCapacity.length > 0) {
          addElementToDocument('shippingDimensions', height + ', ' + diameter + ', ' + maxCapacity);
        }

      } catch (error) {
      }
      try {
        if (package_weight.length > 0) {
          addElementToDocument('shippingWeight', package_weight);
        }
      } catch (error) {
      }
      try {
        if (Alcohol.length > 0) {
          addElementToDocument('Alcohol', Alcohol);
        }
      } catch (error) {
      }
      try {
        if (Material.length > 0) {
          addElementToDocument('Material', Material);
        }
      } catch (error) {
      }
      try {
        // @ts-ignore
        const size = document.querySelector('h1[class="rd-product-detail__title"]').innerText;
        if (size.includes('0,7 l')) {
          addElementToDocument('size', '0.7 Liters');
        }
      } catch (error) {
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
