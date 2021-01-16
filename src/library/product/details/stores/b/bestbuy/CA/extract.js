const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    transform: transform,
    domain: 'bestbuy.ca/en-ca',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 400;
          window.scroll(0, scrollTop);
          await stall(2000);
        }
        function stall(ms) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    await context.evaluate(async function (context) {
      const seeAllSelector1 = document.querySelector('div[class*="x-customers-also-viewed"] ul>div >a');
      const seeAllSelector2 = document.querySelector('div[data-automation*="sponsored"] ul>div >a');
      const seeAllSelector3 = document.querySelector('div[class*="recently"] ul>div >a');
      for(let i=0; i<3; i++) {
        seeAllSelector1.click();
      }
      for(let i=0; i<3; i++) {
        seeAllSelector2.click();
      }
      for(let i=0; i<3; i++) {
        seeAllSelector3.click();
      }
    });
    await context.evaluate(async function () {
      const buttonSelector = 'button#detailsAndSpecs';
      let available = document.querySelector(buttonSelector);
      // @ts-ignore
      available = available ? available.click() : '';
    });
    try {
      await context.waitForXPath('//h3[text()="Warranty"]/parent::div/following-sibling::div');
    } catch (error) {
      console.log('Warranty element not found');
    }
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let detailsAndSpecsTextArr = [];
      let warrantyTextArr = [];
      const detailsAndSpecsText = document.querySelectorAll('div.itemContainer_20kXj');
      for (let index = 0; index < detailsAndSpecsText.length; index++) {
        const field = detailsAndSpecsText[index].querySelector('div.itemName_37zd4');
        const specs = detailsAndSpecsText[index].querySelector('div.itemValue_XPfaq');
        // @ts-ignore
        const fieldSpec = field.innerText + ' : ' + specs.innerText;
        if (fieldSpec.includes('Warranty')) {
          warrantyTextArr.push(fieldSpec);
        }
        detailsAndSpecsTextArr.push(fieldSpec);
      }
      // @ts-ignore
      warrantyTextArr = warrantyTextArr.join(' | ');
      addElementToDocument('bb_warranty', warrantyTextArr);
      // @ts-ignore
      detailsAndSpecsTextArr = detailsAndSpecsTextArr.join(' || ');
      addElementToDocument('bb_specifications', detailsAndSpecsTextArr);
      // ---------------------------------------------------------------
      const dimension = document.querySelectorAll('div.smallSizeContainer_1UtWF div.itemContainer_20kXj');
      let dimensionTxtField = '';
      let originTxtField = '';
      let dimensionTxtFieldVal = '';
      let originTxtFieldVal = '';
      let dimensionTxt = '';
      const originTxt = '';
      const dimensionTxtArr = [];
      const originTxtArr = [];
      let netWeightTxt = '';
      let colorTxt = '';
      for (let index = 0; index < dimension.length; index++) {
        const element = dimension[index];
        // @ts-ignore
        const elementTxt = element.innerText;
        if ((elementTxt === 'Width') || (elementTxt === 'Height') || (elementTxt === 'Depth') || (elementTxt === 'Width (Inches)') || (elementTxt === 'Height (Inches)') || (elementTxt === 'Depth (Inches)')) {
        // @ts-ignore
          dimensionTxtField = element.innerText;
          // @ts-ignore
          dimensionTxtFieldVal = element.nextSibling.innerText;
          dimensionTxt = dimensionTxtField + ' : ' + dimensionTxtFieldVal;
          dimensionTxtArr.push(dimensionTxt);
        }
        if ((elementTxt === 'Country of Origin')) {
        // @ts-ignore
          originTxtField = element.innerText;
          // @ts-ignore
          originTxtFieldVal = element.nextSibling.innerText;
          originTxtArr.push(originTxtFieldVal);
        }
        if ((elementTxt === 'Weight') || (elementTxt === 'Weight (lbs)')) {
        // @ts-ignore
          netWeightTxt = element.nextSibling.innerText;
        }
        if ((elementTxt === 'Colour') || (elementTxt === 'Band Colour')) {
        // @ts-ignore
          colorTxt = element.nextSibling.innerText;
        }
      }
      addElementToDocument('bb_colour', colorTxt);
      addElementToDocument('bb_weightNet', netWeightTxt);
      addElementToDocument('bb_countryOfOrigin', originTxtArr.join(' | '));
      addElementToDocument('bb_dimension', dimensionTxtArr.join(' | '));
    });
    // -----------------------------------------------------------------
    await context.evaluate(async function () {
      const buttonSelector1 = 'button#moreInfo';
      let available = document.querySelector(buttonSelector1);
      // @ts-ignore
      available = available ? available.click() : '';
    });
    try {
      await context.waitForSelector('div.productDescription_1F7nr');
    } catch (error) {
      console.log('Product description not loaded');
    }
    await context.evaluate(async function () {
      document.querySelectorAll('div#moreInfo ul li').forEach((ele) => ele.textContent = `|| ${ele.textContent}`);
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let description = document.querySelector('div[itemprop="description"]');
      // @ts-ignore
      description = description ? description.innerText : '';
      let descArr = [];
      const additionalBulletInfo = [];
      // @ts-ignore
      if (description !== '') {
        descArr.push(description);
      }
      let bulletsDescription = document.querySelectorAll('div.productDescription_1F7nr ul li');
      console.log('bulletsDescription: ', bulletsDescription);
      let bulletCount = bulletsDescription.length;
      if (bulletsDescription.length !== 0) {
        bulletCount = bulletsDescription.length;
        for (let index = 0; index < bulletsDescription.length; index++) {
          let element = bulletsDescription[index];
          // @ts-ignore
          element = element ? element.innerText.replace(/•/, '') : '';
          descArr.push(element);
          additionalBulletInfo.push(element);
        }
        addElementToDocument('bb_descriptionBulletsCount', bulletCount);
        // @ts-ignore
        descArr = descArr.join(' | ');
        addElementToDocument('bb_descriptionBullets', descArr);
        addElementToDocument('bb_addDescriptionBulletsInfo', additionalBulletInfo.join(' | '));
      }
      let count = 0;

      if (bulletsDescription.length == 0) {
        bulletsDescription = document.querySelectorAll('div.productDescription_1F7nr p');
        bulletCount = bulletsDescription.length;
        // if(bulletsDescription.length == 1){
        //   addElementToDocument('bb_descriptionBulletsCount', bulletsDescription);
        // }
        for (let index = 0; index < bulletsDescription.length; index++) {
          let element = bulletsDescription[index];
          // @ts-ignore
          element = element ? element.innerText.replace(/•/, ' | ') : '';
          // @ts-ignore
          if (element.includes(' | ')) {
            additionalBulletInfo.push(element);
            count++;
          }

          descArr.push(element);
        }

        const desc = descArr.join(' ');
        // @ts-ignore
        descArr = descArr.join(' ');
        addElementToDocument('bb_descriptionBullets', descArr);

        addElementToDocument('bb_descriptionBulletsCount', count);
        addElementToDocument('bb_addDescriptionBulletsInfo', additionalBulletInfo.join(' | '));
        console.log('count: ', count);
      }
    });
    // ------------------------------------------------------------
    // await context.waitForSelector('img[class="middle_1qXv8"]');
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      let videoLinkArr = [];
      const videos = document.querySelectorAll('img[class="middle_1qXv8"]');
      for (let index = 0; index < videos.length; index++) {
        // @ts-ignore
        let element = videos[index];
        element = element.previousElementSibling;
        // @ts-ignore
        element = element ? element.src : '';
        console.log('element: ', element);
        // @ts-ignore
        if (element.includes('https://i1.ytimg.com/vi/')) {
          // @ts-ignore
          let videoLink = element.replace(/https:\/\/i1\.ytimg\.com\/vi\/(.*)\/default.jpg/, '$1');
          videoLink = 'https://www.youtube.com/watch?v=' + videoLink;
          if (videoLinkArr.indexOf(videoLink) === -1) {
            videoLinkArr.push(videoLink);
          }
        }
      }

      videoLinkArr = videoLinkArr.join(' | ');
      addElementToDocument('bb_videos', videoLinkArr);
    });
    // ------------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //   const buttonSelector2 = 'button#whatsIncluded';
    //   let available = document.querySelector(buttonSelector2);
    //   // @ts-ignore
    //   available = available ? available.click() : '';
    //  });
    //  try {
    //    await context.waitForSelector('div#whatsIncluded ul li');
    //  } catch (error) {
    //   console.log("whatsIncluded description not loaded");
    //  }
    // ------------------------------------------------------------------------
    //  await context.evaluate(async function () {
    //  let otherInfoArr = [];
    //  let otherInfo = document.querySelector('button#whatsIncluded');
    //  // @ts-ignore
    //  otherInfo = otherInfo ? otherInfo.click() : '';
    //  let otherInfoTxt = document.querySelectorAll('div#whatsIncluded ul li');
    //  for (let index = 0; index < otherInfoTxt.length; index++) {
    //    // @ts-ignore
    //    const element = otherInfoTxt[index].innerText;
    //    otherInfoArr.push(" | "+element);
    //  }
    //  // @ts-ignore
    //  otherInfoArr = otherInfoArr.join('');
    //  addElementToDocument('bb_productOtherInformation', otherInfoArr);
    // ------------------------------------------------------------------------------
    //    function addElementToDocument (key, value) {
    //     const catElement = document.createElement('div');
    //     catElement.id = key;
    //     catElement.textContent = value;
    //     catElement.style.display = 'none';
    //     document.body.appendChild(catElement);
    //   }
    //  });

    return await context.extract(productDetails, { transform });
  },
};
