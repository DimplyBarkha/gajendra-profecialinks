
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'whiteaway',
    transform: null,
    domain: 'whiteaway.com',
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
    var backgroundURL = getAllXpath('//*[contains(text(),"Specifikationer")]/following-sibling::div//text()', 'nodeValue');
    var xyz = [];
    for(var i=0; i<backgroundURL.length ; i++){
      var y = backgroundURL[i].replace(/\s/g, '')
      if(y.length > 1){
      xyz.push(y);
      }
    }
    // @ts-ignore
    xyz = xyz.join(" || ");
    addElementToDocument('xyz', xyz);
    var backgroundURL1 = getAllXpath('//h2[contains(text(),"Fordele og specifikationer")]/following::div[contains(@class, "js-expandable-text text-expand")]//text()', 'nodeValue');
    // console.log('backgroundURL1')
    var zzz = [];
    for(var i=0; i<backgroundURL1.length ; i++){
      var z = backgroundURL1[i].replace(/\s/g, ' ');
      var z = z.trim();
      if(z.length > 0 && z !== '. . .'  && z !== "Læs mere" && z !== "Skjul") {
      zzz.push(z);
      }
    }
    // @ts-ignore
    zzz = zzz.join(" || ");
    addElementToDocument('zzz', zzz);
    // function getElementByXpath(path) {
    //   return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    // }
    // var backgroundURL2 = getElementByXpath('//*[contains(text(),"Nettovægt")]/following::td[1]/text()').innerHTML
    // var brandd;
    
    // if (backgroundURL2.length > 0 ) {
    //   brandd = backgroundURL2
    // }
    // else{
    //   brandd = backgroundURL1 = getAllXpath('//a[@class="brand"]//text()', 'nodeValue');
    // }
    // addElementToDocument('brandd', brandd);
  });
  await context.extract(productDetails);
  },
  };
