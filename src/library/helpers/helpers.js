
module.exports.Helpers = class {
  constructor (context) {
    this.context = context;
  }

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
            return `${acc}<li>${val}</li>`;
          }, '<ul>') + '</ul>';
          document.querySelector(`#${id}`).innerHTML = innerHTML;
        } else {
          // This allows to remove all potential HTML markers from the text
          document.querySelector(`#${id}`).innerHTML = value;
          document.querySelector(`#${id}`).textContent = document.querySelector(`#${id}`).innerText;
        }
      };
      addItemToDocument(inputs);
    }, inputs);
  }

  // Function which easily adds the url to the document
  async addURLtoDocument (key, lastPartOnly) {
    const url = await this.context.evaluate(() => window.location.href);
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
  async checkSelector (selector, type, { catchError = false } = {}) {
    let elemIsThere;
    if (type === 'xpath') elemIsThere = await this.checkXpathSelector(selector, { catchError });
    else if (type === 'css') elemIsThere = await this.checkCSSSelector(selector, { catchError });
    else return false;
    return elemIsThere;
  }

  // Function which checks if the provided object of selectors is there then navigate and click
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
  }
};
