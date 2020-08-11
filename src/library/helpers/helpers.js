
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
    const url = this.context.evaluate(() => window.location.href);
    const urlParts = url ? url.split('/') : [];
    if (lastPartOnly) return await this.addItemToDocument(key, urlParts[urlParts.length - 1]);
    await this.addItemToDocument(key, url);
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkCSSSelector (selector) {
    return await context.evaluate((selector) => {
      const elem = document.querySelector(selector);
      return elem || false;
    }, selector);
  }

  // Function which easily checks if a selector exists, and returns it, or returns false
  async checkXpathSelector (selector) {
    return await context.evaluate((selector) => {
      const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      return elem ? elem.singleNodeValue : false;
    }, selector);
  }

  // Function which checks if a substring is in the url
  async checkURLFor (substring) {
    const url = this.context.evaluate(() => window.location.href);
    return url.includes(substring);
  }

  // Function which checks if the provided object of selectors is there then navigate and click
  async checkAndClick (selector, type, timeout, input) {
    let elem;
    if (type === 'xpath') elem = await this.checkXpathSelector(selector);
    else if (type === 'css') elem = await this.checkCSSSelector(selector);
    else return false;
    await Promise.all([
      this.context.waitForNavigation({ timeout }),
      !input ? this.context.click(elem) : this.context.setInputValue(elem, input),
    ]);
    return elem;
  }

  // Function which checks if the provided object of selectors is there then navigate and click
  async checkAndReturnProp (selector, type, property) {
    let elem;
    if (type === 'xpath') elem = await this.checkXpathSelector(selector);
    else if (type === 'css') elem = await this.checkCSSSelector(selector);
    else return false;
    return elem[property];
  }
};
