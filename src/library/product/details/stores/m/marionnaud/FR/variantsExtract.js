
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    transform: null,
    domain: 'marionnaud.fr',
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

    function addElementToDocument (key, value) {
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

    


    var url = getAllXpath('//div[@id="productVariantDisplay"]/div/a/@href | //div[@id="buttonClickshow"]/ul/li/a/@href', 'nodeValue');
      for(var i=0; i<url.length; i++){
        url[i] = "https://www.marionnaud.fr"+url[i];
        addElementToDocument("url", url[i]);
      }


    });
    return await context.extract(variants, { transform });
  }