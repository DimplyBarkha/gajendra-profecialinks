const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform: transform,
    domain: 'costco.com',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise(resolve => setTimeout(resolve, 10000));
    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div.flix-text-center>div.flix-btn-tech-ctrl');
      if (moreBtn && moreBtn.length > 0) {
        for(let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            moreBtn[cnt].click();
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (err) {  }
          }
        }
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div input[name="view-more"]');
      if (moreBtn && moreBtn.length > 0) {
        for (let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            // await context.setBlockAds(false);
            // await context.setLoadAllResources(true);
            // await context.setLoadImages(true);
            // await context.setJavaScriptEnabled(true);
            moreBtn[cnt].click();
            // await context.setBlockAds(false);
            // await context.setLoadAllResources(true);
            // await context.setLoadImages(true);
            await new Promise(resolve => setTimeout(resolve, 0000));
          } catch (err) { }
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const descNode = document.querySelector('div.product-info-description');
      let manuFacturerDesc = '';
      const images = [];
      if (descNode) {
        manuFacturerDesc = descNode.outerText;
        console.log("manuFacturerDesc ==", manuFacturerDesc);
        manuFacturerDesc = manuFacturerDesc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      }
      try {
        const descNode1 = document.querySelector('div.syndi_powerpage');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (descNode1 && descNode1.shadowRoot) {
          const fetchNode = descNode1.shadowRoot.firstChild;
          let text = fetchNode.innerText;
          text = text.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
          manuFacturerDesc = manuFacturerDesc + text;
          const manImages = fetchNode.querySelectorAll('img');
          if (manImages && manImages.length > 0) {
            for (let i = 0; i < manImages.length; i++) {
              let img = manImages[i].src;
              img = img.replace('/240.', '/480');
              images.push(img);
            }
          }
        }
      } catch (err) { }

      // try {
      //   const iframeElem = document.querySelector('iframe[id="wcframable1-0"]');
      //   const iframeBody = iframeElem.contentWindow.document.body;
      //   let iframeImages = iframeBody.querySelectorAll('img');
      //   if (iframeImages && iframeImages.length > 0) {
      //     for (let i = 0; i < iframeImages.length; i++) {
      //       let img = iframeImages[i].src;
      //       images.push(img);
      //     }
      //   }
      //   let ifameTxt = iframeBody.innerText;
      //   ifameTxt = ifameTxt.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      //   manuFacturerDesc = manuFacturerDesc + ifameTxt;
      // } catch (err) {}
      if (images.length > 0) {
        for (let x = 0; x < images.length; x++) {
          addHiddenDiv(`manuf-images-${x}`, images[x]);
        }
      }
      if (manuFacturerDesc.length > 0) {
        addHiddenDiv('manufacturer-desc', manuFacturerDesc);
      }
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      return [`desc.length = ${manuFacturerDesc.length}`, `images : ${images.length}`];
    });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // await context.evaluate(async function () {
    //   const desc = document.querySelector('div.syndi_powerpage');
    //   if (desc) {
    //     let text = desc.shadowRoot.firstChild.innerText;
    //     text = text.replace('/g\n\s{1,}/', '');
    //   }
    // });
    await context.evaluate(async function () {
     try {
      const iframe = document.querySelector('[title="Product Videos"]');
      if (iframe) {
        const video = iframe.contentWindow.document.getElementsByTagName('video');
        const videoUrls = [...video].map(elm => elm.src);
        document.querySelector('head').setAttribute('video', videoUrls.join(''));
      } else {
        const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
        const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
        const data = await fetch(url);
        if (data.status === 200) {
          const json = await data.json();

          const arr = [];
          const array = json.widgets.widget;
          array.forEach(item => {
            const val = item.asset_id;
            const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
            arr.push(url);
          });
          let count = 0;
          arr.forEach(item => {
            document.querySelector('head').setAttribute(`vid${count}`, item);
            count++;
          });
        }
      }
    } catch (err) {}
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    var variantLength = await context.evaluate(async () => {
      return (document.querySelectorAll('div[id=theSwatches] a')) ? document.querySelectorAll('div[id=theSwatches] a').length : 0;
    });
    console.log('Variant Length', variantLength);
    if (variantLength >= 1) {
      try {
        for (let j = 0; j < variantLength; j++) {
          await context.evaluate(async (j) => {
            return document.querySelectorAll('div[id=theSwatches] a>img')[j].click();
          }, j);
  
          // await clickBtn(j);
          console.log('Inside variants', j);
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (j !== variantLength - 1) { await context.extract(productDetails, { transform }); }
        }
      } catch (err) {}
    }

    // async function clickBtn(index) {
    //   await context.evaluate(async (index) => {
    //     console.log('clicking btn for variants', index);
    //     try {
    //       const btn = document.querySelectorAll('div[id=theSwatches] a')[index];
    //       if (btn) {
    //         btn.click();
    //         console.log('Inside variants --- clicked for  ', index);
    //         await new Promise(resolve => setTimeout(resolve, 2000));
    //       }
    //     } catch (err) {
    //       console.log(err);
    //     }
    //   });
    // }
        async function preparePage () {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
          await context.evaluate(async () => {
            const iframe = document.querySelector('[title="Product Videos"]');
            if (iframe) {
              const video = iframe.contentWindow.document.getElementsByTagName('video');
              const videoUrls = [...video].map(elm => elm.src);
              document.querySelector('head').setAttribute('video', videoUrls.join(''));
            } else {
              const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
              const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
              const data = await fetch(url);
              if (data.status === 200) {
                const json = await data.json();

                const arr = [];
                const array = json.widgets.widget;
                array.forEach(item => {
                  const val = item.asset_id;
                  const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
                  arr.push(url);
                });
                let count = 0;
                arr.forEach(item => {
                  document.querySelector('head').setAttribute(`vid${count}`, item);
                  count++;
                });
              }
            }
          });
        } catch (err) {}
        }
        // await new Promise(resolve => setTimeout(resolve, 50000));
        // await context.evaluate(async function () {
        //   const arr = [];
        //   const videoLink = document.querySelector('.flix-jw') ? document.querySelector('.flix-jw').value.match(/file":"([^"]+)/)[1].replace(/^\\\/\\\//, '').replace(/\\\//g, '/') : '';
        //   if (videoLink !== '') {
        //     arr.push(videoLink);
        //   }
        //   document.querySelectorAll('#vjs_video_1_html5_api').forEach(item => {
        //     const videoUrl = item.getAttribute('src');
        //     arr.push(videoUrl);
        //   });
        //   const id = document.querySelector('#product-body-item-number') ? document.querySelector('#product-body-item-number').textContent.match(/(\d+)/g) : '';
        //   if (id !== '') {
        //     const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
        //     const data = await fetch(url);
        //     const json = await data.json();
        //     const array = json.widgets.widget;
        //     array.forEach(item => {
        //       const val = item.asset_id;
        //       const url = `https://d2vxgxvhgubbj8.cloudfront.net/videos/69/${val}_1_liveclicker.mp4`;
        //       arr.push(url);
        //     });
        //   }
        //   document.querySelector('body').setAttribute('videos', arr.join('|'));
        // });
    return await context.extract(productDetails, { transform });
  },
};
