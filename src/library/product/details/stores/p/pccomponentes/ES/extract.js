const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'pccomponentes',
    transform: transform,
    domain: 'pccomponentes.com',
    zipcode: '',
  }, implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    //goto to the product page.
    const isProdPage = await context.evaluate(async function() {
      if(document.querySelector('div.articulo h1')) {
        return true;
      } else {
        return false;
      }
    })
    const prodUrlLink = await context.evaluate(async function() {
      const urlSelector = 'div[class*=product-card__content] h3 a';
      const prodNode = document.querySelector(urlSelector);
      if(prodNode && prodNode.hasAttribute('href')) {
        return `https://www.pccomponentes.com${prodNode.getAttribute('href')}`;
      } else {
        console.log("NO PRODUCT FOUND");
        return "";
      }
    });
    if(prodUrlLink && !isProdPage) {
      console.log('productLink we are going to - ' + prodUrlLink);
      await context.goto(prodUrlLink, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    }

    try {

      await context.click('div[class*="demoup-playbutton-wrapper"] div[title*="Play video"] div[class*="demoupUI-playimage"], div[class*="demoup-product-description-wrapper"] div[title*="Play video"] div[class*="demoupUI-playimage"]');
      await context.waitForSelector('div[class*="demoupUI-playlist-slider"]');

      await context.evaluate(async function() {
        let allVideosLinkList = [];
        allVideosLinkList = document.querySelectorAll('div[class*="demoupUI-playlist-slider"] div[class*="demoupUI-item"] img');
        let allUrls = [];
        if(allVideosLinkList.length > 0) {
          for(let index = 0; index < allVideosLinkList.length; index++) {
            if (allVideosLinkList[index].hasAttribute('src')) {
              let thisUrl = allVideosLinkList[index].src.split('-')[0];
              thisUrl += '.mp4';
              allUrls.push(thisUrl);
              console.log(thisUrl);
            } else {
              console.log('no src for - ' + index + 'th element');
            }
            document.getElementsByTagName('body')[0].setAttribute(`allvideos`, allUrls.join(' | '));
          }
        } else {
          console.log('we do not have the list of videos');
        }
      });
    } catch (e) {
      console.log(e.message);
      console.log('the div we are looking to click - may not be present');
    }
    
    


    return await context.extract(productDetails, { transform: transformParam });
  }
};
