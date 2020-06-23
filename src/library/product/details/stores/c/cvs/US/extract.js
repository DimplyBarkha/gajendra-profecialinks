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
      throw new Error("notFound")
    }

    await context.goto(linkURL);
    // await context.goto(linkURL + `?skuid=${skuFromUrl}`);









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
            const video = frame.contentDocument
            if(!!video){
              let videoSrc = video.querySelector('video')
              if(videoSrc) {
              addHiddenDiv('ii_videoSrc', `${videoSrc.src}`);
              }
            }
          });
        }
      }
      
      addHiddenDiv('ii_url', window.location.href);
      addHiddenDiv('ii_sku', skuFromUrl);
      
      collectNutritionInfo();
      collectBools();
      collectManufImages();
      // collectVariantInfo();
      collectBrand();
      collectManufDesc();
      collectIframe()
    }, skuFromUrl);
    
    // collectVariantNums();
    // identifySections();

    async function variantClick() {
      let btns = await buttonCheck().catch()
      const waitSelector = 'div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)'
      let i = 0;
      let j = 0;

      if(btns[0].length){
        while(i < btns[0].length && i < 100) {
          context.click(btns[0][i]);
          await context.waitForSelector(waitSelector, { timeout: 20000 });
          await new Promise(resolve => setTimeout(resolve, 5000));


          if(btns[1].length && i < 30){
            while(j < btns[1].length) {
              context.click(btns[1][j]);
              await getVariantIdNum()
              await collectVariantInfo()
              await context.waitForSelector(waitSelector, { timeout: 20000 });
              await new Promise(resolve => setTimeout(resolve, 5000));
              await context.extract(productDetails, { transform: transformParam, type: 'APPEND' }); 

              j++
            }
          } else {
            await getVariantIdNum()
            await collectVariantInfo()

            await context.extract(productDetails, { transform: transformParam, type: 'APPEND' }); 
            }
          i++
        }
      } else {
        await context.extract(productDetails, { transform: transformParam, type: 'APPEND' }); 
      }
    }

    async function getVariantIdNum() {
      let varArray = []
      const varStore = await context.evaluate(function() {
          function addHiddenDiv (id, content) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            newDiv.textContent = content;
            newDiv.style.display = 'none';
            document.body.appendChild(newDiv);
          }
        
        const variantOnDom = document.querySelector('div#ii_variantId');

        let varPath = document.querySelector('div.css-901oao.r-1jn44m2.r-1enofrn:nth-of-type(3)')
        const regex1 = /[0-9]+$/g;

        if(varPath){
          let varText = regex1.exec(varPath.innerText);

          console.log(varText)
          // if(variantOnDom) {
          //   variantOnDom.innerText = varText;
          // } else {
          addHiddenDiv('ii_variantId', varText)
          // }
        }
      });
    }


    async function buttonCheck() {
      const moreCheck = await context.evaluate(function() {
        let selectorCheck = document.querySelector('div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48');
        if(selectorCheck) {
          return true;
        } else {
          return false
        }
      })
      const moreSelector = 'div[aria-label="Toggle More/Less Swatches"] div.css-901oao.r-ty2z48'
      if(moreCheck){
        context.click(moreSelector)
      }
      return await context.evaluate(function() {
        const buttonSelector = 'div.css-1dbjc4n:nth-of-type(1) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(10)';
        let flag = false;
        const selectors = [[],[]];
        let i = 1;
        while(!flag && i < 100) {
          const firstVar = `div.css-1dbjc4n:nth-of-type(1) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i})`
          const secondVar = `div.css-1dbjc4n:nth-of-type(2) > div.css-1dbjc4n > div.swatch-scroll div.css-1dbjc4n:nth-of-type(${i})`
          if(document.querySelector(firstVar)){
            selectors[0].push(firstVar)
          }
          if(document.querySelector(secondVar)){
            selectors[1].push(secondVar)
          }
          if(!document.querySelector(firstVar) && !document.querySelector(secondVar)){
            flag = true
            break;
          }
          i++
        }

         if(selectors.length) {
             return selectors;
         } else {
             return false
         }
     });
  }



  async function collectVariantInfo () {
    const varStore = await context.evaluate(function() {
        function addHiddenDiv (id, content) {
          const variantId = document.querySelectorAll('div#ii_variantId')
          const variantDiv = variantId[variantId.length - 1]
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          variantDiv.appendChild(newDiv);
        }

      const variantInfo = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-f1odvy div.css-901oao');
      const variantPrice = document.querySelector('div.css-901oao.r-cme181.r-1jn44m2.r-111xbm8.r-b88u0q');
      // const variantImage = $x("(.//div[contains(@id, 'zoom-carousel')]//img)[1]/@src");
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
        // if (variantInfo[3]) {
        //   if (packSize.includes(variantInfo[2].innerText)) {
        //     packSizeResult.push(variantInfo[3].innerText);
        //   }
        //   variantArray.push(variantInfo[3].innerText);
        // }
        // if (variantInfo[5]) {
        //   if (packSize.includes(variantInfo[4].innerText)) {
        //     packSizeResult.push(variantInfo[5].innerText);
        //   }
        //   variantArray.push(variantInfo[5].innerText);
        // }
        // if (variantInfo[7]) {
        //   if (packSize.includes(variantInfo[6].innerText)) {
        //     packSizeResult.push(variantInfo[7].innerText);
        //   }
        //   variantArray.push(variantInfo[7].innerText);
        // }
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
      // if(variantImage) {
      //   debugger
      //   addHiddenDiv('ii_variantImage', `${variantImage.innerText}`);
      // }


    });
  }
  
  await variantClick()


    // async function variantCleanUp() {
    //   const varStore = await context.evaluate(function() {
    //     function addHiddenDiv (id, content) {
    //       const newDiv = document.createElement('div');
    //       newDiv.id = id;
    //       newDiv.textContent = content;
    //       newDiv.style.display = 'none';
    //       document.body.appendChild(newDiv);
    //     }
    //     let varArray = []
    //     const vars = document.querySelectorAll('div#ii_variantId');
    //     if(vars) {
    //       vars.forEach(variant => {
    //         if(!varArray.includes(variant.innerText)) {
    //           varArray.push(variant.innerText)
    //         }
    //       });
    //       varArray.forEach(varId => {
    //         addHiddenDiv('ii_variantNum', varId)
  
    //       })
    //     }
    //   });
  
    // }

    // await variantCleanUp()


    
    // async function variantAppend() {
    //   const numVariants = await context.evaluate(function() {
    //     let variantInfo = ["buffer"]
    //     document.querySelectorAll('div#ii_variantInfo').forEach(ele => {variantInfo.push(ele.innerText)})
    //     return variantInfo;
    //   });
    //   const numPrice = await context.evaluate(function() {
    //     let variantPrice = ["buffer"]
    //     document.querySelectorAll('div#ii_variantPrice').forEach(ele => {variantPrice.push(ele.innerText)})
    //     return variantPrice;
    //   });
    //   // const numImage = await context.evaluate(function() {
    //   //   let variantImage = ["buffer"]
    //   //   document.querySelectorAll('div#ii_variantImage').forEach(ele => {variantImage.push(ele.innerText)})
    //   //   return variantImage;
    //   // });
    //   const data =  await context.extract(productDetails, { transform: transformParam });
    //   const copyData = data.slice();
    //   let i = 1;

    //   while(i < numVariants.length) {
    //     data[0].group.push(copyData[0].group[0])
    //     data[0].group[i].variantInformation[0].text = numVariants[i]
    //     data[0].group[i].price[0].text = numPrice[i]
    //     // data[0].group[i].image[0].text = numImage[i]
    //     console.log(data[0].group[i].price[0])
    //     console.log(numVariants[1])
    //     console.log(data[0].group[i].variantInformation)
    //     i++
    //   }
    //   console.log(data[0].group[0].variants[0])
    //   // return await context.extract(data, { transform: transformParam });
    //   // console.log(data[0].group[2]);
    //   return data;
    // }
    // // await variantAppend()
    // return await variantAppend();
    // return await context.extract(productDetails, { transform: transformParam });

  },
};
