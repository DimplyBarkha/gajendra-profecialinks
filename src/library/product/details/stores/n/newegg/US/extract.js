const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    transform,
    domain: 'newegg.com',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      const video = document.querySelector('video.jw-video');
      if (video) {
        var url = '';
        video.click();
        url = video.getAttribute('src');
        if (url) {
          addHiddenDiv('video-url', url);
        }
      }
      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
    });
    await new Promise(resolve => setTimeout(resolve, 20000));
    await context.evaluate(async () => {
      let questtionCount = document.querySelector("#product-details > div.tab-navs > div:nth-child(4)");
      if (questtionCount) {
        questtionCount.click();
      }
    });
    await new Promise(resolve => setTimeout(resolve, 20000));
    await context.evaluate(async () => {
      let questtionCountValue = document.querySelector("#tt-qa-list > div.tt-c-questions__toolbar.tt-c-toolbar > div > span");
      if (questtionCountValue) {
        document.head.setAttribute('questioncount', questtionCountValue.textContent);
      }
    });

    return await context.extract(productDetails, { transform });
  },
};
