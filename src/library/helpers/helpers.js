
module.exports.Helpers = class {
  constructor (context) {
    this.context = context;
  }

  // this file is invoked by writting the following:
  // const { Helpers } = require('../../../../../../helpers/helpers');
  // const helper = new Helpers(context)
  // helper.function()

  // Function which adds an element to the document
  async addItemToDocument (key, value, { parentID = '', type = 'div', clss = '' } = {}) {
    const inputs = { key, value, parentID, type, clss };
    await this.context.evaluate((inputs) => {
      const addItemToDocument = ({ key: id, value, parentID, type, clss }) => {
        const htmlString = `<${type} id="${id}" ${clss ? `class="${clss}" ` : ''}></${type}>`;
        const root = parentID ? document.querySelector(parentID) : document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        // This allows to remove all potential HTML markers from the text
        document.querySelector(`#${id}`).innerHTML = value;
        document.querySelector(`#${id}`).textContent = document.querySelector(`#${id}`).innerText;
      };
      addItemToDocument(inputs);
    }, inputs);
  }

  // Function which adds an array to the document as a list
  async addArrayToDocument (key, values, { parentID = '', type = 'div', clss = '' } = {}) {
    const inputs = { key, values, parentID, type, clss };
    await this.context.evaluate((inputs) => {
      const addArrayToDocument = ({ key: id, values, parentID, type, clss }) => {
        const htmlString = `<${type} id="${id}" ${clss ? `class="${clss}" ` : ''}></${type}>`;
        const root = parentID ? document.querySelector(parentID) : document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        if (Array.isArray(values)) {
          const innerHTML = values.reduce((acc, val) => {
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
          document.querySelector(`#${id}`).innerHTML = innerHTML;
        } else {
          throw new Error('The provided values are not an array.');
        }
      };
      addArrayToDocument(inputs);
    }, inputs);
  }

  // Function which easily adds the url to the document
  async addURLtoDocument (key, lastPartOnly) {
    const url = await this.context.evaluate(() => window.location.href);
    const urlParts = url ? url.split('/') : [];
    if (lastPartOnly) return await this.addItemToDocument(key, urlParts[urlParts.length - 1]);
    await this.addItemToDocument(key, url);
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkCSSSelector (selector) {
    return await this.context.evaluate((selector) => {
      const elem = document.querySelector(selector);
      return !!elem;
    }, selector);
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkXpathSelector (selector) {
    return await this.context.evaluate((selector) => {
      const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      return elem ? !!elem.singleNodeValue : false;
    }, selector);
  }

  // Function which checks if a substring is in the url
  async checkURLFor (substring) {
    const url = this.context.evaluate(() => window.location.href);
    return url.includes(substring);
  }

  // Function which checks if the provided object of selectors is there then navigate and click
  async checkAndClick (selector, type, timeout, input) {
    if (!this.checkSelector(selector, type)) return;
    await Promise.all([
      this.context.waitForNavigation({ timeout }),
      !input ? this.context.click(selector) : this.context.setInputValue(selector, input),
    ]).catch(e => {});// do nothing if an error arise
  }

  // Function which checks a selecor
  async checkSelector (selector, type) {
    let elemIsThere;
    if (type.toLowerCase() === 'xpath') elemIsThere = await this.checkXpathSelector(selector);
    else if (type.toLowerCase() === 'css') elemIsThere = await this.checkCSSSelector(selector);
    else return false;
    return elemIsThere;
  }

  // Function which checks if the provided object of selectors is there then navigate and click
  async checkAndReturnProp (selector, type, property) {
    if (!this.checkSelector(selector, type)) return;
    return await this.context.evaluate(({ selector, property, type }) => {
      let elem;
      if (type.toLowerCase() === 'xpath') elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      else if (type.toLowerCase() === 'css') elem = document.querySelector(selector);
      return elem[property];
    }, { selector, property, type });
  }

  // Function which makes a click
  async ifThereClickOnIt (selector) {
    try {
      await this.context.waitForSelector(selector, { timeout: 5000 });
    } catch (error) {
      console.log(`The following selector was not found: ${selector}`);
      return false;
    }
    const hasItem = await this.context.evaluate((selector) => {
      return document.querySelector(selector) !== null;
    }, selector);
    if (hasItem) {
      // try both click
      try {
        await this.context.click(selector, { timeout: 2000 });
      } catch (error) {
        // context click did not work and that is ok
      }
      await this.context.evaluate((selector) => {
        const elem = document.querySelector(selector);
        if (elem) elem.click();
      }, selector);
      return true;
    }
    return false;
  }

  // Syndigo API1 code to append enhanced content.
  async syndigoAPI1 (productID, pageId) {
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
      div.innerHTML = window._wccontent.aplus.html;
      // @TODO Should we retrun div instead?
      document.body.append(div);
      return true;
    }
    try {
      return await this.context.evaluate(appendData, productID, pageId);
    } catch (error) {
      console.log('Enhanced content not found. Error: ', error);
    }
  }

  // Syndigo API2 code to append enhanced content.
  async syndigoAPI2 (productID, pageId) {
    async function appendData (productID, pageId) {
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
        const widgets = Object.values(Object.values(Object.values(json.experiences).find(elm => elm.hasOwnProperty('experiences')).experiences)).filter(elm => elm.widgets);
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
      return await this.context.evaluate(appendData, productID, pageId);
    } catch (error) {
      console.log('Error adding aplus widgets. Error: ', error);
    }
  }
};
