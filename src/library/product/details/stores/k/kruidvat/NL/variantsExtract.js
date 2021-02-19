
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: null,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
    
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var URL=''
      var upc1 = getXpath('(//e2-variant-select/@options)').value;
      var jsondata = JSON.parse(upc1);
      for (var i = 0; i < jsondata.length; i++) {
        URL='https://www.kruidvat.nl'+jsondata[i].value
        // xyz.push(URL)
        addElementToDocument('variant_url', URL);

      }
      // var variant_url=xyz.join(' | ')

      
  
    });

    await context.extract(productDetails);

  },

};
