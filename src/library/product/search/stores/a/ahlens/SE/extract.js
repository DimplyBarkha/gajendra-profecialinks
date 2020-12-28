const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: transform,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      while (!!document.querySelector('#ahl-product-list-app > div > div >button')) {
        // @ts-ignore
        document.querySelector('#ahl-product-list-app > div > div >button').click()
        await new Promise(r => setTimeout(r, 6000));
        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.className = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('span[class="MuiCardActionArea-focusHighlight"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDivPrice(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('span[class="MuiCardActionArea-focusHighlight"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      var rating = getAllXpath("//*[contains(@class,'MuiCardContent-root')]//div/div//span[contains(text(),'kr')][1]/text()");
      for (let index = 0; index < rating.length; index++) {        
        if (rating[index].includes(":")) {
          var temp = rating[index].replace(":", ".");
        } else if (rating[index].includes(",")){
          var temp = rating[index].replace(",", ".");
        } else {
          temp = rating[index].replace(":-", ".");
        }           
        addHiddenDivPrice('price', temp, index);
      }

    });
    return await context.extract(productDetails, { transform });
  },
}
