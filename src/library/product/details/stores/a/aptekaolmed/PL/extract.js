
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
    console.log('availabilty----------',availability1)
    var availability=''
    if (availability1.includes('Out Of Stock')){
      availability = "Out of Stock"
    }
    else{
      availability="In Stock"
    }
    console.log('availabilty----------',availability)
    var price=''
    // @ts-ignore
    price = getXpath('//*[@id="projector_price_value"]//text()', 'nodeValue');
    
    if (price.length > 0){
      price = price.replace(',','.')
    }
    else{
      price = ''
    }
    var y='';
    // var z=''
    var specification = getAllXpath('//table[@class="n54117_dictionary"]//td//text()', 'nodeValue');
    for (let k = 0; k < specification.length; k++) {
      if(specification[k].length > 0){
        y=y+' '+specification[k].replace(/\s/g, ' ')
        }
      }
    if (y.length>0){
      y=y.replace(/\s+(\W)/g, "$1")
    }
    addElementToDocument('y', y);
    addElementToDocument('availability', availability);
    addElementToDocument('price', price);

  });
  await context.extract(productDetails);
  },
  };

