const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'staples',
    transform: transform,
    domain: 'staples.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, { productDetails }) => {
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
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

      // const url = window.location.href;
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const productUrl = getAllXpath("//div[@aria-label='Search Results']//a[@class='standard-type__product_title']/@href", 'nodeValue');
      productUrl.forEach(element => {
        element = 'https://www.staples.com' + element;
        // console.log('productUrl' + productUrl);
        addHiddenDiv('added-productUrl', element);
      });
    }
    await context.evaluate(addUrl);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
