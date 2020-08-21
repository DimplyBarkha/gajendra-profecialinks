
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;

  await context.evaluate(async function () {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.appendChild(catElement);
    }

    const getSel = (sel, prop) => {
      const el = document.querySelector(sel);
      if (prop && el) return el[prop];
      return el || '';
    };

    const getXpath =

    const description = document.querySelectorAll('.product-hero__text-wrapper ul>li');
    addElementToDocument('added_description', description.length);

    // try to get the brand from multiple different sources
    const tm = '™';
    let brandText;
    const setBrand = (text) => {
      if (text && text.includes(tm)) brandText = text.split(tm)[0];
    };
    setBrand(getSel('title', 'innerText'));
    if (!brandText) {
      const lastCat = [...new Set([...document.querySelectorAll('.breadcrumb li')].map(i => i.innerText.trim()))].slice(-1)[0];
      setBrand(lastCat);
    }
    if (!brandText) {
      const imgAlt = getSel('.product-hero__motif-container img', 'alt');
      setBrand(imgAlt);
      if (!brandText && imgAlt) {
        const words = imgAlt.split(' ');
        const phrase = [];
        let found = false;
        let index = 0;
        let brand;
        while (index < words.length || !found) {
          phrase.push(words[index]);
          brand = phrase.join(' ') + tm;
          found = window.find(brand);
        }
        if (found) setBrand(brand);
      }
    } if (!brandText) {
      
    }
    // div[@data-title][contains(normalize-space(@data-title),'™ ')]/@data-title
    addElementToDocument('added_brandText', brandText);
  });
  return await context.extract(productDetails, { transform: parameters.transform });
};
