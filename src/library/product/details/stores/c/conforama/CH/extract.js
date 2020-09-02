const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    transform,
    domain: 'conforama.ch',
    zipcode: '',
  },
  implementation,
};

async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;

  await context.evaluate(async (parentInput) => {
    let descriptionTab  = document.querySelector('h2[id="description"]');
    // @ts-ignore
    descriptionTab = descriptionTab ? descriptionTab.click() : '';
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
     let description = document.querySelector("div[id='tabs-1']");
    // @ts-ignore
    description = description ? description.innerHTML : '';
    let descArr = [];
    // @ts-ignore
    if(description !== ''){
      // @ts-ignore
      description = description ? description.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/\n/gm, ' ').replace(/•/gm, ' ||').replace(/\s{2,}/, ' ').replace('Description du produit','').replace(/La marque vous parle/g,'').trim() : '';
    }
    addElementToDocument('description',description);
    function findJsonData (scriptSelector, startString, endString) {
       
      const xpath = `//script[contains(.,'${scriptSelector}')]`;
      let element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      // @ts-ignore
     let elementTxt = (element !== null) ? element.textContent : ''
      return elementTxt;
    };
    let brandJson = findJsonData ('"brand": {','{ "@context":','}');
    // @ts-ignore
    brandJson = brandJson ? JSON.parse(brandJson).brand : '';
    // @ts-ignore
    let brandText = brandJson ? brandJson.name : '';
    addElementToDocument('brandText',brandText);
    });
    return await context.extract(productDetails, { transform });
    }
