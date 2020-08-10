
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
          document.querySelector(id).innerHTML = innerHTML;
        } else {
          // This allows to remove all potential HTML markers from the text
          document.querySelector(id).innerHTML = value;
          document.querySelector(id).textContent = document.querySelector(id).innerText;
        }
      };
      addItemToDocument(inputs);
    }, inputs);
  }

  // Function which easily adds the url to the document
  async addURLtoDocument () {
    const url = this.context.evaluate(() => window.location.href);
    await this.addItemToDocument('added-searchurl', url);
  }
};
