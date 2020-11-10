const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'sephora',
    transform: cleanUp,
    domain: 'sephora.de',
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

    // Method to Retrieve Xpath content of a Single Node
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };



    var coupon_str = getXpath("//p[@class='banner-description']/text()", 'nodeValue');
    if(coupon_str != null){
      var coupon = coupon_str.split(": ")[1];
    addElementToDocument('altImages', coupon);
    }
    
    var ppu = getXpath("//div[@class='price-block-right']/div[@class='unit-price']/span[@class='unit']/text()", 'nodeValue')
    // .toString()).replace(/(\r\n|\n|\r)/gm, " ")).replace(" € * , / , ", "/");
    if (ppu != null){
      var pp = ppu.split(" ")[0];
      pp = ppu.replace(",",".");
      // var pp = (ppu.toString()).replace(/(\r\n|\n|\r)/gm, " ").replace(" € * , / , ", "/");
      // var pp = pp.substring(0, pp.length - 3);
      addElementToDocument('ppu', pp);
    }

    var ppuu = getXpath('(//span[@class="variation-title bidirectional"])[1]/text()', 'nodeValue')
    if ( ppuu != null){
      if(ppuu.includes("ml")){
        ppuu = ppuu.slice(-2);
        addElementToDocument('ppuu', ppuu);
       }
    }
    

    
    var promotion = getXpath("//div[@class='product-flag']/div/span/text()", 'nodeValue')
    if (promotion != null){
      promotion = promotion.replace(" ","")
      // promotion = promotion.split(" ")[1];
      addElementToDocument('promotion', promotion);
    }
    

    var lisPri = getXpath('(//span[@class="price-standard"])[1]/text() | //span[@class="price-sales price-sales-standard"]/span/text()', 'nodeValue');
    if (lisPri != null){
      var lis = lisPri.split(" ")[0].replace(",",".")
      // var lis = (lisPri.split(" ")[0]).replace(",","");
      // var lis = lisPri.replace(".","");
      addElementToDocument('lisPri', lis);
    }
  

    var variant = getAllXpath('//a[@class="variation-display-name "]/@data-pid', 'nodeValue');
    if ( variant != null) {
      // var vari = variant.toString();
      addElementToDocument('variant', variant);
    }


    var info = getAllXpath('//ul[@class="display-name display-name-size no-bullet"]/li//span[@class="variation-title bidirectional"]/text()', 'nodeValue')
    if ( info != null) {
      var inf = (info.toString()).replace(/(\r\n|\n|\r)/gm, "");
      var comma = (inf.split(",").length - 1);
      for (comma; comma > 0; comma--) {
        inf = inf.replace(",", "|");
      }
      addElementToDocument('info', inf);
    }


    //nameExtended ( product description )
    var first = getXpath('//span[@class="brand-name"]/a/text()', 'nodeValue');
    var second = getXpath('//span[@class="product-name product-name-bold"]/text()', 'nodeValue');
    
    // var third = getXpath('//div[@class="description-container"]/span[@class="more-ellipses"]/text()', 'nodeValue');
    // var fourth = getXpath('//div[@class="description-container"]/a/text()', 'nodeValue');
    // var final = first+"\n"+second+" "+third+"\n"+fourth;
    if(first != null)
    {
      if(second != null){
        var final = first+" "+second;
        addElementToDocument('nameExt', final);
      }
    }
    
    //price
    var price = getXpath('(//div[@class="product-price  st-price "]/span/span)[1]/text() | (//span[@class="price-sales "]/span/text())[1]', 'nodeValue');
    if ( price != null){
      price = price.replace(",",".");
      addElementToDocument('price', price);
    }

    // var manu_image = getAllXpath('//div[@class="brand-content-image"]/img/@src', 'nodeValue');

  });
  return await context.extract(productDetails, { transform });
}
