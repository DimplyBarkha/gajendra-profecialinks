
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
      if (directionelement1) {
        addElementToDocument('fl_directioninfo', directionelement1.innerText);
      } else if (directionelement2) {
        addElementToDocument('fl_directioninfo', directionelement2.innerText);
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
    });
    await context.extract(productDetails);
  },
};
