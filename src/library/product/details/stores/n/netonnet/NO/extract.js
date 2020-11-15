const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    transform, // middle ware for processing data
    domain: 'netonnet.no',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    await context.evaluate(async function () {

      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      const iframeDoc = document.querySelector('iframe.videoly-box') && document.querySelector('iframe.videoly-box').contentWindow;
      if (iframeDoc && iframeDoc.document && iframeDoc.document.body && iframeDoc.document.body.innerHTML) {
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(iframeDoc.document.body.innerHTML, 'text/html');
        const videoElements = htmlDoc.querySelectorAll('div.b-video-cover');
        videoElements && videoElements.forEach(item => {
          let vidURL = item.getAttribute('style').replace(/(.*) url((.*)\/vi\/(.*)\/(.+))/g, 'https://www.youtube.com/watch?v=$4')
          addElementToDocument('videoUrls', vidURL);
        });
      }


      const overlay = document.getElementById('headingOne');
      if (overlay !== undefined) {
        overlay.click();
      }

      const collapseFive = document.querySelector('div[data-target="#collapseFive"]')
      collapseFive.classList.remove("collapsed");
      document.getElementById('collapseFive').classList.add('in');

    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
};