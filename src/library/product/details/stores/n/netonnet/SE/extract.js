const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SE',
    store: 'netonnet',
    transform,
    domain: 'netonnet.se',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {

    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
     await context.evaluate(async function () {
      const overlay = document.getElementById('headingOne');
      if (overlay !== undefined) {
        overlay.click();
      }
    });

    try {
      await context.waitForSelector('iframe[id^="quchbox-videolist"]', { timeout: 45000 });
    } catch (error) {
      console.log('No videos loading');
    }

    await context.evaluate(async function () {
      // document.body.setAttribute("ii_url", window.location.href);

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if (document.querySelector('iframe[id^="quchbox-videolist"]')) {
        const videosIds = [...document.querySelector('iframe[id^="quchbox-videolist"]').contentDocument.querySelectorAll('li')].map((video) => video.querySelector('div').getAttribute('data-videoid'));
        for (let i = 0; i < videosIds.length; i++) {
          videosIds[i] = `www.youtube.com/embed/${videosIds[i]}?rel=0`;
        }

        addHiddenDiv('ii_videos', videosIds.join(' || '));
      }
    });

    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  }
  
};
