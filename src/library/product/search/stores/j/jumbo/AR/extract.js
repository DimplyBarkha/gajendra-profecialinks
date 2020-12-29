const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'jumbo',
    transform,
    domain: 'jumbo.ar',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      let scrollTop = 0;
while (scrollTop !== 10000) {
await stall(500);
scrollTop += 500;
window.scroll(0, scrollTop);
if (scrollTop === 10000) {
await stall(500);
break;
}
}
function stall(ms) {
return new Promise((resolve, reject) => {
setTimeout(() => {
resolve();
}, ms);
});
}

      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
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
        var id = getAllXpath('//div[@class="product-field product_field_749 product-field-type_2"]/ul/li/text()', 'nodeValue');
        for(var i=0; i<id.length; i++ ) {
          var z = id[i].split('ref_id":"')[1];
          z = z.split('",')[0]
          console.log(z,'ssssssssssssssssssss')
          addHiddenDiv('z', z, i);
          }
          function addHiddenDiv(id, content, index) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            const originalDiv = document.querySelectorAll('div[class="product-item__info"]')[index];
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);
            }  
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};

