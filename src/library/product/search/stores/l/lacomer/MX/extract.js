const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'lacomer',
    transform: transform,
    domain: 'lacomer.com.mx',
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
  
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await new Promise((resolve, reject) => setTimeout(resolve, 7000));

  await context.evaluate(() => {
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };

    function addHiddenDiv(id, content, i) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      const originalDiv = document.querySelectorAll('td[class="artEan depth_1"]')[i];
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
    //Thumbnail//
    var start = "https://www.lacomer.com.mx/superc/img_art/";
    var agg = getAllXpath('//td[@class="artEan depth_1"]/text()', 'nodeValue');
    var end = "_1.jpg";
    if (agg.length >= 1) {
      for (var i = 0; i < agg.length; i++) {
        var image = ''
        image = image + start + agg[i] + end;
        addHiddenDiv('image', image, i)
      }
    }

    //product_url//

    var first = "http://www.lacomer.com.mx/lacomer/doHome.action?succId=14&succFmt=100&pasId=";
    var abc = getAllXpath('//td[@class="agruId depth_1"]/text()', 'nodeValue');
    var m1 = "&artEan="
    var pqr = getAllXpath('//td[@class="artEan depth_1"]/text()', 'nodeValue');
    var last = "&ver=detallearticulo&opcion=detarticulo";
    if (abc.length >= 1) {
      for (var i = 0; i < abc.length; i++) {
        var product = ''
        product = product + first + abc[i] +m1 + pqr[i] + last;
        addHiddenDiv('product', product, i)
      }
    }
  });
  return await context.extract(productDetails, { transform });
};
