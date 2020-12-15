const {cleanUp} = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    transform: cleanUp,
    domain: 'kolonial.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
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
      const size = getXpath('//span[@class="name-extra"]//text()','nodeValue');
      var size1=size.split(",")
      addElementToDocument('size',size1[size1.length-1]);
      const price2 = getXpath('//div[@class="unit-price"]//text()','nodeValue');
     var priceing= price2.split(" ");
     addElementToDocument('priceperunit',priceing[0]+" "+priceing[1]);
     var a=[];
      for(let i=2;i<priceing.length;i++)
      {
        a.push(priceing[i])
        a.join(" ")
        
      }
      addElementToDocument('priceperunitUom',a)
      const stock= getXpath('//link[@itemprop="availability"]/@href','nodeValue');
      var stocksize=stock.split("/");
      for(let i=0;i<stocksize.length;i++)
      {
        if(stocksize[i]=="InStock")
        {
          addElementToDocument('stock',"In Stock")
        }
      }
      const shippinginfo= getXpath('(//th[contains(text(),"Informasjon")])//following::td[1]//span//following::text()[1]','nodeValue');
      addElementToDocument('shippinginfo',shippinginfo)
    });
    await context.extract(productDetails, { transform: transformParam });
  }
};
