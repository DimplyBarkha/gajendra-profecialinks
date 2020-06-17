
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'flaconi',
    transform: null,
    domain: 'flaconi.de',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addVideoElementToDocument (key, arr) {
        const catElement = document.createElement('div');
        catElement.id = key;
        for (let i = 0; i < arr.length; i++) {
          const videoElement = document.createElement('a');
          videoElement.href = arr[i].href;
          catElement.appendChild(videoElement);
        }
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const directionelement1 = document.evaluate("//div[contains(@class, 'instruction-content')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const directionelement2 = document.evaluate("//div[contains(@class, 'instruction')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const bulletInfo = document.evaluate("//ul[@class='product-properties-list']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (directionelement1) {
        const decriptionContent = bulletInfo ? `${directionelement1.innerText} ${bulletInfo.innerText}` : directionelement1.innerText;
        addElementToDocument('fl_directioninfo', decriptionContent);
      } else if (directionelement2) {
        const decriptionContent = bulletInfo ? `${directionelement2.innerText} ${bulletInfo.innerText}` : directionelement2.innerText;
        addElementToDocument('fl_directioninfo', decriptionContent);
      }

      const colorlement = document.evaluate("//ul[@id='makeup-color-list']/li[1]//span/@style", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (colorlement && colorlement.value.indexOf('background-color') > -1) {
        const colorCode = colorlement.value.slice(colorlement.value.indexOf('#') + 1);
        addElementToDocument('fl_colorcode', colorCode);
      }
      const videoarr = document.querySelectorAll('div.lazyYoutube > a[title=""]');
      if (videoarr && videoarr.length) {
        addVideoElementToDocument('pd_video', videoarr);
      }
      const brandElement = document.querySelector('h1 a.brand') ? (document.querySelector('h1 a.brand').innerText).trim() : '';
      const nameElement = document.querySelector('h1 span.series') ? (document.querySelector('h1 span.series').innerText).trim() : '';
      const describeElement = document.querySelector('h1 span.gender') ? (document.querySelector('h1 span.gender').innerText).trim() : '';
      const str = brandElement + ' ' + nameElement + ' ' + describeElement;
      addElementToDocument('fl_imageAlt', `${brandElement} ${nameElement} ${describeElement}`);
      addElementToDocument('fl_extended', `${brandElement} Start ${describeElement}`);
      addElementToDocument('fl_name', `${nameElement} ${describeElement}`);
      const listPriceElement = document.evaluate("//ul[contains(@class,'product-list')]/li[contains(@class,'selected')or contains(@class,'visible')]//div[@class='price-box']/span[@class='old-price']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (listPriceElement && listPriceElement.innerText) {
        const replaceChars = { '.': ',', ',': '.' };
        const priceData = (listPriceElement.innerText).replace(/[./,]/g, function (match) { return replaceChars[match]; });
        addElementToDocument('fl_listPrice', priceData);
      }
    });
    await context.extract(productDetails);
  },
};
