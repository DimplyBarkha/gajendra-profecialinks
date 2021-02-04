
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'linio',
    transform: null,
    domain: 'linio.com',
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
    const getAllXpath = (xpath, prop) => {
    const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    const result = [];
    for (let index = 0; index < nodeSet.snapshotLength; index++) {
    const element = nodeSet.snapshotItem(index);
    if (element) result.push(prop ? element[prop] : element.nodeValue);
    }
    return result;
    };
    var brand = getAllXpath('//no-script//text()', 'nodeValue');
    for (var i = 0; i < brand.length; i++)
    {
      if(brand[i].includes('product_id'))
      {
        var z = brand[i].toString()
        var a=(z).split('product_id":"')[1].split('","')[0];
      }
    }
    addElementToDocument('product_id', a);

  });
  await context.extract(productDetails);
  },
  };

