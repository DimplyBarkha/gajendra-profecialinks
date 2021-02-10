const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    transform: cleanUp,
    domain: 'primor.eu',
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
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
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

    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
      // price
    };
    var desc1 = getXpath('//p[@class="our_price_display pull-left"]//span[@itemprop="price"]/text()', 'nodeValue');

    if (desc1 != null) {
      desc1 = desc1.replace(",", ".")
      addElementToDocument('desc1', desc1);
    }

    //ingredients//

    var inglist = getXpath('//td/span[contains(text(),"Ingredientes")]/text()', 'nodeValue');
    var inglist2 = getAllXpath('//td/span[contains(text(),"Ingredientes")]/parent::td/p/text()', 'nodeValue');

    if (inglist != null) {
      var data = "";
      for (var i = 0; i < inglist2.length; i++) {
        data = data + inglist2[i];
      }
      var ingredient = inglist + ' ' + data;
      addElementToDocument('ingredient', ingredient);
    }

    // list-price
    var desc2 = getXpath('//p[@id="old_price"]/span[@class="old-price"]/text()', 'nodeValue');

    if (desc2 != null) {
      // if (desc2.includes(":")) {
      //   desc2 = desc2.split(": ")[1]
      // }
      desc2 = desc2.replace(",", ".")
      addElementToDocument('desc2', desc2);
    }

    //availibility//
    var ava = getXpath('//link[@itemprop="availability"]/@href', 'nodeValue');
    if (ava != null) {
       if (ava.includes("OutOfStock")) {
         ava = "Out of Stock"
       }else if (ava.includes("InStock")) {
        ava = "In Stock"
      }
      addElementToDocument('avail', ava);
    }



    // product Description
    var brand1 = getXpath('//span[@itemprop="brand"]/text()', 'nodeValue');
    var brand2 = getAllXpath('//h1[@itemprop="name"]/text()', 'nodeValue');
    var brand3 = getXpath('//span[@class="checked"]/following::span[1]/text()', 'nodeValue');
    var brand4 = getXpath('//span[@class="attribute-name"]/text()', 'nodeValue');
    var brand5 = getXpath('//span[@id="selected-product-name"]/text()', 'nodeValue');

    if (brand2.length >= 1) {
      var temp = "";
      for (var i=0; i<brand2.length; i++){
        temp = temp + " "  + brand2[i]
      }
    }
    var final = "";
    if (brand1 != null){
      final = final + brand1;
    }
    if (temp != null){
      final = final + temp;
    }
    if (brand3 != null){
      final = final + " " + brand3;
    }
    if (brand4 != null){
      final = final + " - " + brand4;
    }
    if (brand5 != null && brand4==null){
      final = final + " - " + brand5;
    }

    addElementToDocument('product_desc', final);

    // promotion
    var desc3 = getXpath('//p[@id="reduction_percent"]/span[@id="reduction_percent_display"]/text()', 'nodeValue');

    if (desc3 != null) {
      desc3 = desc3.split("-")[1]
      addElementToDocument('desc3', desc3);
    }
    // Method to Retrieve Xpath content of a Multiple Nodes
    // const getAllXpath = (xpath, prop) => {
    //   const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    //   const result = [];
    //   for (let index = 0; index < nodeSet.snapshotLength; index++) {
    //     const element = nodeSet.snapshotItem(index);
    //     if (element) result.push(prop ? element[prop] : element.nodeValue);
    //   }
    //   return result;
    // };
    // Double Pipe Concatenation
    // const pipeSeparatorDouble1 = (id, data) => {
    //   // var doubleSeparatorText = data.join(' || ');
    //   addElementToDocument('id', data);
    // }

    // XPATH Data Extraction For Additional Description Bullet
    const addDescBulletInfo1 = getAllXpath("(//div[@itemprop='description']/p/strong/text())[1] | //div[@itemprop='description']/p/span/text() | //div[@itemprop='description']/p/text()", 'nodeValue');
    if (addDescBulletInfo1 != null) {
      var abc = addDescBulletInfo1.join(" || ");
      addElementToDocument('id', abc);

    }
    var rating = getXpath('//div[@itemprop="aggregateRating"]/meta[@itemprop="ratingValue"]//@content', 'nodeValue');
    if (rating != null) {

      rating = rating / 2;
      addElementToDocument('rating', rating);
    }


  });
  //rank end
  return await context.extract(productDetails, { transform });


};

