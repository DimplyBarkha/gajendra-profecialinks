const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'technopark',
    transform: transform,
    domain: 'technopark.ru',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, store, transform: transformParam }, context, dependencies) => {
    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let videoNodes = [...document.querySelectorAll(".product-gallery-video")];
      let videosList = [];
      videoNodes.forEach((element) => {
        let video = element.hasAttribute("data-video-id") ? `https://www.youtube.com/embed/${element.getAttribute("data-video-id")}` : '';
        if(video && (videosList.indexOf(video) === -1)) videosList.push(video);
      });
      videosList.forEach(e => addHiddenDiv('productVideo', e));
    }

    try {
      await context.waitForSelector('.product-gallery-video');
    } catch (e) {
      console.log("No product video in the product image carousel");
    };

    await context.evaluate(addUrl);
    return await context.extract(dependencies.productDetails, { transform: transformParam });
  },
};
