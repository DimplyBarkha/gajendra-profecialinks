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

    // await context.setBlockAds(false);
    // await context.setLoadAllResources(true);
    // await context.setAntiFingerprint(false);
    // const timeout = parameters.timeout ? parameters.timeout : 30000;

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
            addHiddenDiv('videos123', arr[0]);
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

    // Syndigo API1 code to append enhanced content.
    const productID = await context.evaluate(async () => {
      const ProductUrl = document.querySelector('meta[property="og:url"][content]');
      let id = ProductUrl.content;
      id = id.split('product.');
      id = id[1].split('.');
      id = id[0];
      return id;
    });
    const pageId1 = 'costco';
    const pageId2 = '08b9b8e2-abe6-42d5-af6d-995ce9ff38e5';
    // @ts-ignore
    async function syndigoAPI1 (productID, pageId) {
      async function appendData (productID, pageId) {
        const api = `https://scontent.webcollage.net/${pageId}/power-page?ird=true&channel-product-id=${productID}`;
        // api.allorigins.win to avoid cors
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(api)}`);
        // const response = await fetch(api);
        const text = (await response.json()).contents;
        //   const text = await response.text();
        if (text.match(/terminatePowerPage/) || !text.match(/_wccontent/)) {
          console.log('Enhanced content not found');
          return false;
        }
        // eslint-disable-next-line no-eval
        eval(text.replace('document.getElementsByTagName(\'head\')[0].appendChild(_wcscript);', '//document.getElementsByTagName(\'head\')[0].appendChild(_wcscript);')); // might fail if response doesnt has the data.
        // add HTM Content
        const div = document.createElement('div');
        div.id = 'added-ec1';
        // @ts-ignore
        div.innerHTML = window._wccontent.aplus.html;
        // @TODO Should we retrun div instead?
        document.body.append(div);
        return true;
      }
      try {
      // @ts-ignore
        return await context.evaluate(appendData, productID, pageId);
      } catch (error) {
        console.log('Enhanced content not found. Error: ', error);
      }
    }
    await syndigoAPI1(productID, pageId1);

    // Syndigo API2 code to append enhanced content.
    async function syndigoAPI2 (productID, pageId) {
      async function appendData(productID, pageId) {
        async function createElement ({ type = 'div', styles = {}, attributes = {}, props = {}, appendTo }) {
          const element = document.createElement(type);
          for (const key in styles) { element.style[key] = styles[key]; }
          for (const key in attributes) { element.setAttribute(key, attributes[key]); }
          for (const key in props) { element[key] = props[key]; }
          appendTo && appendTo.append(element);
          return element;
        }
        async function getWidgetHtml (widget) {
          const mainDiv = await createElement({});
          const headerSection = {
            type: 'h2',
            attributes: { class: 'syndigo-widget-section-header' },
            props: { innerText: widget.headerText },
            appendTo: mainDiv,
          };
          await createElement(headerSection);
          const contentSection = {
            attributes: { class: 'syndigo-featureset' },
            props: { innerHTML: await getFeatureSet(widget, widget.widgetType) },
            appendTo: mainDiv,
          };
          await createElement(contentSection);
          return mainDiv;
        }
        async function getFeatureSet (widget, widgetType) {
          const mainDiv = await createElement({});
          if (widgetType === 'FeatureSet' || widgetType === 'InteractiveTour') {
            for (const item of widget.items) {
              const features = item.productImage ? [{ assetType: 'Image', asset: item.productImage }, ...item.features] : item.features;
              for (const feature of features) {
                if (!feature.assetType.match(/video/gi)) {
                  if (feature.assetType === 'Image') {
                    const img = {
                      type: 'img',
                      attributes: {
                        alt: feature.caption || '',
                        title: feature.caption || '',
                        width: 200,
                        height: 200,
                        src: feature.asset.url.replace('{0}', feature.asset.originalWidth > 1920 ? (feature.asset.availableWidths && feature.asset.availableWidths[0] || 1920) : feature.asset.originalWidth),
                      },
                      appendTo: mainDiv,
                    };
                    await createElement(img);
                    const caption = {
                      attributes: { class: 'caption' },
                      props: { innerText: feature.caption || '' },
                      appendTo: mainDiv,
                    };
                    await createElement(caption);
                  }
                  if (feature.description) {
                    const description = {
                      attributes: { class: 'description' },
                      props: { innerHTML: feature.description },
                      appendTo: mainDiv,
                    };
                    await createElement(description);
                  }
                }
              }
            }
          } else if (widgetType === 'VideoGallery') {
            for (const video of widget.items) {
              const videoElement = {
                type: 'video',
                attributes: {
                  alt: video.video.caption || '',
                  title: video.video.caption || '',
                },
                appendTo: mainDiv,
              };
              const url = video.video.sources[0].url;
              if (url.match(/m3u8/)) {
                const response = await fetch(url);
                const text = await response.text();
                videoElement.attributes.src = url.replace(/playlist.m3u8/, text.match(/[^\n]+.m3u8/)[0]);
              }
              const caption = {
                attributes: { class: 'caption' },
                props: { innerText: video.video.caption || '' },
                appendTo: mainDiv,
              };
              await createElement(caption);
              await createElement(videoElement);
              const description = {
                attributes: { class: 'description' },
                props: { innerHTML: video.description },
                appendTo: mainDiv,
              };
              await createElement(description);
            }
          } else if (widgetType === 'ComparisonTable') {
            const keys = [{ image: widget.tableImageUrl }, ...Object.values(widget.features).map(elm => ({ text: elm.caption }))];
            const imageSize = widget.tableImageUrl ? widget.tableImageUrl.match(/(\d+)\.[^\.]+$/)[1] : '240';
            let products = widget.products.map((elm) => ({ title: elm.columnTitle, image: elm.imageUrl.replace('{0}', imageSize), feature: elm.featureDetails }));
            products = products.map(product => ([{ image: product.image, text: product.title }, ...product.feature.map(f => ({ text: f.text }))]));

            const tableData = [keys, ...products];
            const transpose = tableData[0].map((_, colIndex) => tableData.map(row => row[colIndex]));

            const CTR = await createElement({ attributes: { id: 'ctr-table' }, styles: { overflow: 'auto' } });
            const table = await createElement({ type: 'table', styles: { width: '100%' }, attributes: { border: 1, cellspacing: 0, cellpadding: 5 }, appendTo: CTR });
            const tbody = await createElement({ type: 'tbody', appendTo: table });
            for (let index = 0; index < transpose.length; index++) {
              const element = transpose[index];
              const row = await createElement({ type: 'tr', appendTo: tbody });
              for (const column of element) {
                const columnType = index === 0 ? 'th' : 'td';
                const col = await createElement({ type: columnType, appendTo: row });
                column.image && await createElement({ type: 'img', styles: { 'object-fit': 'contain' }, attributes: { alt: column.text || '', height: 150, width: 150, src: column.image }, appendTo: col });
                column.text && await createElement({ props: { innerHTML: column.text }, appendTo: col });
              }
            };
            return CTR.outerHTML;
          } else if (widgetType === 'DocumentGallery') {
            const div = await createElement({ appendTo: mainDiv });
            const ul = await createElement({ type: 'ul', attributes: { class: 'wc-document-gallery' }, appendTo: div });
            for (const item of widget.items) {
              const image = item.image && item.image.url.replace('{0}', item.image.originalWidth > 1920 ? '1920' : item.image.originalWidth);
              const caption = item.caption || '';
              const description = item.description || '';
              const pageCount = item.pageCount || 0;
              const contentLength = item.contentLength && Math.round(item.contentLength / 1024) || 0;
              const file = item.url || '';
              const type = file && file.match(/[^\.]+$/)[0].toUpperCase() || '';
              const html = `<h3 style="display: none;" class="wc-doc-title-above">${caption}</h3>
            <a class="wc-document-view-link wc-document-view-link-with-image wc-doc-thumb" href=${file} target="_blank">
              <img alt=View ${caption} ${type} src=${image}>
            </a>
            <div class="wc-doc-text">
              <div>
                <h3 class="wc-doc-title">Use &amp; Care Guide</h3>
                <div class="wc-document-description">${description}</div>
                <div>
                  <a class="wc-document-view-link"
                    href=${file}
                    target="_blank" rel="nofollow">View<span style="display: none;" class="syndigo-visually-hidden">${caption} ${type}</span></a>
                  <span class="wc-separator">|</span>
                  <a class="wc-document-download-link" download="download"
                    href=${file}
                    rel="nofollow">Download<span style="display: none;" class="syndigo-visually-hidden">${caption} ${type}</span></a>
                </div>
                <div>
                  <svg width="20" height="20">
                    <image xlink:href="https://content.syndigo.com/asset/icons/file-pdf.svg" width="20"
                      height="20"></image>
                  </svg>
                  <small>${contentLength} KB<span style="display: none">, ${pageCount} pages</span></small>
                </div>
              </div>
            </div>`;
              await createElement({ type: 'li', attributes: { class: 'wc-doc-wrapper wc-doc-trio' }, props: { innerHTML: html }, appendTo: ul });
            }
          } else if (widgetType === 'FreeFormHtml') {
            const div = {
              props: { innerHTML: widget.html },
              appendTo: mainDiv,
            };
            await createElement(div);
          } else if (widgetType === 'ThreeSixty') {
            for (const item of widget.items) {
              const img = {
                type: 'img',
                attributes: {
                  alt: item.alt || '',
                  title: item.alt || '',
                  width: 200,
                  height: 200,
                  src: item.url.replace('{0}', item.originalWidth > 1920 ? (item.availableWidths && item.availableWidths[0] || 1920) : item.originalWidth),
                },
                appendTo: mainDiv,
              };
              await createElement(img);
            }
          }
          return mainDiv.innerHTML;
        }
        async function getJsonData (productID, pageId) {
          const api = `https://content.syndigo.com/page/${pageId}/${productID}.json`;
          const response = await fetch(api);
          const json = await response.json();
          if (Object.keys(json).length) {
            return json;
          }
          return false;
        }
        async function addECWidgets (productID, pageId) {
          const json = await getJsonData(productID, pageId);
          if (!json) return false;
          const widgets = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences)).filter(elm => elm.widgets)
          const powerPage = widgets.find(elm => elm.experienceType === 'power-page');
          const heroPage = widgets.find(elm => elm.experienceType === 'hero');
          const powerPageContent = document.createElement('div');
          const heroPageContent = document.createElement('div');
          for (const widget of Object.values(powerPage.widgets)) {
            const element = await getWidgetHtml(widget);
            powerPageContent.appendChild(element);
          }
          powerPageContent.id = 'added-ec2';
          // @TODO Should we retrun div instead?
          document.body.append(powerPageContent);
          for (const widget of Object.values(heroPage.widgets)) {
            const element = await getWidgetHtml(widget);
            heroPageContent.appendChild(element);
          }
          heroPageContent.id = 'added-hero';
          // @TODO Should we retrun div instead?
          document.body.append(heroPageContent);
          return true;
        }
        return await addECWidgets(productID, pageId);
      }
      try {
        return await context.evaluate(appendData, productID, pageId);
      } catch (error) {
        console.log('Error adding aplus widgets. Error: ', error);
      }
    }
    await syndigoAPI2(productID, pageId2);
    // SearchForRequest for getting video urls
    // var videoRequest = await context.searchForRequest('https://content.syndigo.com/asset/.*ts', 'GET');
    // if (videoRequest && videoRequest.url) {
    //   console.log('videos-------->', videoRequest.url);
    //   await context.evaluate((videoRequest) => {
    //     function addHiddenDiv (id, content) {
    //       const newDiv = document.createElement('div');
    //       newDiv.id = id;
    //       newDiv.textContent = content;
    //       newDiv.style.display = 'none';
    //       document.body.appendChild(newDiv);
    //     }
    //     addHiddenDiv('videos1', videoRequest.url);
    //   }, videoRequest);
    // }
    return await context.extract(productDetails, { transform });
  },
};
