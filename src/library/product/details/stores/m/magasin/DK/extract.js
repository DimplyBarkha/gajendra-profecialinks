const { transform } = require('./transform')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DK',
    store: 'magasin',
    transform: transform,
    domain: 'magasin.dk',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {

    await context.waitForSelector('product-details', { timeout: 5000 });

    await context.evaluate(async function () {
      const productInfo = preFetchProductDetails();      
      let tempPrice=0;
      if(productInfo['offers'].price != null)
      {
        tempPrice = productInfo['offers'].price;
      }
      addEleToDoc('tempPriceCurrencyId', tempPrice + " " + productInfo['offers'].priceCurrency);
      addEleToDoc('tempSkuId', productInfo['sku']);
      const manuDescription = document.querySelector('.content-asset section') ? document.querySelector('.content-asset section').innerText : ""; 
      addEleToDoc("manuDesc", manuDescription)
      let video = document.evaluate('(//li//a[contains(@class,"product-carousel__thumb")]//img[contains(@data-src,"youtube")]//@data-src)[1]',document).iterateNext();
      if(video) {
        let youTubeUrl = video.textContent.replace(/(.+)(vi\/)(.+)(\/)(.+)/g, "https://www.youtube.com/watch?v=$3");
        addEleToDoc("videoUrl", youTubeUrl);
      }
      function preFetchProductDetails() {
        let productInfo = findProductDetails('//script[@type="application/ld+json" and contains(text(),"sku")]');
        productInfo = JSON.parse(productInfo.textContent);
        return productInfo;
      }

      function findProductDetails(xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const productDetails = element;
        return productDetails;
      }

      function addEleToDoc(key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
