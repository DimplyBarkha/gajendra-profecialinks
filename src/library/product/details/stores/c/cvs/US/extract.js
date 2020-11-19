const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await new Promise(resolve => setTimeout(resolve, 10000));

    const skuFromUrl = await context.evaluate(function () {
      const skuNumber = window.location.href;
      if (skuNumber) {
        const skuNum = skuNumber.split('=');
        if (skuNum.length > 2) {
          return skuNum[2];
        } else {
          return null;
        }
      }
    });

    const linkURL = await context.evaluate(function () {
      const element = document.querySelector('div.css-1dbjc4n.r-18u37iz.r-tzz3ar a');
      if (element) {
        return element.href;
      } else {
        return null;
      }
    });
    console.log(linkURL);
    await context.goto(linkURL + `?skuid=${skuFromUrl}`);

    // await new Promise(r => setTimeout(r, 40000));

    const sectionsDiv = 'div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs';
    const variantInfoDiv = 'div.css-1dbjc4n.r-16lk18l.r-11c0sde.r-1xi2sqm';
    // const variantInfoDiv = 'div.css-1dbjc4n.r-16lk18l.r-11c0sde.r-1xi2sqm div.css-1dbjc4n.r-utggzx';

    await context.waitForSelector(sectionsDiv, { timeout: 90000 });
    await context.waitForSelector(variantInfoDiv, { timeout: 90000 });

    await context.evaluate(function (skuFromUrl) {
      // document.body.setAttribute("ii_url", window.location.href);

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      function identifySections () {
        const sectionList = ['Warnings', 'Directions', 'Ingredients'];
        // const nodeListTitles = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs h2');
        // const nodeListText = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs div.htmlView');
        const nodeList = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs');
        let i = 0;

        while (i < nodeList.length && i < 10) {
          const section = (nodeList[i].childNodes[0].innerText).split(' ');
          const sectionLast = section.length - 1;
          if (sectionList.includes(section[sectionLast])) {
            console.log(section[sectionLast] + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', nodeList[i].childNodes[1].innerText);
            addHiddenDiv(`ii_${section[sectionLast]}`, `${nodeList[i].childNodes[1].innerText}`);
          }
          if (sectionList.includes(section[0])) {
            console.log(section[sectionLast] + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', nodeList[i].childNodes[1].innerText);
            addHiddenDiv(`ii_${section[0]}`, `${nodeList[i].childNodes[1].innerText}`);
          }
          i++;
        }
      }

      function collectNutritionInfo () {
        let i = 1;
        const termsWithValues = {};
        while (i < 200) {
          const nutrTerm = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(1) > div.css-901oao:nth-of-type(${i})`);
          const nutrValue = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(2) > div.css-901oao:nth-of-type(${i})`);
          if (nutrTerm) {
            termsWithValues[nutrTerm.innerHTML] = nutrValue.innerHTML;
          } else {
            break;
          }
          i++;
        }

        Object.keys(termsWithValues).forEach((term) => {
          console.log(term);
          addHiddenDiv(`ii_${term}`, termsWithValues[term]);
        });
      }

      function collectBools () {
        const imageZoom = document.querySelector('div[data-class="zoom-btn"]');
        const Image360 = document.querySelector('div#wc-360-view-2e50e148');
        if (imageZoom) {
          addHiddenDiv('ii_imageZoom', 'true');
        } else {
          addHiddenDiv('ii_imageZoom', 'false');
        }
        if (Image360) {
          addHiddenDiv('ii_image360', 'true');
        } else {
          addHiddenDiv('ii_image360', 'false');
        }
      }

      function collectManufImages () {
        const manufImages = document.querySelectorAll('div.wc-aplus-body div.wc-reset img[src]');

        if (manufImages) {
          manufImages.forEach(img => {
            addHiddenDiv('ii_manufImages', `${img.src}`);
          });
        }
      }

      function collectManufDesc () {
        const manufDesc = document.querySelector('div#wc-power-page div.wc-fragment');

        if (manufDesc) {
          addHiddenDiv('ii_manufDesc', `${manufDesc.innerText}`);
        }
      }

      function collectVariantInfo () {
        const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
        const variantArray = [];
        const packSize = ['Pack: ', 'Group Size: '];
        const packSizeResult = [];

        if (variantInfo[1]) {
          if (packSize.includes(variantInfo[0].innerText)) {
            packSizeResult.push(variantInfo[1].innerText);
          }
          variantArray.push(variantInfo[1].innerText);
        }
        if (variantInfo[3]) {
          if (packSize.includes(variantInfo[2].innerText)) {
            packSizeResult.push(variantInfo[3].innerText);
          }
          variantArray.push(variantInfo[3].innerText);
        }
        if (variantInfo[5]) {
          if (packSize.includes(variantInfo[4].innerText)) {
            packSizeResult.push(variantInfo[5].innerText);
          }
          variantArray.push(variantInfo[5].innerText);
        }
        if (variantInfo[7]) {
          if (packSize.includes(variantInfo[6].innerText)) {
            packSizeResult.push(variantInfo[7].innerText);
          }
          variantArray.push(variantInfo[7].innerText);
        }

        if (variantArray.length) {
          const variantString = variantArray.join(' || ');
          addHiddenDiv('ii_variantInfo', `${variantString}`);
        }
        if (packSizeResult.length) {
          const packString = packSizeResult.join(' ');
          addHiddenDiv('ii_packSize', `${packString}`);
        }
      }

      function collectBrand () {
        const brandBlock = document.querySelector('script#schema-json-ld');

        if (brandBlock) {
          const brandObject = JSON.parse(brandBlock.innerText);
          addHiddenDiv('ii_Brand', `${brandObject[0].brand}`);
        }
      }

      function collectVariantNums () {
        const variant1 = document.querySelector('div#ii_url');
        const regex1 = /[0-9]+$/g;
        const variant2 = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)');
        const regex2 = /[0-9]+$/g;
        if (variant1) {
          const trans1 = regex1.exec(variant1.innerText);
          addHiddenDiv('ii_variantId', `${trans1[0]}`);
        }
        if (variant2) {
          const trans2 = regex2.exec(variant2.innerText);
          addHiddenDiv('ii_variantId', `${trans2[0]}`);
        }
      }

      addHiddenDiv('ii_url', window.location.href);
      addHiddenDiv('ii_sku', skuFromUrl);

      identifySections();
      collectNutritionInfo();
      collectBools();
      collectManufImages();
      collectVariantInfo();
      collectBrand();
      collectVariantNums();
      collectManufDesc();
    }, skuFromUrl);

<<<<<<< Updated upstream
    async function buttonCheck () {
      return await context.evaluate(function () {
        const buttons = document.querySelectorAll('div.swatch-scroll > div.css-1dbjc4n');
        if (buttons != null) {
          const variants = [];
          buttons.forEach((variantBtn) => {
            variants.push(variantBtn);
          });
          return variants;
        } else {
          return false;
        }
      });
    }

    async function variantClick () {
      const variantNums = [];
      // const button = document.querySelector('div.css-1dbjc4n.r-1yd45rl.r-rs99b7.r-1loqt21.r-1bq2mok.r-1inuy60.r-1m04atk.r-1pyaxff.r-glunga.r-1otgn73.r-eafdt9.r-1i6wzkk.r-lrvibr')
      // debugger
      context.click('div.css-1dbjc4n.r-1yd45rl.r-rs99b7.r-1loqt21.r-1bq2mok.r-1inuy60.r-1m04atk.r-1pyaxff.r-glunga.r-1otgn73.r-eafdt9.r-1i6wzkk.r-lrvibr');
      if (buttonCheck()) {
        const btns = await buttonCheck();
        btns.forEach((btn) => {
          context.click(btn);
          new Promise(resolve => setTimeout(resolve, 5000));
        });
=======
    async function buttonCheck() {
      return await context.evaluate(function() {
         const buttons = document.querySelectorAll('div.swatch-scroll > div.css-1dbjc4n')
         if(buttons != null) {
           const variants = [];
           buttons.forEach((variantBtn) => {
            variants.push(variantBtn)
           })
             return variants;
         } else {
             return false
         }
     });
  }
  
      
  
    async function variantClick() {
      const variantNums = [];
      // const button = document.querySelector('div.css-1dbjc4n.r-1yd45rl.r-rs99b7.r-1loqt21.r-1bq2mok.r-1inuy60.r-1m04atk.r-1pyaxff.r-glunga.r-1otgn73.r-eafdt9.r-1i6wzkk.r-lrvibr')
      // debugger
      context.click('div.css-1dbjc4n.r-1yd45rl.r-rs99b7.r-1loqt21.r-1bq2mok.r-1inuy60.r-1m04atk.r-1pyaxff.r-glunga.r-1otgn73.r-eafdt9.r-1i6wzkk.r-lrvibr')
      if(buttonCheck()){
        const btns = await buttonCheck()
        btns.forEach((btn) => {
          context.click(btn);
          new Promise(resolve => setTimeout(resolve, 5000));
        })
>>>>>>> Stashed changes
      }
    }
    // const variantCollections = document.querySelectorAll('div.swatch-scroll > div.css-1dbjc4n');
    // if(variantCollections) {
    //   variantClick('div.swatch-scroll > div.css-1dbjc4n')
    // }
<<<<<<< Updated upstream
    await variantClick();
=======
      await variantClick()
    


>>>>>>> Stashed changes

    return await context.extract(productDetails, { transform: transformParam });
  },
};
