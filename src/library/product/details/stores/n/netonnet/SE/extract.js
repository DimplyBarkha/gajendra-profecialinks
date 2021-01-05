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
      const inBoxTextArray = [];


      const bb = document.evaluate('//div[div/h2[contains(text(),"I förpackningen")]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

      if (bb) {

        const cc = bb.nextElementSibling.querySelectorAll('ul.bulletList > li')
        cc.forEach(li => {
          li.innerText
          inBoxTextArray.push(li.innerText);
        });
      }
      else {
        const overlay = document.getElementById('headingOne');
        if (overlay && overlay !== undefined) {
          overlay.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          const onlyText = document.querySelectorAll('div#collapseOne div.panel-body table.table-striped tr:not([class])');
          console.log("onlyText.length", onlyText.length);
          if (onlyText.length) {
            console.log("case 1")
            for (let i = 0; i < onlyText.length; i++) {
              const header = onlyText[i].querySelector('td.plHeader')
              if ((header && header.innerText === 'Medföljande tillbehör') || (header && header.innerText === 'Medföljande verktyg')) {
                const imgText2 = onlyText[i].querySelector('td.plValue');
                imgText2 && inBoxTextArray.push(imgText2.innerText);
              }
            }
          }
        }
      }

      function addHiddenDiv(id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      console.log('inTheBoxText', JSON.stringify(inBoxTextArray));
      addHiddenDiv('inTheBoxText', inBoxTextArray.join(' || '));
    });

    try {
      await context.waitForSelector('iframe[id^="quchbox-videolist"]', { timeout: 45000 });
    } catch (error) {
      console.log('No videos loading');
    }

    await context.evaluate(async function () {

      function addHiddenDiv(id, content) {
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

