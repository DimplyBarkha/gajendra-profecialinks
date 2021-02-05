const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'costco',
    transform: transform,
    domain: 'costco.com',
  },
  // @ts-ignore
  // @ts-ignore
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await new Promise(resolve => setTimeout(resolve, 10000));

    await context.setBlockAds(false);
    await context.setLoadAllResources(true);
    await context.setAntiFingerprint(false);
    const timeout = parameters.timeout ? parameters.timeout : 30000;

    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div.flix-text-center>div.flix-btn-tech-ctrl');
      if (moreBtn && moreBtn.length > 0) {
        for (let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            // @ts-ignore
            moreBtn[cnt].click();
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (err) { }
        }
      }
    });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div input[name="view-more"]');
      if (moreBtn && moreBtn.length > 0) {
        for (let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            // @ts-ignore
            moreBtn[cnt].click();
            await new Promise(resolve => setTimeout(resolve, 4000));
          } catch (err) { }
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));
    await context.evaluate(async () => {
      const descNode = document.querySelector('div.product-info-description div#wc-aplus');
      let manuFacturerDesc = '';
      const images = [];
      if (descNode) {
        // @ts-ignore
        manuFacturerDesc = descNode.outerText;
        console.log('manuFacturerDesc ==', manuFacturerDesc);
        manuFacturerDesc = manuFacturerDesc.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
      }
      try {
        const descNode1 = document.querySelector('div.syndi_powerpage');
        await new Promise(resolve => setTimeout(resolve, 8000));
        if (descNode1 && descNode1.shadowRoot) {
          const fetchNode = descNode1.shadowRoot.firstChild;
          // @ts-ignore
          let text = fetchNode.innerText;
          text = text.replace(/\n{1,}"/g, ' ').replace(/\s{1,}"/g, ' ');
          manuFacturerDesc = manuFacturerDesc + text;
          // @ts-ignore
          const manImages = fetchNode.querySelectorAll('img');
          if (manImages && manImages.length > 0) {
            for (let i = 0; i < manImages.length; i++) {
              let img = manImages[i].src;
              img = img.replace('/240.', '/480.');
              images.push(img);
            }
          }
        }
      } catch (err) { }

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
    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      try {
        const iframe = document.querySelector('[title="Product Videos"]');
        if (iframe) {
          // @ts-ignore
          const video = iframe.contentWindow.document.getElementsByTagName('video');
          const videoUrls = [...video].map(elm => elm.src);
          document.querySelector('head').setAttribute('video', videoUrls.join(''));
        } else {
          let id = document.querySelector('p[id="product-body-item-number"]') ? document.querySelector('p[id="product-body-item-number"]').textContent.match(/(\d+)/g) : '';
          id = id[0];
          const url = 'https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=' + id + '&format=json';
          // const url = `https://cors-anywhere.herokuapp.com/https://sc.liveclicker.net/service/api?method=liveclicker.widget.getList&account_id=69&dim5=${id}&format=json`;
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
            addHiddenDiv('videos', arr[0]);
          }
        }
      } catch (err) {}
    });
    await context.evaluate(async function () {
      try {
        const vidImage = Array.from(document.querySelectorAll('img[id*="videoOverlay"]'));
        for (let item = 0; item < vidImage.length; item++) {
          // @ts-ignore
          vidImage[item].click();
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (err) {}
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    var variantLength1 = await context.evaluate(async () => {
      return (document.querySelectorAll('span[role="radiogroup"] label')) ? document.querySelectorAll('span[role="radiogroup"] label').length : 0;
    });
    console.log('Variant Length1', variantLength1);

    await new Promise(resolve => setTimeout(resolve, 1000));
    var variantLength = await context.evaluate(async () => {
      return (document.querySelectorAll('div[id=theSwatches] a')) ? document.querySelectorAll('div[id=theSwatches] a').length : 0;
    });

    // const check = await context.evaluate(async () => {
    //   return document.querySelector('div[id=theSwatches][class=hide]') ? 1 : 0;
    // });
    console.log('Variant Length', variantLength);
    if (variantLength >= 1 && variantLength1 >= 1) {
      try {
        for (let j = 0; j < variantLength; j++) {
          await context.evaluate(async (j) => {
            // @ts-ignore
            return document.querySelectorAll('div[id=theSwatches] a>img')[j].click();
          }, j);
          await new Promise(resolve => setTimeout(resolve, 1000));
          for (let k = 0; k < variantLength1; k++) {
            await context.evaluate(async (k) => {
              // @ts-ignore
              return document.querySelectorAll('span[role="radiogroup"] label')[k].click();
            }, k);

            // await clickBtn(j);
            console.log('Inside variants', k);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (k !== variantLength1 - 1) {
              await context.extract(productDetails, { transform });
            }
          }

          // await clickBtn(j);
          console.log('Inside variants', j);
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (j === 0) {
            await context.extract(productDetails, { transform });
          }
          // if (j !== variantLength - 1) { await context.extract(productDetails, { transform }); }
        }
      } catch (err) {}
    } else {
      if (variantLength >= 1 && variantLength1 === 0) {
        for (let k = 0; k < variantLength; k++) {
          await context.evaluate(async (k) => {
            // @ts-ignore
            return document.querySelectorAll('div[id=theSwatches] a>img')[k].click();
          }, k);

          // await clickBtn(j);
          console.log('Inside variants', k);
          await new Promise(resolve => setTimeout(resolve, 1000));
          if (k !== variantLength - 1) {
            await context.extract(productDetails, { transform });
          }
        }
      } else {
        if (variantLength1 >= 1 && variantLength === 0) {
          for (let k = 0; k < variantLength1; k++) {
            await context.evaluate(async (k) => {
              // @ts-ignore
              return document.querySelectorAll('span[role="radiogroup"] label')[k].click();
            }, k);

            // await clickBtn(j);
            console.log('Inside variants', k);
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (k !== variantLength1 - 1) {
              await context.extract(productDetails, { transform });
            }
          }
        }
      }
    }

    try {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const listPrice = Array.from(document.querySelectorAll('div[class="online-price active"] span[class*="op-value"], div[class="online-price active"] span[class*="currency"]'));
        const myPrice = Array.from(document.querySelectorAll('div[class="math-table"] div[id="pull-right-price"] span[class="value"], div[class="math-table"] div[id="pull-right-price"] span[class="currency"]'));
        if (listPrice && listPrice.length > 0 && myPrice && myPrice.length > 0) {
          const newListPrice = listPrice[0].innerHTML + listPrice[1].innerHTML;
          const newMyPrice = myPrice[0].innerHTML + myPrice[1].innerHTML;
          if (newListPrice !== newMyPrice && (newMyPrice.includes('-') === false)) {
            addHiddenDiv('listPrice', newListPrice);
          }
        }
      });
    } catch (e) {
      console.log(e);
    };

    try {
      await context.evaluate(async () => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        const description = document.querySelector('div[class="features-container form-group"]');
        const manufacturerDesc = document.querySelector('div.product-info-description div#wc-aplus');
        const desc = description && description.innerHTML ? description.innerHTML : '';
        const manuDesc = manufacturerDesc && manufacturerDesc.innerHTML ? manufacturerDesc.innerHTML : '';
        // console.log('description->', desc);
        // console.log('manudescription->', manuDesc);
        if (!desc && desc.length === 0 && !manuDesc && manuDesc.length === 0) {
          const newDescription = Array.from(document.querySelectorAll('div[class*="product-info-description"]'));
          // @ts-ignore
          const newDesc = newDescription && newDescription.length > 0 ? newDescription[0].innerText : '';
          // @ts-ignore
          console.log('array->', newDescription[0].innerText);
          if (newDesc && newDesc.length > 0) {
            // console.log('newDesc', newDesc);
            addHiddenDiv('addDesc', newDesc);
          }
        } else if (desc && desc.length > 0) {
          const newDescription = Array.from(document.querySelectorAll('div[class*="product-info-description"]'));
          // @ts-ignore
          const newDesc = newDescription && newDescription.length > 0 ? description.innerText + newDescription[0].innerText : '';
          // console.log('array->', newDescription[0].innerText);
          if (newDesc && newDesc.length > 0) {
            // console.log('newDesc', newDesc);
            addHiddenDiv('addDesc', newDesc);
          }
        }

        const similarItemsList = document.querySelectorAll('#mbox-recommend .hl-product');
        const hasComparisionTable = false;
        const updpList = [];

        if (similarItemsList.length) {
          // @ts-ignore
          for (const item of similarItemsList) {
            const title = item.querySelector('.caption .description') ? item.querySelector('.caption .description').innerText : null;

            if (title) {
              updpList.push(title);
            }
          }
        }

        const recommendedProducts = document.querySelectorAll('#viewItem-Carousel .hl-product');

        // @ts-ignore
        for (const item of recommendedProducts) {
          const title = item.querySelector('.caption .description') ? item.querySelector('.caption .description').innerText : null;

          if (title) {
            updpList.push(title);
          }
        }

        for (const item of updpList) {
          const newEl = document.createElement('import-updp');
          newEl.innerText = item;
          document.body.appendChild(newEl);
        }

        document.body.setAttribute('import-comparision-table', hasComparisionTable ? 'Yes' : 'No');

        const descEl = document.querySelector('.syndi_powerpage');

        if (descEl) {
          const newEl = document.createElement('import-custom-description');
          newEl.appendChild(descEl.shadowRoot);
          document.body.appendChild(newEl);
        }
      });
    } catch (e) {
      console.log(e);
    };
    // @ts-ignore
    // @ts-ignore
    async function preparePage () {
      await new Promise(resolve => setTimeout(resolve, 1000));
      try {
        await context.evaluate(async () => {
          const iframe = document.querySelector('[title="Product Videos"]');
          if (iframe) {
            // @ts-ignore
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
    await context.evaluate(async () => {
      const moreBtn = document.querySelectorAll('div input[name="view-more"]');
      if (moreBtn && moreBtn.length > 0) {
        for (let cnt = 0; cnt < moreBtn.length; cnt++) {
          try {
            // @ts-ignore
            moreBtn[cnt].click();
            await new Promise(resolve => setTimeout(resolve, 2000));
          } catch (err) { }
        }
      }
    });
    await context.evaluate(async () => {
      const parentNode1 = document.querySelector('div.syndi_powerpage');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (parentNode1 && parentNode1.shadowRoot && parentNode1.shadowRoot.firstChild) {
        const fetchNode = parentNode1.shadowRoot.firstChild;
        // @ts-ignore
        const allVideos = Array.from(fetchNode.querySelectorAll('video'));
        for (let item = 0; item < allVideos.length; item++) {
          allVideos[item].click();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });
    let id = '';
    await context.evaluate(async () => {
      const parentNode1 = document.querySelector('div[class="syndigo-mosaic-outer syndigo-shadowed-mosaic"]');
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (parentNode1 && parentNode1.shadowRoot && parentNode1.shadowRoot.firstChild) {
        const fetchNode = parentNode1.shadowRoot.firstChild;
        // @ts-ignore
        const VideoButton = fetchNode.querySelector('button[class="syndigo-mosaic-ribbon-eye syndigo-mosaic-iconbutton"]');
        VideoButton.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // @ts-ignore
        const VideoButton2 = fetchNode.querySelector('button[class="syndigo-mosaic-ribbon-internal syndigo-mosaic-iconbutton"] path[fill d="M512 903 q94 0 177 -36 q83 -35 145 -97 q62 -62 97 -145 q36 -83 36 -177 q0 -94 -36 -177 q-35 -83 -97 -145 q-62 -62 -145 -97 q-83 -36 -177 -36 q-94 0 -177 36 q-83 35 -145 97 q-62 62 -97 145 q-36 83 -36 177 l0 0 q0 94 36 177 q35 83 97 145 q62 62 145 97 q83 36 177 36 l0 0 ZM512 960 q-106 0 -199 -40 q-94 -40 -163.5 -109.5 q-69.5 -69.5 -109.5 -163.5 q-40 -93 -40 -199 q0 -106 40 -199 q40 -94 109.5 -163.5 q69.5 -69.5 163.5 -109.5 q93 -40 199 -40 q106 0 199 40 q94 40 163.5 109.5 q69.5 69.5 109.5 163.5 q40 93 40 199 l0 0 q0 106 -40 199 q-40 94 -109.5 163.5 q-69.5 69.5 -163.5 109.5 q-93 40 -199 40 l0 0 ZM341 732 l474 -284 l-474 -284 l0 568 l0 0 Z"]');
        VideoButton2.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // @ts-ignore
        const VideoButton3 = fetchNode.querySelector('button[class="syndigo-video-big-play-button"]');
        VideoButton3.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
        // @ts-ignore
        const VideoId = fetchNode.querySelector('video');
        id = VideoId.id;
      }
    });
    /// /////////////////////////////////////////////////////////////////////////////////////////////////
    //  GOTO enhanced content approach
    //  Get Enhanced HTML.
    // async function getEnhancedHtmlJS () {
    //   if (id) {
    //     // const id = url.match(/(\d+).p\?/)[1];
    //     await context.goto('https://content.syndigo.com/', { checkBlocked: false });
    //     return await context.evaluate(async (id) => {
    //       // const api = `https://scontent.webcollage.net/bestbuy/power-page?ird=true&channel-product-id=${id}`;
    //       const api = `https://content.syndigo.com/assets/${id}`;

    //       const response = await fetch(api);
    //       const text = await response.text();
    //       return text;
    //       // return text.match(/html\s*:\s*"([^\n]+)/)[1].replace(/"$/, '').replace(/\\/g, '');
    //     }, id);
    //   }
    //   return false;
    // }
    // let enhacnedContentJS;
    // try {
    //   enhacnedContentJS = await getEnhancedHtmlJS();
    // } catch (error) {
    //   console.log('error getting enhanced content');
    // }
    // const url = window.location.href;
    // await context.goto(`${url}&intl=nosplash#[!opt!]{"block_ads":false,"anti_fingerprint":false,"first_request_timeout":60,"load_timeout":30,"load_all_resources":true,"enable_cache":false,"discard_CSP_header":true}[/!opt!]`, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    // // Get Enhanced HTML.
    // if (enhacnedContentJS) {
    //   await context.evaluate((enhacnedContentJS) => {
    //     eval(enhacnedContentJS);
    //     // @ts-ignore
    //     const html = window._wccontent.aplus.html;
    //     const newDiv = document.createElement('div');
    //     newDiv.id = 'webcollage-content';
    //     newDiv.innerHTML = html;
    //     document.body.appendChild(newDiv);
    //     function getIframeHTML (parentIFrame) {
    //       if (parentIFrame.tagName === 'IFRAME') {
    //         parentIFrame = parentIFrame.contentDocument;
    //       }
    //       const iframes = Array.from(parentIFrame.querySelectorAll('iframe'));
    //       console.log(iframes);
    //       for (const iframe of iframes) {
    //         const html = getIframeHTML(iframe);
    //         iframe.parentElement.innerHTML = html;
    //       }
    //       if (parentIFrame.querySelector('html')) {
    //         return parentIFrame.querySelector('html').outerHTML;
    //       }
    //     }
    //     getIframeHTML(document.querySelector('#webcollage-content'));
    //     Array.from(document.querySelectorAll('#webcollage-content .wc-json-data')).forEach(elm => elm.remove());
    //   }, enhacnedContentJS);
    // }
    /// ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // SearchForRequest for getting video urls
    var videoRequest = await context.searchForRequest('https://content.syndigo.com/asset/.*ts', 'GET');
    if (videoRequest && videoRequest.url) {
      console.log('videos-------->', videoRequest.url);
      await context.evaluate((videoRequest) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('videos1', videoRequest.url);
      }, videoRequest);
    }
    var videoRequest1 = await context.searchForRequest('https://content.syndigo.com/asset/.*m3u8', 'GET');
    if (videoRequest1 && videoRequest1.url) {
      console.log('videos-------->', videoRequest1.url);
      await context.evaluate((videoRequest1) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
        addHiddenDiv('videos2', videoRequest1.url);
      }, videoRequest);
    }
    return await context.extract(productDetails, { transform });
  },
};
