
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
    var backgroundURL = getAllXpath('//div[contains(@class,"projector_longdescription cm")]//text()', 'nodeValue');
    var xyz = [];
    for(var i=0; i<backgroundURL.length ; i++){
      if(backgroundURL[i].length > 1){
      xyz.push(backgroundURL[i]);
      }
    }
    // @ts-ignore
    xyz = xyz.join(" ");
    addElementToDocument('xyz', xyz);
    console.log(xyz,'xyz------------')
    // var backgroundURL1 = getAllXpath('//td/span[contains(text(),"Marka")]/following::td[1]//text()', 'nodeValue');
    // var brandd;
    // if (backgroundURL1.length > 0 ) {
    //   brandd = backgroundURL1
    // }
    // else{
    //   brandd = backgroundURL1 = getAllXpath('//a[@class="brand"]//text()', 'nodeValue');
    // }
    // addElementToDocument('brandd', brandd);
    // @ts-ignore
    const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[3].innerText;
    const jsondata = JSON.parse(rawdata);
    const availability1 = (jsondata.offers[0].availability);
    var availability=''
    if (availability1.includes('Out of Stock')){
      availability = "Out of Stock"
    }
    else{
      availability="In Stock"
    }
    const price = jsondata.offers[0].price;
    addElementToDocument('availability', availability);

    addElementToDocument('price', price);

  });
  await context.extract(productDetails);
  },
  };

