const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: null,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {      
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="ah-image-carousel-nav-wrapper palm-hidden"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
      const sliceURL = (data) => {
        for (let index = 0; index < data.length; index++) {
          if (data[index].includes(":")) {
            var temp = data[index].replace(":", ",");
          } else if (data[index].includes(".")) {
            var temp = data[index].replace(".", ",");
          } else {
            temp = data[index].replace(":-", ",");
          }
          addElementToDocument('price', temp);
        }
      };
      var backgroundURL = getAllXpath("//td[@class='trackPrice depth_2']/text()", 'nodeValue');
      sliceURL(backgroundURL);
      try {
        // @ts-ignore        
        var man = document.querySelector('td[class="long_description depth_1"]').innerText
        addElementToDocument('manu', man);
      } catch (error) {
      }
    });
    await context.waitForSelector('td[class="long_description depth_1"]', 3000)
    await context.extract(productDetails, { transform: transformParam });
  },
};
