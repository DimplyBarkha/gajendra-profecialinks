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

      const inTheBox = document.getElementById('headingFour');
      if (inTheBox && inTheBox !== undefined) {
        inTheBox.click();
      }



      const overlay = document.getElementById('headingOne');
      if (overlay && overlay !== undefined) {
        overlay.click();
      }
    });

    await context.evaluate(async function () {

      const inBoxImageArray = [];

      const inBoxUrl = document.querySelectorAll('div.productSpec div.panel-default div#collapseFour img');
      if (inBoxUrl.length > 0) {
      for (let i = 0; i < inBoxUrl.length; i++) {
        const imgUrl = 'https://www.netonnet.se' + inBoxUrl[i].getAttribute('src');
        imgUrl && inBoxImageArray.push(imgUrl);
      }

      }
      const inBoxTextArray = [];
      const inBoxText = document.querySelectorAll('div.productSpec div.panel-default div#collapseFour div.name');
      if (inBoxText.length > 0) {
        for (let i = 0; i < inBoxText.length; i++) {
          const imgText = inBoxText[i].innerText;
          imgText && inBoxTextArray.push(imgText);
        }
      }
      else {


        const onlyText = document.querySelectorAll('div#collapseFive div.panel-body div.row')
        if (onlyText) {
          for (let i = 0; i < onlyText.length; i++) {
            if (onlyText[i].innerText === 'I förpackningen') {
              const imgText = onlyText[i].nextElementSibling.innerText;
              imgText && inBoxTextArray.push(imgText);
            }
          }

        }
        const onlyText1 = document.querySelectorAll('div#collapseOne div.panel-body table.table-striped tr td')
        if (onlyText1) {
            console.log("case 1")
          for (let i = 0; i < onlyText1.length; i++) {
            if (onlyText1[i].innerText === 'Medföljande tillbehör') {
              const imgText2 = onlyText1[i].nextElementSibling.innerText;
              imgText2 && inBoxTextArray.push(imgText2);
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
      console.log('inBoxImageArray', JSON.stringify(inBoxImageArray));
      addHiddenDiv('inTheBoxUrl', inBoxImageArray.join(' || '));
      addHiddenDiv('inTheBoxText', inBoxTextArray.join(' || '));




    }
    );


    try {
      await context.waitForSelector('iframe[id^="quchbox-videolist"]', { timeout: 45000 });
    } catch (error) {
      console.log('No videos loading');
    }

    await context.evaluate(async function () {
      // document.body.setAttribute("ii_url", window.location.href);

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
