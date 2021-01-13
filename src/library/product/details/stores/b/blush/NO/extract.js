const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'blush',
    transform: cleanUp,
    domain: 'blush.no',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform }, context, { productDetails }) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    await context.evaluate(async function () {
      const cookies = document.querySelector('div.cookie-consent-popup button');
      if (cookies) cookies.click();
    });
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      /** Function used to extract all paragraph's text between two given titles.
     * If no 'startTitle' provided, it starts adding from the beginning.
     * If no 'stopTitle' provided, it doesn't stop and adds everything to the end
     * @param {object} node Parent node of all elements we want to iterate over
     * @param {Array} startTitle List of paragraph's textContent that once we meet we start adding following paragraph's text
     * @param {Array} stopTitleArray Lisf of paragraph's textContent that once we meet we stop adding following paragraph's text
     */

      const addFollowingParagraphs = (key, node, startTitle, stopTitleArray) => {
        const elements = document.createElement('div');
        elements.id = key;
        let reading;
        const allElements = node.childNodes;
        for (let i = 0; i < allElements.length; i++) {
          const element = allElements[i];
          if (!startTitle || startTitle.some((startTitleElem) => element.textContent.toLowerCase().trim() === startTitleElem.toLowerCase())) reading = true;
          if (stopTitleArray && stopTitleArray.length && stopTitleArray.some((stopTitleElem) => element.textContent.toLowerCase().trim() === stopTitleElem.toLowerCase())) break;
          if (reading) {
            elements.appendChild(element.cloneNode(true));
          }
        }
        document.body.appendChild(elements);
      };

      const productTitle = document.querySelector('h1[itemprop="name"] span') ? document.querySelector('h1[itemprop="name"] span').textContent : '';
      const productSubtitle = document.querySelector('h2[itemprop="description"] span') ? document.querySelector('h2[itemprop="description"] span').textContent : '';
      addElementToDocument('productName', `${productTitle} ${productSubtitle}`);

      const listPrice = document.querySelector('div.product-price-before') ? document.querySelector('div.product-price-before').textContent.replace(/[^\d,.]+/g, '') : '';
      const buyBtnObj = document.querySelector('div.buy-button') ? document.querySelector('div.buy-button').getAttribute('data-initobject') : '';
      const onlinePrice = buyBtnObj && JSON.parse(buyBtnObj) ? JSON.parse(buyBtnObj).priceFormatted : '';
      const currency = buyBtnObj && JSON.parse(buyBtnObj) ? JSON.parse(buyBtnObj).currency : '';
      addElementToDocument('onlineprice', `${onlinePrice} ${currency}`);
      if (listPrice) addElementToDocument('listprice', `${listPrice} ${currency}`);

      const aggRating = document.querySelector('div.product-main-info__body span.rating-stars') ? document.querySelector('div.product-main-info__body span.rating-stars').getAttribute('title').replace(/(\d+)\.?,?(\d+)?.+/g, '$1,$2') : '';
      addElementToDocument('aggRating', aggRating);

      const descriptionElement = document.querySelector('div.product-section-content div.product-responsive-info div.col-xs-12');
      const useTextArray = ['Anbefalt bruk:', 'Bruk', 'Anbefalt bruk', 'Bruk:'];

      if (descriptionElement) addFollowingParagraphs('descriptionid', descriptionElement, null, useTextArray);

      const description = document.querySelector('div#descriptionid') ? document.querySelector('div#descriptionid').textContent.replace(/\s{2,}|\n{2,}|\t/g, ' ') : '';
      addElementToDocument('descId', description);

      const sku = document.querySelector('meta[property="og:url"]') ? document.querySelector('meta[property="og:url"]').getAttribute('content') : '';
      addElementToDocument('sku', sku.replace(/.*product\/([^/]+).*/g, '$1'));

      let stepstext;
      if (descriptionElement) addFollowingParagraphs('usageid', descriptionElement, useTextArray, null);
      const stepsPionts = document.evaluate('//div[@id="usageid"]//ul', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const wholeStepsElem = document.querySelector('div#usageid');
      if (stepsPionts) stepstext = stepsPionts.textContent;
      else if (!stepsPionts && wholeStepsElem) {
        stepstext = wholeStepsElem.textContent.replace(/(.*:)?(.+)/, '$2');
      } else stepstext = '';

      const clarinsXpath = document.evaluate('//div[@class="product-section-content"]//*[contains(text(),"Clarins kroppspleie:")]/../following-sibling::em', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const care = clarinsXpath && stepsPionts ? clarinsXpath.textContent : '';
      const tipsXpath = document.evaluate('//div[@class="product-section-content"]//*[contains(text(),"Dette bør du gjøre")]/../following-sibling::ul', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const tips = tipsXpath ? tipsXpath.textContent : '';
      const directions = `${stepstext} ${tips} ${care}`;
      addElementToDocument('directions', directions.trim());
    });
    await context.extract(productDetails, { transform });
  },
};
