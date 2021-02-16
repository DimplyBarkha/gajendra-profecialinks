const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'americanas',
    transform: cleanUp,
    domain: 'americanas.com.br',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDom (id, element) {
        const div = document.createElement('div');
        div.id = id;
        div.innerHTML = element;
        document.body.appendChild(div);
      }
      function getHTML (url, callback) {
        if (!window.XMLHttpRequest) return;
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (callback && typeof callback === 'function') {
            callback(this.responseXML);
          }
        };
        xhr.open('GET', url);
        xhr.responseType = 'document';
        xhr.send();
      }

      const productUrl = window.location.href;
      addElementToDom(productUrl, 'productUrl');

      const availabilityText = document.querySelector('a#buy-button') ? 'In Stock' : 'Out Of Stock';
      addElementToDom('availabilityText', availabilityText);

      const videoXp = '//script[contains(.,"video") and contains(.,"window.__APOLLO_STATE__")]';
      const jsonObj = document.evaluate(videoXp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const videoId = jsonObj && jsonObj.textContent.match(/"video":"[^,]+,/g) ? jsonObj.textContent.match(/"video":"[^,]+,/g)[0].replace(/"video":.*\\u002F/g, '').replace(/",/g, '') : '';
      if (videoId) addElementToDom('video', `http://www.youtube.com/embed/${videoId}`);

      const ratingXp = '//script[@type="application/ld+json"][contains(.,"ratingCount")]';
      const jsonRatingObj = document.evaluate(ratingXp, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const ratingValue = jsonRatingObj && jsonRatingObj.textContent.match(/(?<=ratingValue":")(\d*)\.?(\d{0,1})\d*(?=")/g) ? jsonRatingObj.textContent.match(/(?<=ratingValue":")(\d*)\.?(\d{0,3})\d*(?=")/g)[0] : '';
      if (ratingValue) {
        const roundedRatingValue = parseFloat(ratingValue).toFixed(1).toString().replace('.', ',');
        addElementToDom('ratingValue', roundedRatingValue);
      }
      const manufacturerDescriptionFrameLink = document.querySelector('#info-section iframe') ? document.querySelector('#info-section iframe').getAttribute('src') : '';
      let manufacturerImagesArr = [];
      if (manufacturerDescriptionFrameLink) {
        getHTML(manufacturerDescriptionFrameLink, function (response) {
          addElementToDom('', 'manufacturerSite');
          const manufacturerSiteDiv = document.querySelector('#manufacturerSite');
          manufacturerSiteDiv.innerHTML = response.querySelector('body').innerHTML;
          manufacturerImagesArr = Array.from(response.querySelectorAll('img')).map((item) => {
            return `${manufacturerDescriptionFrameLink}${item.getAttribute('src')}`.replace('index.html', '');
          });
        });
      }
      const manufacturerDescription = document.querySelector('#manufacturerSite') ? document.querySelector('#manufacturerSite').innerText : '';
      addElementToDom(manufacturerDescription, 'manufacturerDescription');
      setTimeout(() => {
        addElementToDom(manufacturerImagesArr, 'manufacturerImages');
      }, 500);

      const specifications = document.querySelectorAll("table[class^='src__SpecsCell'] td");
      const specificationsArr = [];
      for (let i = 0; i < specifications.length; i++) {
        if (specificationsArr[i]) specificationsArr.push(specificationsArr[i].textContent);
      };
      addElementToDom('specifications', specificationsArr.join(' '));
    });
    await context.extract(productDetails);
  },
};
