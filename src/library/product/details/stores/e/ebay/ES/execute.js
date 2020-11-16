
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    domain: 'ebay.es',
    loadedSelector: 'div#CenterPanelInternal',
    noResultsXPath: '//p[contains(text(),"We looked everywhere")]',
    zipcode: '',
  },
  // implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {

  //   const iframeUrl = await context.evaluate(async function () {
  //     if (document.querySelector('iframe[id="desc_ifr"]')) {
  //       await context.waitForSelector('iframe[id="desc_ifr"]', { timeout: 5000 });
  //       return document.querySelector('iframe[id="desc_ifr"]').getAttribute('src');
  //     }
  //   });

  //   const URL = await context.evaluate(async function () {
  //     return window.location.href;
  //   });

  //   await context.goto(iframeUrl);

  //   await context.evaluate(async function () {
  //     let xpath = '//label[@class="video"]/@data-title';
  //     let video = document.evaluate(xpath, document).iterateNext().textContent;

  //     // Going back to product Page
  //     await context.goto(URL);

  //     // function to append the elements to DOM
  //     function addElementToDocument(key, value) {
  //       const catElement = document.createElement('div');
  //       catElement.id = key;
  //       catElement.textContent = value;
  //       catElement.style.display = 'none';
  //       document.body.appendChild(catElement);
  //     }

  //     addElementToDocument('videoUrl', video);
  //   });

  //   await context.extract(productDetails);
  // }

};
