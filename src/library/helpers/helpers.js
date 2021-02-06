
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
        props: { innerHTML: await getFeatureSet(widget.items, widget.widgetType) },
        appendTo: mainDiv,
      };
      await createElement(contentSection);
      return mainDiv;
    }
    async function getFeatureSet (items, widgetType) {
      const mainDiv = await createElement({});
      if (widgetType === 'FeatureSet') {
        for (const feature of items[0].features) {
          if (!feature.assetType.match(/video/gi)) {
            if (feature.assetType === 'Image') {
              const img = {
                type: 'img',
                attributes: {
                  alt: feature.caption,
                  title: feature.caption,
                  width: 200,
                  height: 200,
                  src: feature.asset.url.replace('{0}', feature.asset.originalWidth),
                },
                appendTo: mainDiv,
              };
              await createElement(img);
              const caption = {
                attributes: { class: 'caption' },
                props: { innerText: feature.caption },
                appendTo: mainDiv,
              };
              await createElement(caption);
            }
            const description = {
              attributes: { class: 'description' },
              props: { innerHTML: feature.description },
              appendTo: mainDiv,
            };
            await createElement(description);
          }
        }
      }
      if (widgetType === 'VideoGallery') {
        for (const video of items) {
          const videoElement = {
            type: 'video',
            attributes: {
              alt: video.video.caption,
              title: video.video.caption,
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
            props: { innerText: video.video.caption },
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
      }
      return mainDiv.innerHTML;
    }
    async function addECWidgets (productID, pageId) {
      const json = await getJsonData(productID, pageId);
      if (!json) return false;
      const widgets = Object.values(Object.values(json.experiences)[0].experiences['power-page'].widgets);
      const enhancesContent = document.createElement('div');
      for (const widget of widgets) {
        const element = await getWidgetHtml(widget);
        enhancesContent.appendChild(element);
      }
      enhancesContent.id = 'added-ec2';
      // @TODO Should we retrun div instead?
      document.body.append(enhancesContent);
      return true;
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
    try {
      return await this.context.evaluate(addECWidgets, productID, pageId);
    } catch (error) {
      console.log('Error adding aplus widgets. Error: ', error);
    }
  }
};
