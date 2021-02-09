
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'lancome_ebt',
    transform: null,
    domain: 'lancome.com.au',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  await context.evaluate(async function () {
    // Add Element 
    function addElementToDocument(key, value) {
      const catElement = document.createElement('div');
      catElement.className = key;
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

    // Method to Retrieve Xpath content of a Multiple Nodes

    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };

    // Variant Ids

    // Variant Urls for shade and size
    var vurls = [];
    var varShade = getAllXpath('//div[contains(@class,"product-variation-shade__item")]/a/@href', 'nodeValue');
    var varSize = getAllXpath('//div[contains(@class,"product-variation-size__item")]/@value', 'nodeValue');
    var vcdid = getAllXpath('//div[contains(@class,"product-variation-shade__item")]/a/@data-id', 'nodeValue');
    var vsdid = getXpath('//input[@id="product_selectedsize"]/@value', 'nodeValue');
    var pgurl = getXpath('//meta[@property="og:url"]/@content', 'nodeValue');

    if (varShade.length > 1) {
      for (var i = 0; i < varShade.length; i++) {
        if (varShade[i].match(/(.+=$)/gm) != null) {
          vurls.push((varShade[i] + vcdid[i]));
        } else {
          vurls.push(varShade[i]);
        }
      }
      for (var i = 0; i < vurls.length; i++) {
        addElementToDocument('vurls', vurls[i]);
      }

    } else if (varSize.length > 1) {
      for (var i = 0; i < varSize.length; i++) {
        if (varSize[i].match(/(.+=$)/gm) != null) {
          vurls.push((varSize[i] + vsdid));
        } else {
          vurls.push(varSize[i]);
        }
      }
      for (var i = 0; i < vurls.length; i++) {
        addElementToDocument('vurls', vurls[i]);
      }
    } else if (varSize.length == 1 || varShade.length == 1) {
      addElementToDocument('vurls', pgurl);
    }
  });
  return await context.extract(variants, { transform });
}
