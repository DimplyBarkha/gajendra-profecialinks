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

    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };

    //aggrigate rating by Narasimha
    const ratings = document.querySelectorAll('.prod-rating');
    if(ratings){
      Array.from(ratings).forEach(rating => {
        const stars = rating.querySelectorAll('span.star');
        let ratingVal = 0;
        
        [...stars].forEach(star => {
            if (star.getAttribute('class').includes('on')) ++ratingVal;
            if (star.getAttribute('class').includes('half')) ratingVal += 0.5;
        });
        rating.setAttribute('rating', ratingVal);        
    })
    }
    
    const idXpath = getAllXpath("//div[@class='each-section']/a/@id",'nodeValue').join('|');
    var idXpathValue = idXpath.split('|');
    var idpath1 = (idXpathValue[0].split('-'))[1];
    console.log("idpath1:::",idpath1);

    const imageXpath = getAllXpath("//div[@class='products-list']//div[@class='product']//div[@class='flex-item-container']//div[@class='each-section']/a/img/@src",'nodeValue').join('|');
    var thumbNailTextValue = imageXpath.split('|');
    var imageLength = thumbNailTextValue.length;
    
    const urlXpath = getAllXpath("//div[@id='contentOverlay']/div/app-search-main/app-search-result-page-gb/div/div/div/app-products-container/div/div/div/app-product-card/div/div/div[@class='flex-item-container']/div[1]/a/@href",'nodeValue').join('|');
    var urlValue = urlXpath.split('|');

    // const nameXpath = getAllXpath("//div[@_ngcontent-bjs-universal-app-c92='']/a//h2[@class='product-title no-select d-none d-sm-block']/text()",'nodeValue').join('|');
    // var nameValue = nameXpath.split('|');

    // const namePath = getAllXpath("//div[@_ngcontent-bjs-universal-app-c92='']/a//h2[@class='product-title no-select d-none']/text()",'nodeValue').join('|');
    // //console.log("namePath::::", namePath.split('|') );
    // var namePValue = namePath.split('|');


    const nameXpath = getAllXpath("//*[@id='contentOverlay']/div/app-search-main/app-search-result-page-gb/div/div/div/app-products-container/div/div/div/app-product-card/div/div/div/div/a/h2[1]/text()",'nodeValue').join('|');
    var nameValue = nameXpath.split('|');

    const priceXpath = getAllXpath("//span[@class='price']/text()",'nodeValue').join('|');
    var priceValue = priceXpath.split('|');

    //const reviewXpath = getAllXpath("//span[@class='reviews-count no-select']/text()",'nodeValue').join('|');
    // const reviewXpath = getXpath("//*[@id='contentOverlay']/div/app-search-main/app-search-result-page-gb/div[2]/div[2]/div[2]/app-products-container/div/div/div/app-product-card/div/div/div/div/div/div/span[6]/text()",'nodeValue');
    // var reviewValue = reviewXpath;

    const reviewXpath = getAllXpath("//div//div[@class='prod-rating']/div/span[6]/text()",'nodeValue');
    var reviewValue = reviewXpath;
    console.log("reviewValue::::", reviewValue);

    const aggXpath = getAllXpath("//div[@class='prod-rating']/@rating",'nodeValue').join('|');
    //console.log("aggXpath:::", aggXpath);
    var aggValue = aggXpath.split('|');

    for(var i = 0; i < imageLength; i++) {

      const idObj = JSON.stringify(thumbNailTextValue[i]);
      var str = "http:";
      const imagePath = str.concat(idObj);
      addElementToDocumentOld('image_added', (imagePath.replace('"','')).replace('"',''));

      //console.log("idObj::", (idObj.split('/')[6].split('?'))[0]);

      //const path1 = (idXpathValue[i].split('-'))[1];
      addElementToDocumentOld('id_added', (idObj.split('/')[6].split('?'))[0]);

      const urlObj = JSON.stringify(urlValue[i]);
      var str = "https://www.bjs.com";
      const urlPath = str.concat(urlObj);
      const aPath = (urlPath.replace('"','')).replace('"','');
      addElementToDocumentOld('url_added', aPath);

    //   const nameObj1 = JSON.stringify(namePValue[i]);
    //  console.log("nameObj1:::", nameObj1);

      const nameObj = JSON.stringify(nameValue[i]);
      //console.log("nameObj2:::", nameObj);

      // if(nameObj1 != null){
      //   addElementToDocumentOld('name_added', (nameObj1.replace('"','')).replace('"',''));
      // }else{
      //   addElementToDocumentOld('name_added', (nameObj2.replace('"','')).replace('"',''));
      // }
      addElementToDocumentOld('name_added', (nameObj.replace('"','')).replace('"',''));

      const priceObj = JSON.stringify(priceValue[i]);
      addElementToDocumentOld('price_added', priceObj);

      //var j = i+1;
      //const reviewXpath = getXpath("//*[@id='contentOverlay']/div/app-search-main/app-search-result-page-gb/div[2]/div[2]/div[2]/app-products-container/div/div/div["+j+"]/app-product-card/div/div/div[2]/div[2]/div[1]/div/span[6]/text()",'nodeValue');
      // const reviewXpath = getXpath("//div//div[@class='prod-rating']/div/span[6]/text()",'nodeValue');
      // var reviewValue = reviewXpath;


      console.log("reviewRating:::::"+i+"-"+reviewValue);
      //const reviewObj = JSON.stringify(reviewValue[i]);
      addElementToDocumentOld('review_added', reviewValue);
      
    
      const aggrigateObj = JSON.stringify(aggValue[i]);
      //addElementToDocumentOld('agg_rating_added', ((aggrigateObj.replace('"','')).replace('"','').replace('.',',')));
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