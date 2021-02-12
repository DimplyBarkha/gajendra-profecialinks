const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'feelunique',
    transform: cleanUp,
    domain: 'feelunique.com',
    zipcode: '',
  },
  implementation,
};

async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
	) {
	 const { cleanUp } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async function () {   

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);       
        let result;      
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];    
        else result = elem ? elem.singleNodeValue : '';    
        return result && result.trim ? result.trim() : result; 
        };

      //   function addHiddenDiv(id, content, index) {
      //     const newDiv = document.createElement('div');
      //     newDiv.id = id;
      //     newDiv.textContent = content;
      //     newDiv.style.display = 'none';
      //     const originalDiv = document.querySelectorAll('div[class="option-item option-item-swatch"] input')[index];
      //     originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      // }

      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.getElementsByClassName('variants')[index].appendChild(newDiv);
      }

      const getAllXpath = (xpath, prop) => {
          const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          const result = [];
          for (let index = 0; index < nodeSet.snapshotLength; index++) {
              const element = nodeSet.snapshotItem(index);
              if (element) result.push(prop ? element[prop] : element.nodeValue);
          }
          return result;
      };

      function addEmptyDiv() {
        const newDiv = document.createElement('div');
        newDiv.className = 'variants';
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      try {
      const sku = getAllXpath('//input[@name="productSku"]/@value', 'nodeValue')
      const variant_sku = getAllXpath('//div[@class="sub-products h-push-v"]/div[@class="option-item option-item-swatch"]/label/@data-sub-sku', 'nodeValue')
      if (variant_sku.length > 1){
      const variant_price = getAllXpath('//div[@class="sub-products h-push-v"]/div[@class="option-item option-item-swatch"]/label/@data-subprice', 'nodeValue')
      const variant_availability = getAllXpath('//div[@class="sub-products h-push-v"]/div[@class="option-item option-item-swatch"]/label/@data-is-in-stock', 'nodeValue')

      for (let increment = 0; increment < variant_sku.length; increment++) {
        try {
          addEmptyDiv();
          addHiddenDiv("SKU_ID", sku[0]+"-"+variant_sku[increment], increment)
          addHiddenDiv('PRICE', variant_price[increment], increment);
          addHiddenDiv('AVAILABILITY', variant_availability[increment], increment);
        } catch (error) {
          continue;       
        } 
    }

      }
      else
      {
        const availability = getAllXpath('//div[@class="stock-level h-display-ib u-nudge-top h-third-l"]/text()', 'nodeValue')
        const price = getAllXpath('//p[@class="price-info"]//span[@class="Price"]/text()', 'nodeValue')[0].replace(/\s/g, '')
        try {
          addEmptyDiv();
          addHiddenDiv("SKU_ID", sku[0], 0)
          addHiddenDiv('PRICE', price, 0);
          addHiddenDiv('AVAILABILITY', availability[0], 0);
        } catch (error) {
               
        } 
      } 

      } catch (error) {

      }
  })


  return await context.extract(productDetails, { cleanUp });
}