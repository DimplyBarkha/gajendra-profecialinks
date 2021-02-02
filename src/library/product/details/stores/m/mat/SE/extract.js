const { transform } = require("../../../a/amazon/shared");

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mat',
    transform: transform,
    domain: 'mat.se',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
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
      //promotion//
      const promo1 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_small']/text()", 'nodeValue');
      const promo2 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_big  text_subline']/text()[1]", 'nodeValue');
      const promo3 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_big  text_subline']/span/text()", 'nodeValue');
      var promotion = ""
      if (promo1 != null) {
        promotion = promotion + promo1
      }
      if (promo2 != null) {
        promotion = promotion + ' ' + promo2
      }
      if (promo2 != null) {
        promotion = promotion + ' ' + promo3
      }
      if (promotion.length >= 1) {
        addElementToDocument('promotion', promotion);
      }
      //calories//
      const abc2 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc2 != null) {
        if (abc2.includes('Kilokalori')) {
          var ll = abc2.split('Kilokalori')[0];
          var tt = ll.split(' ');
          var nn = tt[tt.length - 2];
          addElementToDocument('calory', nn);
        }
        else if (abc2.includes('Kilojoule')) {
          var pp = abc2.split('Kilojoule')[0];
          var aa = pp.split(' ');
          var nn = aa[aa.length - 2];
          addElementToDocument('calory', nn);
        }
        else if (abc2.includes('kilokalori/kilojoule')) {
          var pp = abc2.split('kilokalori/kilojoule')[0];
          var aa = pp.split(' ');
          var nn = aa[aa.length - 2];
          addElementToDocument('calory', nn);
        }
        else if (abc2.includes('kilojoule/kilokalori')) {
          var pp = abc2.split('kilojoule/kilokalori')[0];
          var aa = pp.split(' ');
          var nn = aa[aa.length - 2];
          addElementToDocument('calory', nn);
        }
      }

      //protin//
      const abc3 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc3 != null) {
        if (abc3.includes('protein ')) {
          var ll = abc3.split('protein ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('protin', nn);
        }
        else if (abc3.includes('Protein ')) {
          var ll = abc3.split('Protein ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('protin', nn);
        }
      }

      //fat//
      const abc4 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc4 != null) {
        if (abc4.includes('Fett ')) {
          var ll = abc3.split('Fett ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('fat', nn);
        }
        else if (abc4.includes('fett ')) {
          var ll = abc3.split('fett ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('fat', nn);
        }
      }

      //sodium//
      const abc11 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc11 != null) {
        if (abc11.includes('Natrium ')) {
          var ll = abc11.split('Natrium ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('sodium', nn);
        }
      }

      //fiber//
      const abc9 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc9 != null) {
        if (abc9.includes('Fiber ')) {
          var ll = abc9.split('Fiber ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('fiber', nn);
        }
        else if (abc9.includes('fiber ')) {
          var ll = abc9.split('fiber ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('fiber', nn);
        }
      }

      //saturated//
      const abc7 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc7 != null) {
        if (abc7.includes('fleromättat fett ')) {
          var ll = abc3.split('fleromättat fett ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('saturated', nn);
        } else if (abc7.includes('mättat fett ')) {
          var ll = abc3.split('mättat fett ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('saturated', nn);
        }
      }

      //sugar//
      const abc6 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc6 != null) {
        if (abc6.includes('sockerarter ')) {
          var ll = abc3.split('sockerarter ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('sugar', nn);
        }
      }

      //carbs//
      const abc5 = getXpath("//div[@class='box clearfix mobileNone']/div/p/strong[contains(text(),'Näringsvärde:')]/parent::p/text()", 'nodeValue');
      if (abc5 != null) {
        if (abc5.includes('kolhydrat ')) {
          var ll = abc5.split('kolhydrat ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('carb', nn);
        }
        else if (abc5.includes('Kolhydrat ')) {
          var ll = abc5.split('Kolhydrat ')[1];
          var tt = ll.split(' ');
          var nn = tt[0];
          addElementToDocument('carb', nn);
        }
      }

      // @ts-ignore
      const rawdata = getXpath("//script[@type='application/ld+json']/text()", 'nodeValue');
      if (rawdata != null) {
        const jsondata = JSON.parse(rawdata);
        var currency = jsondata.offers.priceCurrency;
        var price = jsondata.offers.price;
        if (price != null) {
          var num = Number(price)
          price = num + " " + currency
          price = price.replace(".",",");
          addElementToDocument('price', price);
        }

        var gtin = jsondata.gtin13;
        if (gtin != null) {
          addElementToDocument('gtin', gtin);
        }

        var stock = jsondata.offers.availability;
        if (stock != null) {
          stock = stock.split("org/")[1]
          if (stock.includes("In")) {
            stock = "In Stock"
          } else {
            stock = "Out of Stock"
          }
          addElementToDocument('stock', stock);
        }


        // @ts-ignore
        var productID = window.product.id;
        if (productID != null) {
          addElementToDocument('id', productID);
        }
      }

      // const brand = jsondata.brand;
      // if (brand != null){
      // addElementToDocument('brand', brand);
      // }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
