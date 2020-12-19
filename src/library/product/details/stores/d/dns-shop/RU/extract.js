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

    const mainImageCss = '.owl-item:first-child .img img';
    const videoPageCss = '.media-viewer__titles .media-viewer__title:nth-child(2)';
    try {
      await context.waitForSelector('.media-viewer__titles .media-viewer__title');
    } catch (error) {
      console.log(error);
    }

    const isButtonAvailable = await context.evaluate(async (mainImageCss) => {
      return document.querySelector(mainImageCss);
    }, mainImageCss);

    if (isButtonAvailable) {
      console.log('mainImage is available..clicking it');
      await context.click(mainImageCss);
    };

    const isVideoPageAvailable = await context.evaluate(async (videoPageCss) => {
      const btn = document.querySelector(videoPageCss);
      return btn && btn.innerText.includes('Видео');
    }, videoPageCss);

    if (isVideoPageAvailable) {
      console.log('VideoPage is available..clicking it');
      await context.click(videoPageCss);
    };

    await context.evaluate(async () => {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function getVideoSrc () {
        const iframe = document.querySelector('div[class*="media-viewer-video"] iframe');
        const src = iframe && iframe.getAttribute('src');
        return src !== 'null' ? src : '';
      }

      async function getVideoUrls () {
        const allVideoNav = document.querySelectorAll('.tns-inner .tns-item img');
        const videoUrls = [];

        for (let index = 0; index < allVideoNav.length; index++) {
          const btnCounter = index + 1;
          console.log(`clicking ${btnCounter}th nav btn`);
          if (index === 0) {
            videoUrls.push(getVideoSrc());
          } else {
            allVideoNav[index].click();
            await new Promise((resolve, reject) => {
              setTimeout(() => {
                resolve();
              }, 3000);
            });
            console.log(`clicked ${btnCounter}th nav btn`);
            videoUrls.push(getVideoSrc());
          }
        }
        return videoUrls;
      }

      const videoUrls = await getVideoUrls();
      console.log('videoUrls');
      console.log(videoUrls);
      videoUrls.filter(Boolean).map(url => addHiddenDiv('moreVideos', url));
    });
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
      const sideTabs = document.querySelectorAll('div[class*="product-card-tabs__list"] a');
      for (let i = 0; i < sideTabs.length; i++) {
        if (sideTabs[i].innerText.includes('Характеристики')) {
          sideTabs[i].click();
          await stall(3000);
          break;
        }
      }
      if (document.querySelectorAll('table.table-params tr')) {
        const tableRows = document.querySelectorAll('table.table-params tr');
        let tblData = '';
        for (let i = 0; i < tableRows.length; i++) {
          const tableDatas = tableRows[i].querySelectorAll('td');
          console.log(tableDatas);
          if (tableRows[i].querySelector('td')) {
            for (let j = 0; j < tableDatas.length; j++) { tblData += tableDatas[j].innerText + ' || '; }
          }
        }
        addHiddenDiv('specs', tblData);
      }
    });
    return await context.extract(productDetails, { transform });
  },
};
