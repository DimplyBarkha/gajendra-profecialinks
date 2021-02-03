
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    transform: null,
    domain: 'otto.de',
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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // @ts-ignore
      const URL = window.location.href
      try {
        var rpc = URL.split('/#variationId=')[1]
        addElementToDocument('rpcid', rpc)
      }
      catch (error) {

      }
      // const rpc=getXpath("//li[@class='p_selected ']/@data-variationid/text()", 'nodeValue');
      // if(rpc!=null){
      //   var rpcid=rpc
      //   addElementToDocument('rpcid', rpc)
      // }
      // else{
      //   const rpc2=getXpath("//div[@data-trigger='productDetailView']/@data-variationid/text()", 'nodeValue');
      //   var rpcid=rpc2
      //   addElementToDocument('rpcid', rpc2)
      // }

      const rawdata = getXpath("//div[@class='prd_price__main']/span/span[@id='reducedPriceAmount']/@content|//div[@class='prd_price__main']/span/span[@id='normalPriceAmount']/@content", 'nodeValue');
      if (rawdata != null) {
        var nr = rawdata//.replace('.', ',')
        var price = '€' + nr
        addElementToDocument('price', price);
      }
      // @ts-ignore
      const aa = document.querySelector('section[class="prd_section"] div[class*=\'prd_section\']').innerText
      if(aa!=null){
      // @ts-ignore
      var desc1=aa.replace('Artikelbeschreibung','')
        addElementToDocument('desc1', desc1);
      } 
      const rawjson = getXpath("//script[@id='productDataJson']/text()", 'nodeValue');
      
      var jsondata = JSON.parse(rawjson);
      var sku=jsondata.id;
      var a = jsondata.sortedVariationIds;
      
      var variants = a.join(' | ');
      addElementToDocument('sku', sku);
      addElementToDocument('variant', variants);
      addElementToDocument('cts', a.length);
      // var variant = getAllXpath("//div[@class='reco_cinema reco_productlineCinema']/div[@class='reco_cinema__container']/ul/li/@data-variation-id", 'nodeValue');
      // if (variant != null) {
      //   var ab = variant.join(' | ');
      //   addElementToDocument('variant', ab);
      // }
      //     // const perunit = getXpath("//span[@class='prd_price__normAmount']/text()", 'nodeValue');
      //     // if (perunit != null) {
      //     //   var npu = perunit.replace(',', '.')
      //     //   addElementToDocument('perunit', npu);
      //     // }
      const weight = getXpath("(//*[contains(text(),'Gewicht')]//parent::span//parent::td//parent::tr//td[2])[1]/text()", 'nodeValue');
      if (weight != null) {
        try {
          var nweight = weight.replace(',', '.')
          addElementToDocument('nweight', nweight);
        }
        catch (error) {
          addElementToDocument('nweight', weight)
        }
      }

    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
