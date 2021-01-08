// this is a module containing some ready made functions
// to use it do the following in extract.js
/*
//at the bottom of the file, add the following in the module.exports object:
dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    helperModule: 'module:helpers/helpers',
  },

//inside the implementation function
  const { helperModule: { Helpers } } = dependencies;
  const helper = new Helpers(context);

  // you can now use any of the function like that
  helper.function()

*/

module.exports.Helpers = class {
  constructor (context) {
    this.context = context;
  }

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
    if (type === 'xpath') elemIsThere = await this.checkXpathSelector(selector);
    else if (type === 'css') elemIsThere = await this.checkCSSSelector(selector);
    else return false;
    return elemIsThere;
  }

  // Function which checks if the provided object of selectors is there then navigate and click
  async checkAndReturnProp (selector, type, property) {
    if (!this.checkSelector(selector, type)) return;
    return await this.context.evaluate(({ selector, property, type }) => {
      let elem;
      if (type === 'xpath') elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      else if (type === 'css') elem = document.querySelector(selector);
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

  // Function which allows to wait for an element within an iframe or a shadowroot
  async waitForInDifferentContext (selector, documentSelector, options) {
    const { timeout = Number(options) ? options : 500 } = options || {};
    console.log('..waitForLoader..:', documentSelector);
    const waitingTime = 500;
    const limit = Math.ceil(timeout / waitingTime);
    const rootIsThere = await this.context.evaluate((docSel) => {
      const docOrIframe = document.querySelector(docSel);
      const doc = docOrIframe.contentDocument || docOrIframe.shadowRoot || docOrIframe;
      console.log('=====================');
      console.log(`the document context node is iframe ${!!docOrIframe.contentDocument}, shadowRoot: ${!!docOrIframe.shadowRoot}, elem: ${!!docOrIframe}`);
      console.log(doc);
      console.log('=====================');
      return !!doc;
    }, documentSelector);
    if (!rootIsThere) {
      console.log('Root document for waiting loop is not there.');
      return false;
    }
    let loopCounter = 0;
    let isThere = false;
    while (loopCounter < limit && !isThere) {
      loopCounter += 1;
      isThere = await this.context.evaluate(([sel, docSel]) => {
        const docOrIframe = document.querySelector(docSel);
        const doc = docOrIframe.contentDocument || docOrIframe.shadowRoot || docOrIframe;
        console.log(`Checking if the following selector is there: ${sel}`);
        return !!doc.querySelector(sel);
      }, [selector, documentSelector]);
      await new Promise(resolve => setTimeout(resolve, waitingTime));
    }
    console.log(`The wait for selector ${selector} within context ${documentSelector} returned ${isThere}`);
    return isThere;
  };

  // Check if an iframe fully loaded
  async waitForFrameToLoad (selector, options) {
    const { timeout = Number(options) ? options : 500, selectorType: type = 'css' } = options || {};
    if (!this.checkSelector(selector, type)) return false;
    const waitingTime = 500;
    const limit = Math.ceil(timeout / waitingTime);
    let loopCounter = 0;
    let isLoaded = false;
    while (loopCounter < limit && !isLoaded) {
      loopCounter += 1;
      isLoaded = await this.context.evaluate((sel) => {
        const docOrIframe = document.querySelector(sel);
        const doc = docOrIframe.contentDocument || docOrIframe; // does not support shadowRoot
        return doc.readyState === 'complete';
      }, selector);
      console.log(`Checking if the following frame selector is loaded: ${selector}, -> ${isLoaded}`);
      await new Promise(resolve => setTimeout(resolve, waitingTime));
    }
    return isLoaded;
  }
};
