
module.exports.Helpers = class {
  constructor (context) {
    this.context = context;
  }

<<<<<<< HEAD
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
=======
  // Function which adds an element to the document, if the element is an array it adds it as a list
  async addItemToDocument (key, value, { parentID = '', type = 'div', clss = '' } = {}) {
    const inputs = { key, value, parentID, type, clss };
    await this.context.evaluate((inputs) => {
      const addItemToDocument = ({ key, value, parentID, type, clss }) => {
        const keyPrefix = '';
        const id = `${keyPrefix}${key}`;
        const htmlString = `<${type} id="${id}" ${clss ? `class="${clss}" ` : ''}></${type}>`;
        const root = parentID ? document.querySelector(parentID) : document.body;
        root.insertAdjacentHTML('beforeend', htmlString);
        if (Array.isArray(value)) {
          const innerHTML = value.reduce((acc, val) => {
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
          document.querySelector(`#${id}`).innerHTML = innerHTML;
        } else {
<<<<<<< HEAD
          throw new Error('The provided values are not an array.');
        }
      };
      addArrayToDocument(inputs);
=======
          // This allows to remove all potential HTML markers from the text
          document.querySelector(`#${id}`).innerHTML = value;
          document.querySelector(`#${id}`).textContent = document.querySelector(`#${id}`).innerText;
        }
      };
      addItemToDocument(inputs);
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
    }, inputs);
  }

  // Function which easily adds the url to the document
  async addURLtoDocument (key, lastPartOnly) {
    const url = await this.context.evaluate(() => window.location.href);
<<<<<<< HEAD
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
=======
    const urlParts = url ? url.split('/').filter(str => str) : [];
    const partToAdd = lastPartOnly ? urlParts.slice(-1) : url;
    return this.addItemToDocument(key, partToAdd);
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkCSSSelector (selector, { catchError = false } = {}) {
    return await this.context.evaluate(({ selector, catchError }) => {
      try {
        const elem = document.querySelector(selector);
        return !!elem;
      } catch (error) {
        if (catchError) return false;
        throw error;
      }
    }, { selector, catchError });
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkXpathSelector (selector, { catchError = false } = {}) {
    return await this.context.evaluate(({ selector, catchError }) => {
      try {
        const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        return elem ? !!elem.singleNodeValue : false;
      } catch (error) {
        if (catchError) return false;
        throw error;
      }
    }, { selector, catchError });
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
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
<<<<<<< HEAD
  async checkSelector (selector, type) {
    let elemIsThere;
    if (type.toLowerCase() === 'xpath') elemIsThere = await this.checkXpathSelector(selector);
    else if (type.toLowerCase() === 'css') elemIsThere = await this.checkCSSSelector(selector);
=======
  async checkSelector (selector, type, { catchError = false } = {}) {
    let elemIsThere;
    if (type === 'xpath') elemIsThere = await this.checkXpathSelector(selector, { catchError });
    else if (type === 'css') elemIsThere = await this.checkCSSSelector(selector, { catchError });
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
    else return false;
    return elemIsThere;
  }

  // Function which checks if the provided object of selectors is there then navigate and click
<<<<<<< HEAD
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
=======
  async checkAndReturnProp (selector, type, property, { catchError = false } = {}) {
    if (!this.checkSelector(selector, type, { catchError })) return null;
    return await this.context.evaluate(({ selector, property, type, catchError }) => {
      try {
        let elem;
        if (type === 'xpath') elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
        if (type === 'css') elem = document.querySelector(selector);
        return elem[property];
      } catch (error) {
        if (catchError) return null;
        throw error;
      }
    }, { selector, property, type, catchError });
  }

  // Function which get an item, works on it if a callback is provided, then add it to the dom
  async getAndAddElem (selector, idToAddToDom, { property = 'innerText', callback = e => e } = {}) {
    const css = await this.checkAndReturnProp(selector, 'css', property, { catchError: true });
    const value = await this.checkAndReturnProp(selector, 'xpath', property, { catchError: true });
    console.log(`cssExtraction: ${css}, xpathExtraction: ${value}`);
    // parse the value according to the callback and add it to the dom
    return this.addItemToDocument(idToAddToDom, await callback(value));
>>>>>>> 04631a5eecdd82c5cf6541b852802c54e2201e92
  }
};
