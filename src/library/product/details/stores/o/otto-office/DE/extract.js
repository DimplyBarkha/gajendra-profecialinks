
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto-office',
    transform: null,
    domain: 'otto-office.com',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(() => {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv1(id, content, index) {
        const newDiv = document.createElement("div");
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = "none";
        const originalDiv = document.querySelectorAll('h1[id="oo-block-hl"]')[index];
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
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var spec = getAllXpath('//ul[@class="ooB-mb24 bullet ooX-fs14 "]/li/text()', 'nodeValue');
      if (spec != null) {
        var str = spec.join(" || ");
        addElementToDocument('str', str);
      }
      var avl = getXpath('//button[@class="ooB-mb6 ooB-w100 ooBtn ooBtn-green ooBtn-arrow-right btn-add-to-basket"]/text()', 'nodeValue');
      if (avl != null) {
        avl = "In Stock"
        addElementToDocument('avl', avl);
      } else {
        avl = "Out Of Stock"
        addElementToDocument('avl', avl);
      }
      try {
        var price = getXpath('//div[@class="preis_gelb_links"]/p/span[1] | //div[@class="oo-pricelabel_price"]/p/span[1]/span[position()>1 and position()<4]/text()', 'nodeValue');
        if (price != null) {
          for (var i = 0; i < price.length; i++) {
            var price1 = price[i].replace(",", ".");
            addHiddenDiv1("price", price1, i);
          }
        }
        const URL = window.location.href;
        try {
          document.getElementById("pd_url").remove();
        } catch (error) { }
        addElementToDocument("pd_url", URL);
      }
      // @ts-ignore
      // @ts-ignore
      catch (error) {
      }
//specification
var spec1 = getAllXpath('//span[contains(text(),"Eigenschaften ")]/parent::h2/following::div[1]/table/tbody/tr/td/span/text()', 'nodeValue');
var spec2 = getAllXpath('//span[contains(text(),"Eigenschaften ")]/parent::h2/following::div[1]/table/tbody/tr/td/text()', 'nodeValue');
if(spec1.length>=1){
  var arr = [];
  for(var i=0; i<spec2.length; i++){
    arr[i] = spec2[i].trim();
    }
    var wife = [];
    for(var i=0; i<arr.length; i++){
    if(arr[i].length >= 1){
    wife.push(arr[i])
    }
    }
    var husband = [];
    for(var i=0; i<spec1.length; i++){
    husband[i] = spec1[i].trim();
    }
    var final = ""
    for(var i=0; i<husband.length; i++){
    final = final+" "+husband[i]+" "+wife[i];
    }
    addElementToDocument("final", final);
}
//URL
var url = getXpath('//div[@class="inner_content"]/script[@type="application/ld+json"]/text()', 'nodeValue');
if(url.length>= 1){
  var data = JSON.parse(url);
  if(typeof(data)=="object"){
  var URL = data.offers.url;
  URL = URL.split("?wkid")[0];
  addElementToDocument("URL", URL);
  }
  }
//SKU
var sku = getXpath('//figure[@id="image-preview-container"]/img/@src', 'nodeValue');
sku = sku.replace(/(.+ART_)(\d+)(([A-Z]+)?)(_+.+)/g,'$2$3');
addElementToDocument("sku", sku);


    });
    await context.extract(productDetails);
  },
};