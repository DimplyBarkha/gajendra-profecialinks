const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'shopmylocal',
    transform,
    domain: 'shopmylocal.com.au',
    zipcode: '2075',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    console.log('we are in extract.js - customised');
    let mainUrl = "https://www.shopmylocal.com.au/api/int/s?query={searchTerms}&search_distance=10&published_to=marketplace&location_slug=St-Ives&region_name=New+South+Wales";
    let destinationUrl = '';
    try {
      console.log('input keywords are - ' + inputs.keywords);
      let keywords = inputs.keywords;
      keywords = keywords.replace(' ', '+');
      destinationUrl = mainUrl.replace('{searchTerms}', keywords);
      console.log(destinationUrl);
    } catch(err) {
      console.log('got some error - ', err.message);
    }
    // get the data from the api - 

    // let allProds = 
    await context.evaluate(async (destinationUrl) => {
      async function addDivWithHiddenInfo (prodNode, index) {
        let thisProd = document.createElement('div');
        thisProd.setAttribute('id', `prod-${index + 1}`);

        try {
          let priceXpath = './/div[contains(@class,"AdvertTile-price")]//*[contains(@class,"Price")][1]';
          let price = document.evaluate(priceXpath, prodNode, null, 7, null);
          let priceText = price.snapshotItem(0).textContent.trim();
          console.log('price is - ' + priceText);
          thisProd.setAttribute('price', priceText);

          let prodUrlXpath = './/a[contains(@class,"AdvertTile-title")]/@href';
          let prodUrl = document.evaluate(prodUrlXpath, prodNode, null, 7, null);
          let prodUrlText = 'https://www.shopmylocal.com.au' + prodUrl.snapshotItem(0).textContent.trim();
          console.log('url is - ' + prodUrlText);
          thisProd.setAttribute('produrl', prodUrlText);

          let prodNameXpath = './/a[contains(@class,"AdvertTile-title")]/text()';
          let prodName = document.evaluate(prodNameXpath, prodNode, null, 7, null);
          let prodNameText = prodName.snapshotItem(0).textContent.trim();
          console.log('name is - ' + prodNameText);
          thisProd.setAttribute('prodName', prodNameText); 
          
          let prodImageXpath = './/div[contains(@class,"AdvertTile-imageBox")]/@style';
          let prodImage = document.evaluate(prodImageXpath, prodNode, null, 7, null);
          let prodImageUrl = prodImage.snapshotItem(0).textContent.trim();
          console.log('prod image is - ' + prodImageUrl);
          thisProd.setAttribute('prodImage', prodImageUrl);

          let prodBrandXpath = './/div[contains(@class,"AdvertTile-seller")]//a/text()';
          let prodBrand = document.evaluate(prodBrandXpath, prodNode, null, 7, null);
          let prodBrandText = prodBrand.snapshotItem(0).textContent.trim();
          console.log('prod brand is - ' + prodBrandText);
          thisProd.setAttribute('prodBrand', prodBrandText);
        } catch(err) {
          console.log('got some error while extracting - ', err.message);
        }

        document.getElementsByTagName('body')[0].appendChild(thisProd);
      }
      let response = await await fetch(destinationUrl, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7,bn;q=0.6",
          "dpr": "1",
          "sec-ch-ua": "\"Google Chrome\";v=\"87\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"87\"",
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "viewport-width": "1440"
        },
        "referrer": "https://www.shopmylocal.com.au/s?query=red+wine",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

      let respJson = await response.json();
      let html = '';
      let doc = {};
      let allPordsElms = {};
      let eachProdXpath = '(//div[contains(@class,"AdvertTilesContainer")]//div[contains(@class,"AdvertTile advert")])[position() < 151]';
      if(respJson.hasOwnProperty('results_html')) {
        html = respJson.results_html;
        let parser = new DOMParser();
        doc = parser.parseFromString(html, "text/html");
        allPordsElms = document.evaluate(eachProdXpath, doc, null, 7, null);
        console.log(allPordsElms.snapshotLength + ' - results are retrieved');
      } else {
        console.log('not sure if this api has the html anymore !! not sure how to redirect to st-ives, NSW');
        
      }

      let allProductsArr = [];
      
      for(let i = 0; i < allPordsElms.snapshotLength; i++) {
        allProductsArr.push(allPordsElms.snapshotItem(i));
        await addDivWithHiddenInfo(allPordsElms.snapshotItem(i), i);
      }
      // return allProductsArr;
      
      
    }, destinationUrl);

    
    return await context.extract(productDetails, { transform });
  },
};
