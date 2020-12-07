// @ts-nocheck
const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
 
  await context.evaluate(async function () {
    const url = window.location.href;
 
    function addElementToDocumentOld (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      // catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
      return catElement;
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

    const priceXpath = getAllXpath("//*[contains(@id,'ProductInfoPrice_')]/@value",'nodeValue').join('|');
    console.log("price: ", priceXpath);
    const priceArr = priceXpath.split('|');
    console.log('Price Array =>',priceArr);
    console.log('Price Array Length =>',priceArr.length);
    if(priceArr.length > 0){
      for (var i = 0; i < priceArr.length; i++) {
        var str = priceArr[i].replace(',','.');
        console.log('Str =>',str);
        addElementToDocumentOld('price_added', str);
      }
    }
    
    //for loop 
   /* for (var i = 0; i < imageLength; i++) {

      const idObj = JSON.stringify(thumbNailTextValue[i]);
      var str = "http:";
      const imagePath = str.concat(idObj);
      addElementToDocumentOld('image_added', (imagePath.replace('"','')).replace('"',''));

      const path1 = (idXpathValue[i].split('-'))[1];
      addElementToDocumentOld('id_added', path1);

      const urlObj = JSON.stringify(urlValue[i]);
      var str = "https://www.bjs.com";
      const urlPath = str.concat(urlObj);
      const aPath = (urlPath.replace('"','')).replace('"','');
      addElementToDocumentOld('url_added', aPath);

      const nameObj = JSON.stringify(nameValue[i]);
      addElementToDocumentOld('name_added', (nameObj.replace('"','')).replace('"',''));

      const priceObj = JSON.stringify(priceValue[i]);
      addElementToDocumentOld('price_added', priceObj);

      const reviewObj = JSON.stringify(reviewValue[i]);
      addElementToDocumentOld('review_added', reviewObj);

      const aggrigateObj = JSON.stringify(aggValue[i]);
      addElementToDocumentOld('agg_rating_added', (aggrigateObj.replace('"','')).replace('"',''));
    }*/
  });
  return await context.extract(productDetails, { transform });
}
 
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    transform: transform,
    domain: 'coppel.com',
    zipcode: '',
  },
  implementation,
};