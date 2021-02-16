// const { cleanUp } = require("@library/product/details/shared");
const { cleanUp } = require('../../../../shared');
// const { transform } = require('../../../a/amazon/shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'hagel-shop',
    transform: cleanUp,
    domain: 'hagel-shop.de',
    zipcode: '',
  },
  implementation: async function implementation(
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(() => {
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
      };
      //variants
      var vari = getAllXpath('//div[@class="simple-product-list"]//td/a[@class="product-name"]/strong/text()', 'nodeValue');
      if (vari != null) {
        var variants = vari.join(" | ");
        addElementToDocument('variants', variants);
      }

      //aggregate rating
      var agg = getXpath('//div[@class="col-sm-7"]//div[@class="rating-box"]/div/@style', 'nodeValue');
      if (agg != null) {
        var aggregate = agg.split(":")[1].slice(0, -1);
        aggregate = (aggregate * 5) / 100;
        aggregate = aggregate.toFixed(1);
        // var str = aggregate.toString();
        var final = aggregate.replace(".",",");

        // Number(real) + "," + first;
        // aggregate = final;
        // if(str.includes(".")){
        //   var real = str.split(".")[0];
        //   var dec = str.split(".")[1];
        //   if(dec.length > 1){
        //     var first = Number(dec[0]);
        //     var sec = Number(dec[1]);
        //     if(sec > 5){
        //       first = first + 1
        //     }
        //     var final = Number(real)+","+first;
        //     aggregate = final;
        //   }

        // }
        addElementToDocument('aggregate', final);
      }

      //specifications
      var spec = getAllXpath('//div[@id="product_attributes"]/table/tbody/tr/th/text()', 'nodeValue');
      var spec2 = getAllXpath('//div[@id="product_attributes"]/table/tbody/tr/td/text()', 'nodeValue');
      if (spec != null) {
        var specifications = "";
        for (var i = 0; i < spec.length; i++) {
          specifications = specifications + spec[i] + spec2[i];
          var j = i + 1;
          if (j < spec.length) {
            specifications = specifications + " || ";
          }
        }
        // var specifications = spec.join(" || ");
        addElementToDocument('specifications', specifications);
      }

      //price 
      var price = getXpath('//div[@class="price-details"]/div[@class="price-box"]/p[@class="special-price"]/span[@class="price"]/text() | //div[@class="simple-product-list"]/table/tbody/tr[1]//p[@class="special-price"]/span[@class="price"]/text() | //div[@class="price-details"]/div[@class="price-box"]/span[@class="regular-price"]//span[@class="price"]/text() | //div[@class="simple-product-list"]/table/tbody/tr[1]//div[@class="price-box"]/span/span/span[@class="price"]/text()', 'nodeValue');
      if (price != null) {
        // price = price.replace(",", ".");
        addElementToDocument('price', price);
      }

      //List price 
      var list_price = getXpath('(//p[@class="old-price"]/span[@class="price"])[1]/text()', 'nodeValue');
      if (list_price != null) {
        if (list_price.includes(",")) {
          // list_price = list_price.replace(",", ".");
        }
        addElementToDocument('list_price', list_price);
      }

      //size [ quantity ]
      var size = getXpath("//th[contains(text(),'Menge')]/following::td[1]/text() | //div[@class='product_description row']//p/strong[contains(text(),'ml')]/text()", 'nodeValue');
      if (size != null) {
        addElementToDocument('size', size);
      } else {
        size = getXpath('//div[@class="page-title product-name"]/h1/text()', 'nodeValue');
        if (size != null) {
          var ar = size.split(" ");
          if (ar[ar.length - 1] = "ml") {
            size = ar[ar.length - 2] + " ml";
            addElementToDocument('size', size);
          }
        }
      }

      //availability
      var aval = getXpath('//link[@itemprop="availability"]/@href', 'nodeValue');
      if (aval != null) {
        var arr = aval.split("/");
        aval = arr[arr.length - 1];
        if (aval.includes("In")) {
          aval = "In Stock"
        } else if (aval.includes("PreOrder")) {
          aval = "In Stock";
        } else {
          aval = "Out Of Stock"
        }
        addElementToDocument('aval', aval);
      }else{
        aval = "Out Of Stock";
        addElementToDocument('aval', aval);
      }

      // alternate image
      var secondary_image = getAllXpath('//div[@class="more-views"]/ul/li/a/@href', 'nodeValue');
      // if (secondary_image.length >= 1) {
      //   var alt_img = "";
      //   if (secondary_image.length == 2) {
      //     alt_img = secondary_image[0];
      //   } else {
      //     for (var i = 0; i < secondary_image.length; i++) {
      //       if (i == 1) {

      //       } else {
      //         alt_img = alt_img + secondary_image[i] + " | ";
      //       }
      //     }
      //     alt_img = alt_img.slice(0, -3);
      //   }
      //   addElementToDocument('alt_img', alt_img);
      // }
      if(secondary_image.length >= 2){
        var primary = getXpath('//p[@class="product-image product-image-zoom"]/span/img/@src', 'nodeValue');
        var alt_img = "";
        for(var i=0; i<secondary_image.length; i++){
          if(secondary_image[i] == primary){
            continue;
          }else{
            alt_img = alt_img + secondary_image[i] + " | ";
          }
        }
        alt_img = alt_img.slice(0,-2);
        addElementToDocument('alt_img', alt_img);
      }


      //directions
      var dir1 = getXpath('//*[contains(text(),"Anwendung")]/text()', 'nodeValue');
      var dir2 = getXpath('//*[contains(text(),"Anwendung")]/following::p[1]/text()', 'nodeValue');
      var directions = "";
      if (dir1 != null) {
        directions = directions + dir1;
      }
      if (dir2 != null) {
        directions = directions + dir2;
      }
      if (directions.length >= 1) {
        addElementToDocument('directions', directions);
      }




    });
    await context.extract(productDetails, { transform });
  },
};
