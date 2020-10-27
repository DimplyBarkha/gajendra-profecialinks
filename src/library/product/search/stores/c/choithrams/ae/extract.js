const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // function addElementToDocument (key, value) {
    //   const catElement = document.createElement('div');
    //   catElement.id = key;
    //   catElement.style.display = 'none';
    //   document.body.appendChild(catElement);
    //   if (Array.isArray(value)) {
    //     const innerHTML = value.reduce((acc, val) => {
    //       return `${acc}<li>${val}</li>`;
    //     }, '<ul>') + '</ul>';
    //     catElement.innerHTML = innerHTML;
    //   } else {
    //     catElement.textContent = value;
    //   }
    //   return catElement;
    // }

    function addElementToDocumentOld (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      // catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
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

    // const getXpath = (xpath, prop) => {
    //   const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    //   let result;
    //   if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    //   else result = elem ? elem.singleNodeValue : '';
    //   return result && result.trim ? result.trim() : result;
    // };

    const priceText = getAllXpath("//div[@class='price']//span[1]//text()", 'nodeValue').join('|');
    var priceTextValue = priceText.split('|');

    const nameText = getAllXpath("//div[@class='small-product-box']//header//a[2]//text()", 'nodeValue').join('|');
    var nameTextValue = nameText.split('|');

    const productURLText = getAllXpath("//div[@class='small-product-box']//header//a[1]//@href", 'nodeValue').join('|');
    var productURLTextValue = productURLText.split('|');

    const thumbNailText = getAllXpath("//div[@class='product-image']//@src", 'nodeValue').join('|');
    var thumbNailTextValue = thumbNailText.split('|');

    const idPath = getAllXpath("//div[@class='small-product-box']//script//text()", 'nodeValue').join('|');
    var myIdArr = idPath.split('|');
    for (var i = 0; i < myIdArr.length; i++) {
      const idObj = JSON.stringify(myIdArr[i]);
      var myIdArrFinal = idObj.split(':');
      var myIdValue = myIdArrFinal[2].match(/'(.*?)'/);
      console.log('Array of Ids to be displayed ', myIdValue);
      addElementToDocumentOld('id', myIdValue[1]);
      addElementToDocumentOld('price', priceTextValue[i]);
      addElementToDocumentOld('name', nameTextValue[i]);
      addElementToDocumentOld('productUrl', 'https://www.choithrams.com' + productURLTextValue[i]);
      addElementToDocumentOld('thumbnail', 'https://www.choithrams.com' + thumbNailTextValue[i]);
      // const row = addElementToDocument('added_row', '');
      // row.setAttribute('idMatch', '123456');
      // console.log('My row get Attribute', row);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ae',
    store: 'choithrams',
    transform,
    domain: 'choithrams.com',
    zipcode: '',
  },
  implementation,
};
