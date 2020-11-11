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
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // XPATH Data Extraction For Aggregate Rating
      // @ts-ignore
      const aggregateRating = window.dataLayer[0].product.rating_average;
      addElementToDocument('addedAggregateRating', aggregateRating);
      // @ts-ignore
      // XPATH Data Extraction For Shipping Info
      const deliveryDuration = window.dataLayer[0].product.offers[0].delivery_duration;
      // @ts-ignore
      const ShippingCost = window.dataLayer[0].product.offers[0].shipping_cost;
      addElementToDocument('shippingInfo', 'delivery Duration:' + deliveryDuration + ', Shipping Charges:' + ShippingCost);
      // @ts-ignore
      const sku = window.dataLayer[0].product.id;
      addElementToDocument('sku', sku);
      // @ts-ignore
      const quantity = window.document.getElementById('amount').value;
      addElementToDocument('quantity', quantity);
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
      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };
      // XPATH Data Extraction For Description Bullet
      const description = getAllXpath("//div[@class='rd-product-description__text']/div/p/text()", 'nodeValue');
      pipeSeparatorDouble('description', description);
      const sliceURL = (data) => {
        for (let index = 0; index < data.length; index++) {
          addElementToDocument('altImages', data[index].slice(23, -37));
        }
      };
      var backgroundURL = getAllXpath("//div[contains(@cs-id,'image-gallery-thumbnail')]/@style", 'nodeValue');
      sliceURL(backgroundURL);
      // @ts-ignore
      var data = document.querySelectorAll('div.rd-product-sidebar__info-card')[0].dataset.overlayAttr;
      var updatedData = JSON.parse(data);
      const sellerName = updatedData.childProps.name;
      const sellerOnRealSince = updatedData.childProps.sellerOnRealSince;
      var shipping_details = sellerName + " verkauft auf real.de seit: " + sellerOnRealSince;
      addElementToDocument('shipping_details', shipping_details);

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
      var height, diameter, maxCapacity, package_weight,Alcohol,Material;
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
    });
    await context.extract(productDetails);
  },
};
