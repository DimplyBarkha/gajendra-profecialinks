
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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      //  // Single Pipe Concatenation
      //  const pipeSeparatorSingle = (id, data) => {
      //   var singleSeparatorText = data.join(' | ');
      //   addElementToDocument(id, singleSeparatorText);
      // };
       // Double Pipe Concatenation
       const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
       };
       const pipeSeparator = (data) => {
        var doubleSeparatorText = data.join(' || ');
        return ' ||'+ doubleSeparatorText;
        };
      // var variant = getAllXpath('//div[@class="productdesc-content"]//text()', 'nodeValue');
      // var final = "";
      // if (variant.length >= 1) {
      //   for (var i = 0; i < variant.length; i++) {
      //     final = final + variant[i];
      //   }
      // }
      // var promotion = getXpath('//h2[@class="lead-small"]/text()', 'nodeValue');
      // if(promotion != null){
      //   // @ts-ignore
      //   pipeSeparatorSingle('promotion', singleSeparatorText);
      //   final = promotion + final;
      //   }
      //   if( final.length >= 1){
      //     addElementToDocument('final', final)
      //     }
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
          b = b + " kr."
          // var c = price.concat(" kr.")
          // b = c;
          // @ts-ignore
          addElementToDocument('price', b)
          // let onlinePrice = price.concat(" kr,")
          // addElementToDocument('price', onlinePrice)
        }
      }
      catch (error) {
      }
      var descFinal = "";
      try {
        // @ts-ignore
        var promotion = getXpath('//h2[@class="lead-small"]/text()', 'nodeValue');
        descFinal += promotion;
        // descFinal += pipeSeparator(promotion);
      } catch (error) {

      }
      try {
        var variant = getAllXpath('//div[@class="productdesc-content"]//h3/text()|//div[@class="productdesc-content"]//p/text()', 'nodeValue');
        descFinal += pipeSeparator(variant);
        descFinal += variant;
      } catch (error) {

      }
      try {
        const belowLI = getAllXpath('(//ul)[10]/li/text()', 'nodeValue');
        descFinal += pipeSeparator(belowLI);
      } catch (error) {

      }
      addElementToDocument('final', descFinal)
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
