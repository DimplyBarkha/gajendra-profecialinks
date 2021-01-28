
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'lomax',
    transform: null,
    domain: 'lomax.dk',
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
      const aggr = getXpath("//div[@class='container productcard']/@data-gtm-rating", 'nodeValue');
      try {
        if (aggr != null) {
          let str = aggr
          var a = str.replace('.', ',')
          addElementToDocument('aggr', a)
        }
      }
      catch (error) {
      }
      const price = getXpath('//meta[@property="product:pretax_price:amount"]/@content', 'nodeValue');
      // @ts-ignore
      try {
        if (price != null) {
          let str = price
          var b = str.replace('.', ',')
          var c = price.concat(" kr,")
          b = c;
          // @ts-ignore
          addElementToDocument('price', b)
          // let onlinePrice = price.concat(" kr,")
          // addElementToDocument('price', onlinePrice)
        }
      }
      catch (error) {
      }
      // let onlinePrice = price.concat(" kr,")
      // addElementToDocument('price', onlinePrice)
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
