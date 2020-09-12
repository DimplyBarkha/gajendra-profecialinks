const { transform } = require('../transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'expert',
    transform: transform,
    domain: 'expert.de',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    let content = null;
    let image = null;
    let manufVideo = null;

    async function addHiddenInfo (elementID, content) {
      await context.evaluate(function (elementID, content) {
        const newDiv = document.createElement('div');
        newDiv.id = elementID;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }, elementID, content);
    }

    async function addHiddenArrayList (elementID, value) {
      await context.evaluate(function (elementID, value) {
        const htmlString = `<span style="display:none" id="added_${elementID}" ></span>`;
        const root = document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        document.querySelector(`#added_${elementID}`).innerHTML = innerHTML;
      }, elementID, value);
    }

    const link = await context.evaluate( function () {
      return window.location.href;
    });

    const apiManufCall = await context.evaluate( function () {
      return document.querySelector('iframe#loadbeeTabContent') ? document.querySelector('iframe#loadbeeTabContent').getAttribute('src') : null;
    });
    console.log('apiManufCall');
    console.log(apiManufCall);

    if (apiManufCall) {
      console.log(apiManufCall);
      await context.goto(apiManufCall,{ timeout: 100000,
        waitUntil: 'load',
      });
      // The code snippet below will be executed in the website's scope.
      await context.evaluate( function () {
        console.log(document.querySelector('h1.next-chapter'));
      });
      const text = await context.evaluate( function () {
        return document.querySelector('body').innerText;
      });
      content = text;
      const images = await context.evaluate(function () {
        const imagesElements = document.querySelectorAll('div.wrapper img[data-src]');
        const imagesSrc = [];
        [...imagesElements].forEach((element) => {
          if (element.getAttribute('data-src')) {
            imagesSrc.push(element.getAttribute('data-src').toString());
          }
        });
        return imagesSrc;
        // return imagesSrc.join(' || ');
      });
      image = images;

      const video = await context.evaluate(function () {
        const videosElements = document.querySelectorAll('div.wrapper div.play-btn');
        const videoSrc = [];
        [...videosElements].forEach((element) => {
          if (element.getAttribute('data-video')) {
            videoSrc.push(element.getAttribute('data-video').toString());
          }
        });
        const videosArr = Array.from(new Set(videoSrc));
        return videosArr.join(' || ');
      });
      manufVideo = video;
      await context.goto(link, {
        timeout: 50000,
        waitUntil: 'load',
      });

      addHiddenInfo('ii_manufContent', content);
      if (image) {
        console.log(image);
        addHiddenInfo('ii_manufContentImg', image.join(' || '));
        // addHiddenArrayList('ii_manufImg', image);
      }
      if (manufVideo) {
        console.log(manufVideo);
        addHiddenInfo('ii_manufVideo', manufVideo);
      }
    }
    await context.waitForFunction(function (sel) {
      return Boolean(document.querySelector(sel));
    }, { timeout: 20000 }, 'body');
    return await context.extract(productDetails, { transform: transformParam });
  },
};
