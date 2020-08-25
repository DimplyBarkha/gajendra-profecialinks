
module.exports.implementation = async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
      if (Array.isArray(value)) {
        const innerHTML = value.reduce((acc, val) => {
          return `${acc}<li>${val}</li>`;
        }, '<ul>') + '</ul>';
        catElement.innerHTML = innerHTML;
      } else {
        catElement.textContent = value;
      }
    }

    const getSel = (sel, prop) => {
      const el = document.querySelector(sel);
      if (prop && el) return el[prop];
      return el || '';
    };

    const getXpath = (xpath, prop) => {
      const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
      let result;
      if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
      else result = elem ? elem.singleNodeValue : '';
      return result && result.trim ? result.trim() : result;
    };

    const getAllXpath = (xpath, prop) => {
      const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const result = [];
      for (let index = 0; index < nodeSet.snapshotLength; index++) {
        const element = nodeSet.snapshotItem(index);
        if (element) result.push(prop ? element[prop] : element.nodeValue);
      }
      return result;
    };

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
      let imgSrc;
      try {
        imgSrc = getSel('.product-hero__motif-container img', 'src')
          .split('/').slice(-1)[0].split('?')[0].split(/[-_]/).join(' ');
      } catch (error) {} // can't use image source
      if (!brandText && (imgAlt || imgSrc)) {
        const newSrc = imgAlt || imgSrc;
        const words = newSrc.split(' ');
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
      addElementToDocument('added_sku', json.globalProductSKU || json.localProductSKU);
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
              .reduce((acc, col) => {
                if (col.length === 3 && col[0] === 'S' && colorMapping[col.slice(1)]) {
                  return [...acc, colorMapping[col.slice(1)]];
                } else if (colorMapping[col]) return [...acc, colorMapping[col]];
                return acc;
              }, []);
            addElementToDocument('added_color', colors.length > 0 ? colors.join('-') : '');
          }
        }
      }
    }

    // add the extended name
    const name = getXpath("//h1[contains(concat(' ',normalize-space(@class),' '),' product-hero__line1 ')]", 'innerText');
    const variant = getXpath("(//div[contains(concat(' ',normalize-space(@class),' '),' product-hero ')]//div[contains(concat(' ',normalize-space(@class),' '),' swatches ')]//img)[1]/@alt");
    const prefix = name && name.includes(brandText) ? '' : brandText;
    addElementToDocument('added_nameExtended', `${prefix ? prefix + ' - ' : ''}${name}${variant ? ' - ' + variant : ''}`);

    // add the type of info the variants are on
    const varInfo = [...getSel('.product-hero .swatches > div', 'classList')] || [];
    if (varInfo[0]) {
      addElementToDocument('added_variantinformation', varInfo[0].replace('swatches__', ''));
    }

    // Get the manufacturer description
    const descr = "//div[@class='par parsys']/*[contains(concat(' ',normalize-space(@class),' '),' column-control') or (contains(concat(' ',normalize-space(@class),' '),' parbase ') and (contains(concat(' ',normalize-space(@class),' '),' full-widthimage ') or contains(concat(' ',normalize-space(@class),' '),' rich-content ') or contains(concat(' ',normalize-space(@class),' '),' text ') or contains(concat(' ',normalize-space(@class),' '),' container-par ')))][not(.//*[contains(concat(' ',normalize-space(@class),' '),' icon-arrow ')])]//*[contains(concat(' ',normalize-space(@class),' '),' h1 ') or contains(concat(' ',normalize-space(@class),' '),' h2 ') or contains(concat(' ',normalize-space(@class),' '),' h3 ') or contains(concat(' ',normalize-space(@class),' '),' h4 ') or contains(concat(' ',normalize-space(@class),' '),' h5 ') or contains(concat(' ',normalize-space(@class),' '),' h6 ') or contains(concat(' ',normalize-space(@class),' '),' body ') or contains(concat(' ',normalize-space(@class),' '),' js-text-body ') or contains(concat(' ',normalize-space(@class),' '),' typography-body ')]";
    const imgs = "//div[@class='par parsys']/*[contains(concat(' ',normalize-space(@class),' '),' column-control') or (contains(concat(' ',normalize-space(@class),' '),' parbase ') and (contains(concat(' ',normalize-space(@class),' '),' full-widthimage ') or contains(concat(' ',normalize-space(@class),' '),' rich-content ') or contains(concat(' ',normalize-space(@class),' '),' text ') or contains(concat(' ',normalize-space(@class),' '),' container-par ')))][not(.//*[contains(concat(' ',normalize-space(@class),' '),' icon-arrow ')])][not(contains(concat(' ',normalize-space(@class),' '),' recs-container '))]//img/@src";
    addElementToDocument('added_manufacturerDescription', getAllXpath(descr, 'innerText').join(' '));
    addElementToDocument('added_manufacturerImages', getAllXpath(imgs));
  });
  return await context.extract(productDetails, { transform: parameters.transform });
};
