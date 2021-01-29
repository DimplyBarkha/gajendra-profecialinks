
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'mat',
    transform: null,
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
      const promo1 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_small']/text()",'nodeValue');
      const promo2 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_big  text_subline']/text()[1]",'nodeValue');
      const promo3 = getXpath("//div[@class='circle red-bg size-100']/div[@class='text_big  text_subline']/span/text()",'nodeValue');
      var promotion = ""
      if (promo1 != null){
        promotion = promotion + promo1
      }
      if (promo2 != null){
        promotion = promotion + ' ' + promo2
      }
      if (promo2 != null){
        promotion = promotion + ' ' + promo3
      }
      if (promotion.length >= 1){
        addElementToDocument('promotion', promotion);
      }

      // @ts-ignore
      const rawdata = getXpath("//script[@type='application/ld+json']/text()",'nodeValue');
      const jsondata = JSON.parse(rawdata);
      var currency = jsondata.offers.priceCurrency;
      var price = jsondata.offers.price;
      if (price != null){
        var num = Number(price)
        price = num + " " + currency
        addElementToDocument('price', price);
      }
      
      var gtin = jsondata.gtin13;
      if (gtin != null){
      addElementToDocument('gtin', gtin);
      }

      var stock = jsondata.offers.availability;
      if (stock != null){
        stock = stock.split("org/")[1]
        if (stock.includes("In")){
          stock = "In Stock"
        }else{
          stock = "Out of Stock"
        }
      addElementToDocument('stock', stock);
      }

      // @ts-ignore
      var productID = window.product.id;
      if (productID != null){
      addElementToDocument('id', productID);
       }

      // const brand = jsondata.brand;
      // if (brand != null){
      // addElementToDocument('brand', brand);
      // }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
