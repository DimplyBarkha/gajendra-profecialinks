const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'RU',
    store: 'dns-shop',
    transform,
    domain: 'dns-shop.ru',
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
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      const sideTabs = document.querySelectorAll('a.product-card-tabs__title');
      if (sideTabs) {
        for (let i = sideTabs.length - 1; i >= 0; i--) {
          console.log(sideTabs[i].innerText + ' is the sidetab');
          if (sideTabs[i].innerText.includes('Обзоры')) {
            console.log('reviews button clicked');
            sideTabs[i].click();
            await stall(2000);
            const iframes = document.querySelectorAll('iframe');
            let videoLink = null;
            for (let i = 0; i < iframes.length; i++) {
              if (iframes[i].getAttribute('src') !== null && iframes[i].getAttribute('src').includes('youtube')) {
                videoLink = iframes[i].getAttribute('src');
                break;
              }
            }
            if (videoLink !== null) addHiddenDiv('moreVideos', videoLink);
          }
          if (sideTabs[i].innerText === 'Характеристики') {
            sideTabs[i].click();
          }
        }
      }
    });
    try {
      await context.waitForSelector('div.product-characteristics');
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const specsArrSelector = document.querySelectorAll('div.product-characteristics table tr');
        if (specsArrSelector) {
          const specsArr = [];
          for (let i = 0; i < specsArrSelector.length; i++) {
            if (specsArrSelector[i].querySelector('td:nth-child(2)')) {
              specsArr[i] = (specsArrSelector[i].querySelector('td:nth-child(1)').innerText + ': ' + specsArrSelector[i].querySelector('td:nth-child(2)').innerText);
            }
            addHiddenDiv('specsArr', specsArr[i]);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
    await context.evaluate(async () => {
      const Button1 = document.querySelector('.owl-item:first-child .img img');
      if (Button1) {
        Button1.click();
        console.log('Button1 clicked');
      }
    });
    await context.waitForSelector('.media-viewer__titles .media-viewer__title');
    await context.evaluate(async () => {
      const Button2 = document.querySelector('.media-viewer__titles .media-viewer__title:nth-child(2)');
      if (Button2) {
        Button2.click();
        console.log('Button2 clicked');
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
