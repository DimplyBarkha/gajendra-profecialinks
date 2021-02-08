
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'AU',
    store: 'kiehls_ebt_au',
    transform: null,
    domain: 'kiehls.com.au',
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
    var getXpath = (xpath, prop) => {
      var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
      };
    
    //Variant URL
    var vurls =[];
    var pgurl= getXpath('//meta[@property="og:url"]/@content','nodeValue');
    var vId = getAllXpath('//div/ul/li/a/@data-variantid','nodeValue');
    vId = [...new Set(vId)];
    if(vId.length==1)
      addElementToDocument('vurls',pgurl);
    else
    {
    for(var i=0;i<vId.length;i++){
      //vurls.push(pgurl.replace(pgurl.match(/(\d+?).html/gm),vId[i]+".html"));
      addElementToDocument('vurls',pgurl.replace(pgurl.match(/(\w{2,})?\d{3,}.html/gm),vId[i]+'.html'));
    }
    };

  });
return await context.extract(variants, { transform });
}
