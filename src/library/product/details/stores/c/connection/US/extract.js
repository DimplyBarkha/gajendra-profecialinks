
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'connection',
    transform: null,
    domain: 'connection.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
          return result;
        }
      };
      const size = getAllXpath("//*[@id='productSizes']/div/button", 'nodeValue');
      console.log(' size==' + size);
      if (size != null) {
        addElementToDocument('size', size.join('|'));
      }

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(1000);
        scrollTop += 500;
        if (scrollTop === 10000) {
          break;
        }
      }
    });
    await context.extract(productDetails, { transform: transformParam });
  },

};
