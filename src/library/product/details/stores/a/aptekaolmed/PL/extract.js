
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'aptekaolmed',
    transform: null,
    domain: 'aptekaolmed.pl',
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
    var getXpath = (xpath, prop) => {
    var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
    let result;
    if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
    else result = elem ? elem.singleNodeValue : '';
    return result && result.trim ? result.trim() : result;
    };
    var backgroundURL = getAllXpath('//div[contains(@class,"projector_longdescription cm")]/p//text()', 'nodeValue');
    var xyz = [];
    for(var i=0; i<backgroundURL.length ; i++){
      if(backgroundURL[i].length > 1){
      xyz.push(backgroundURL[i]);
      }
    }
    xyz = xyz.join(" || ");
    addElementToDocument('xyz', xyz);
  });
  await context.extract(productDetails);
  },
  };

