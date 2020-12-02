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

    //aggrigate rating by Narasimha
    const ratings = document.querySelectorAll('.prod-rating');
    Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('span.star');
        let ratingVal = 0;
        
        [...stars].forEach(star => {
            if (star.getAttribute('class').includes('on')) ++ratingVal;
            if (star.getAttribute('class').includes('half')) ratingVal += 0.5;
        });
        rating.setAttribute('rating', ratingVal);        
    })
 
    const idXpath = getAllXpath("//div[@class='each-section']/a/@id",'nodeValue').join('|');
    var idXpathValue = idXpath.split('|');
    var idpath1 = (idXpathValue[0].split('-'))[1];

    const imageXpath = getAllXpath("//div[@class='products-list']//div[@class='product']//div[@class='flex-item-container']//div[@class='each-section']/a/img/@src",'nodeValue').join('|');
    var thumbNailTextValue = imageXpath.split('|');
    var imageLength = thumbNailTextValue.length;
    
    const urlXpath = getAllXpath("//div[@id='contentOverlay']/div/app-search-main/app-search-result-page-gb/div/div/div/app-products-container/div/div/div/app-product-card/div/div/div[@class='flex-item-container']/div[1]/a/@href",'nodeValue').join('|');
    var urlValue = urlXpath.split('|');

    const nameXpath = getAllXpath("//div[@_ngcontent-bjs-universal-app-c92='']/a//h2[@class='product-title no-select d-none d-sm-block']/text()",'nodeValue').join('|');
    var nameValue = nameXpath.split('|');

    const priceXpath = getAllXpath("//span[@class='price']/text()",'nodeValue').join('|');
    var priceValue = priceXpath.split('|');

    const reviewXpath = getAllXpath("//span[@class='reviews-count no-select']/text()",'nodeValue').join('|');
    var reviewValue = reviewXpath.split('|');

    const aggXpath = getAllXpath("//div[@class='prod-rating']/@rating",'nodeValue').join('|');
    var aggValue = aggXpath.split('|');

    //for loop 
    for (var i = 0; i < imageLength; i++) {

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
    }
  });
  return await context.extract(productDetails, { transform });
}
 
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'bjs',
    transform: transform,
    domain: 'bjs.com',
    zipcode: '',
  },
  implementation,
};