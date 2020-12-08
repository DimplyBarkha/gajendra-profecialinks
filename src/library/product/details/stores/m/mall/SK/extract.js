
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SK',
    store: 'mall',
    transform: null,
    domain: 'mall.sk',
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
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
      };
      var name = getXpath('//span[@class="rating-percent"]/text()', 'nodeValue');
      if(name!=null){
        var agr = name.slice(0, -2);
        agr = (agr*5)/100;
        addElementToDocument('agr', agr);
      }
      var agg = getXpath('(//div[@class="pdrt__subtitle-info"]/a/img)[1]/@alt', 'nodeValue');
      if(agg != null){
        addElementToDocument('agg', agg);
      } else{
        agg = getXpath('//article[@itemscope="itemscope"]/h1[@itemprop="name"]/text()', 'nodeValue');
        agg = agg.split(" ")[0];
        addElementToDocument('agg', agg);
      }
    });
    await context.extract(productDetails);
    },
    };