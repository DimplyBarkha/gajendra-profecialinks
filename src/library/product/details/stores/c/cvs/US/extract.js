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

    if(linkURL === null) {
      throw new Error("notFound");
    }

    // await context.goto(linkURL);
    await context.goto(linkURL + `?skuid=${skuFromUrl}`);

    // await new Promise(resolve => setTimeout(resolve, 20000));

    // const sectionsDiv = 'div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs';
    // const variantInfoDiv = 'div.css-1dbjc4n.r-16lk18l.r-11c0sde.r-1xi2sqm';

    // await context.waitForSelector(sectionsDiv, { timeout: 90000 }).catch();
    // await context.waitForSelector(variantInfoDiv, { timeout: 90000 }).catch();
    await new Promise(resolve => setTimeout(resolve, 10000));

    await context.evaluate(function (skuFromUrl) {

      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      // function identifySections () {
      //   const sectionList = ['Warnings', 'Directions', 'Ingredients'];
      //   const nodeList = document.querySelectorAll('div.css-1dbjc4n.r-13awgt0.r-1mlwlqe.r-dnmrzs');
      //   let i = 0;

      //   while (i < nodeList.length && i < 10) {
      //     const section = (nodeList[i].childNodes[0].innerText).split(' ');
      //     const sectionLast = section.length - 1;
      //     if (sectionList.includes(section[sectionLast])) {
      //       console.log(section[sectionLast] + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', nodeList[i].childNodes[1].innerText);
      //       addHiddenDiv(`ii_${section[sectionLast]}`, `${nodeList[i].childNodes[1].innerText}`);
      //     }
      //     if (sectionList.includes(section[0])) {
      //       console.log(section[sectionLast] + '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~', nodeList[i].childNodes[1].innerText);
      //       addHiddenDiv(`ii_${section[0]}`, `${nodeList[i].childNodes[1].innerText}`);
      //     }
      //     i++;
      //   }
      // }

      function collectNutritionInfo () {
        let i = 1;
        const termsWithValues = {};
        while (i < 200) {
          const nutrTerm = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(1) > div.css-901oao:nth-of-type(${i})`);
          const nutrValue = document.querySelector(`div.css-1dbjc4n.r-eqz5dr.r-1wtj0ep:nth-of-type(2) > div.css-901oao:nth-of-type(${i})`);
          if (nutrTerm && nutrValue) {
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
          addHiddenDiv('ii_imageZoom', 'Yes');
        } else {
          addHiddenDiv('ii_imageZoom', 'No');
        }
        if (Image360) {
          addHiddenDiv('ii_image360', 'Yes');
        } else {
          addHiddenDiv('ii_image360', 'No');
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
        const manufDesc = document.querySelector('div#wc-power-page > div');

        if (manufDesc) {
          addHiddenDiv('ii_manufDesc', `${manufDesc.innerText}`);
        }
      }



      function collectBrand () {
        const brandBlock = document.querySelector('script#schema-json-ld');

        if (brandBlock) {
          const brandObject = JSON.parse(brandBlock.innerText);
          addHiddenDiv('ii_Brand', `${brandObject[0].brand}`);
        }
      }

      // function collectVariantNums () {
      //   const variant1 = document.querySelector('div#ii_url');
      //   const regex1 = /[0-9]+$/g;
      //   const variant2 = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)');
      //   const regex2 = /[0-9]+$/g;
      //   // if (variant1) {
      //   //   const trans1 = regex1.exec(variant1.innerText);
      //   //   addHiddenDiv('ii_variantId', `${trans1[0]}`);
      //   // }
      //   if (variant2) {
      //     const trans2 = regex2.exec(variant2.innerText);
      //     addHiddenDiv('ii_variantId', `${trans2[0]}`);
      //   }
      // }

      function collectIframe() {
        const iframeList = document.querySelectorAll('iframe');
        if(iframeList) {
          iframeList.forEach((frame) => {
            const video = frame.contentDocument;
            if(!!video){
              let videoSrc = video.querySelector('video');
              if(videoSrc) {
              addHiddenDiv('ii_videoSrc', `${videoSrc.src}`);
              }
            }
          });
        }
      }

      function collectKeywords() {
        const prodName = document.querySelector('h1.css-4rbku5.css-901oao.r-1jn44m2.r-1ui5ee8.r-vw2c0b.r-16krg75');
        const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
          if (variantInfo[1] && prodName) {

            let varName = variantInfo[1].innerText;
            addHiddenDiv('ii_metaKeywords', `${prodName.innerText + " " + varName}`);
          }
      }
      
      addHiddenDiv('ii_url', window.location.href);
      addHiddenDiv('ii_sku', skuFromUrl);
      
      collectNutritionInfo();
      collectBools();
      collectManufImages();
      collectBrand();
      collectManufDesc();
      collectIframe();
      collectKeywords();
    }, skuFromUrl);
    
    // collectVariantNums();
    // identifySections();

    async function variantClick() {
      let btns = await collectButtons();
      const waitSelector = 'div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)';
      let i = 0;
      let j = 0;

      if(btns[0].length){
        while(i < btns[0].length && i < 100) {
          context.click(btns[0][i]);
          await new Promise(resolve => setTimeout(resolve, 5000));
          await context.waitForSelector(waitSelector, { timeout: 20000 });


          if(btns[1].length && j < 100){
            console.log('INSIDE IF')
            while(j < btns[1].length && j < 100) {
              console.log("INSIDE LOOP")
              let check = await buttonCheck(btns[1][j] + " div")
              if(check) {
                console.log("INSIDE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                context.click(btns[1][j])
                await getVariantIdNum();
                await collectVariantInfo();
                await new Promise(resolve => setTimeout(resolve, 5000));
                await context.waitForSelector(waitSelector, { timeout: 20000 });
              }
              j++
            }
            j = 0;
          } else {
            await getVariantIdNum();
            await collectVariantInfo();
            
            }
          i++
        }
      } else {
        const varStore = await context.evaluate(function() {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
          addHiddenDiv('ii_variantId');

      });
      }
    }


    async function buttonCheck(selector) {
      let input = selector
      return await context.evaluate(function(input) {
        let sel = document.querySelector(input)
        if(sel) {
        // debugger
          // if(!sel.ariaLabel.includes("Out-of-stock")) {
            return true;
          } else {
              return false
          }
        // }
        
      }, input);
    }

    async function getVariantIdNum() {
      let varArray = [];
      const varStore = await context.evaluate(function() {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
        
        // const variantOnDom = document.querySelector('div#ii_variantId');

        let varPath = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)');
        const regex1 = /[0-9]+$/g;

        if(varPath){
          let varText = regex1.exec(varPath.innerText);
          console.log(varText);

          addHiddenDiv('ii_variantId', varText);
        }
      });
    }



    async function collectButtons() {
      const moreCheck = await context.evaluate(function() {
        let selectorCheck = document.querySelector('div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48');
        if(selectorCheck) {
          return true;
        } else {
          return false;
        }
      });
      const moreSelector = 'div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48';
      if(moreCheck){
        context.click(moreSelector);
        await new Promise(resolve => setTimeout(resolve, 10000));
      }

      return await context.evaluate(function() {
        let flag = false;
        const selectors = [[],[]];
        let i = 1;
        while(!flag && i < 100) {
          const firstVar = `div.css-1dbjc4n:nth-of-type(1) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i})`;
          const secondVar = `div.css-1dbjc4n:nth-of-type(2) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i})`;
          if(document.querySelector(firstVar)){
            selectors[0].push(firstVar);
          }
          if(document.querySelector(secondVar)){
            selectors[1].push(secondVar);
          }
          if(!document.querySelector(firstVar) && !document.querySelector(secondVar)){
            flag = true;
            break;
          }
          i++
        }

         if(selectors.length) {
             return selectors;
         } else {
             return false;
         }
     });
  }

  async function collectVariantInfo () {
    const varStore = await context.evaluate(function() {
        function addHiddenDiv (id, content) {
          const variantId = document.querySelectorAll('div#ii_variantId');
          const variantDiv = variantId[variantId.length - 1];
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          variantDiv.appendChild(newDiv);
        }
      const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
      const variantImage = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz div.css-1dbjc4n.r-1pi2tsx img');
      const variantPrice = document.querySelector('div.css-901oao.r-cme181.r-1jn44m2.r-111xbm8.r-b88u0q');
      const variantRating = document.querySelector('div.css-1dbjc4n div.css-901oao.r-1enofrn.r-b88u0q.r-m2pi6t');
      const variantReview = document.querySelector('div.css-1dbjc4n.r-obd0qt.r-18u37iz a');
      const variantRatingText = document.querySelector('div.css-1dbjc4n.r-obd0qt.r-18u37iz section');
      const variantListPrice = document.querySelector('div.css-1dbjc4n.r-k8qxaj div.css-901oao.r-1khnkhu.r-1jn44m2.r-1b43r93.r-5fcqz0.r-m611by');

      const variantArray = [];
      const packSize = ['Pack: ', 'Group Size: '];
      const packSizeResult = [];
      for(let i = 0; i < 10; i = i + 2) {
        if (variantInfo[i + 1]) {
          if (packSize.includes(variantInfo[i].innerText)) {
            packSizeResult.push(variantInfo[i + 1].innerText);
          }
          variantArray.push(variantInfo[i + 1].innerText);
        }
      }

      if (variantArray.length) {
        const variantString = variantArray.join(' || ');
        addHiddenDiv('ii_variantInfo', `${variantString}`);
      }
      if (packSizeResult.length) {
        const packString = packSizeResult.join(' ');
        addHiddenDiv('ii_packSize', `${packString}`);
      }
       if(variantPrice) {
        addHiddenDiv('ii_variantPrice', `${variantPrice.innerText}`);
      }
      if(variantImage){
        addHiddenDiv('ii_variantImage', `${variantImage[0].src}`);
      }
      if(variantImage){
        if(variantImage[1]){
          addHiddenDiv('ii_variantImageAlt', `${variantImage[1].src}`);
        }
      }
      if(variantRating){
        addHiddenDiv('ii_variantRating', `${variantRating.innerText}`);
      }
      if(variantReview){
        addHiddenDiv('ii_variantReview', `${variantReview.innerText}`);
      }
      if(variantListPrice){
        addHiddenDiv('ii_variantListPrice', `${variantListPrice.innerText}`);
      }
      // if(variantRatingText){
      //   addHiddenDiv('ii_variantRatingText', `${variantRatingText.ariaLabel}`);
      // }

    });
  }
  
  await variantClick()

    return await context.extract(productDetails, { transform: transformParam });

  },
};
