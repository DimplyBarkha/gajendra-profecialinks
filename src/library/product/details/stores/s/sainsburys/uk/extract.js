const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'uk',
    store: 'sainsburys',
    transform: cleanUp,
    domain: 'sainsburys.co.uk',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('h2[class="pt__info__description"] a', 30000);
    await context.click('h2[class="pt__info__description"] a');
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await context.evaluate(() => {
      function addHiddenDiv(key, value) {


        const catElement = document.createElement('div');

        catElement.id = key;

        catElement.textContent = value;

        catElement.style.display = 'none';

        document.body.appendChild(catElement);

      }
      const rawdata = document.querySelectorAll('script[type="application/ld+json"]')[0].innerText;
      const abc = rawdata.replace(/(\r\n|\n|\r)/gm, "")
      // try {
      const jsondata = JSON.parse(abc);
      // const gtin = jsondata.gtin13;
      let availabilityText = jsondata.offers.availability;
      if (availabilityText == 'https://schema.org/InStock') {
        availabilityText = "In Stock"
      }
      if (availabilityText == 'https://schema.org/OutOfStock') {
        availabilityText = "Out of Stock"
      }
      // availabilityText=availabilityText.replace('\n',"")
      addHiddenDiv('availabilityText', availabilityText);
      const url = jsondata.url;
      const price = jsondata.offers.price;
      if (price.includes('p')) {
        addHiddenDiv('price', '0.' + price);
      }
      else {
        addHiddenDiv('price', price);
      }
      const aggregateRating = jsondata.review.reviewRating.ratingValue;
      const brand = jsondata.brand.name;
      addHiddenDiv('url', url,);

      addHiddenDiv('aggregateRating', aggregateRating);
      addHiddenDiv('brandText', brand);
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
      var listprice = getAllXpath('//div[@class="pd__cost__total undefined"]/text()|//div[@class="pd__cost__total--promo undefined"]/text()', 'nodeValue');
      if (listprice[0].includes('p')) {
        addHiddenDiv('listprice', '0.' + listprice);
      }
      else {
        addHiddenDiv('listprice', listprice);
      }
      var promotions = getXpath('//a[@class="promotion-message__link"]/text()', 'nodeValue');
        // var res = "";
        if (promotions != null) {
          var res = promotions.split(':');
          res=res[1]
          addHiddenDiv('res', res);
        }
        else{}

      var servingsize = getAllXpath('//table[@class="nutritionTable"]/thead/tr/th/text()', 'nodeValue');
      for(let i=0;i<servingsize.length;i++){
        if(servingsize[i].length>1){
          addHiddenDiv('servingsize', servingsize[i]);
          break;
        }

      }  

    });
    await context.extract(productDetails);
  },
};