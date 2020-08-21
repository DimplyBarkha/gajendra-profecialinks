
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
      document.body.appendChild(catElement);
    }

    const getSel = (sel, prop) => {
      const el = document.querySelector(sel);
      if (prop && el) return el[prop];
      return el || '';
    };

    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      if (prop && elem && elem.singleNodeValue) return elem.singleNodeValue[prop];
      return elem ? elem.singleNodeValue : '';
    };

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
        while (index < words.length && !found) {
          const word = words[index];
          phrase.push(word);
          console.log(phrase);
          if (phrase.join(' ').toLowerCase().trim() !== 'dyson') {
            brand = phrase.join(' ') + tm;
            found = window.find(brand);
          }
          index++;
        }
        if (found) setBrand(brand);
      }
    } if (!brandText) {
      const lastChance = getXpath("//div[@data-title][contains(normalize-space(@data-title),'™ ')]/@data-title");
      // Remove leading 'The'
      const cleaned = lastChance ? lastChance.split('The ') : [];
      if (cleaned.length > 0) setBrand(cleaned[1]);
      else setBrand(lastChance);
    }

    addElementToDocument('added_brandtext', brandText);

    // add the sku
    if (window.dataLayer && window.dataLayer.primaryProduct) {
      const json = window.dataLayer.primaryProduct;
      addElementToDocument('added_sku', json.globalProductSKU);
      // get the colour as well
      if (json.color) addElementToDocument('added_color', json.color);
      else {
        const prodID = json.globalProductID;
        if (prodID) {
          const colorMapping = {
            Pu: 'Purple',
            Rd: 'Red',
            Ir: 'Iron',
            Co: 'Copper',
            Bu: 'Blue',
            Gd: 'Gold',
            Bk: 'Black',
            Nk: 'Nickel',
            Wh: 'White',
            Sv: 'Silver',
          };
          const shortColors = prodID.split(' ').slice(-1);
          if (shortColors.length > 0) {
            const colors = shortColors[0].split('/')
              .map(col => {
                if (col.length === 3 && col[0] === 'S') {
                  return colorMapping[col.slice(1)] || col.slice(1);
                }
                return colorMapping[col] || col;
              });
            addElementToDocument('added_color', colors.join('-'));
          }
        }
      }
    }

    // count the additional info addeed bullets
    const addiDescrp = document.querySelectorAll('.product-specification ul>li');
    addElementToDocument('added_description', addiDescrp.length);

    // count the number of variants
    const variants = document.querySelectorAll('.product-hero .swatches img');
    addElementToDocument('added_variantcount', variants.length || 1);

    // add the type of info the variants are on
    const varInfo = [...getSel('.product-hero .swatches > div', 'classList')] || [];
    if (varInfo[0]) {
      addElementToDocument('added_variantinformation', varInfo[0].replace('swatches__', ''));
    }
  });
  return await context.extract(productDetails, { transform: parameters.transform });
};
