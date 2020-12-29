
// module.exports.implementation = ({ productPageSelector = defaultproductPageSelector } = {}) =>
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails, Helpers } = dependencies;
  const helpers = new Helpers(context);
  const productPageSelector = "//main//div[contains(concat(' ',normalize-space(@class),' '),'par parsys')]//div[contains(concat(' ',normalize-space(@class),' '),'product-hero')]//text()";

  // first check that the page is a valid product page
  const isValidProductPage = await helpers.checkXpathSelector(productPageSelector);
  if (!isValidProductPage && productPageSelector) return; // exit without extracting anything

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

    // get the json object
    const jsonObj = window.dataLayer && window.dataLayer.primaryProduct ? window.dataLayer.primaryProduct : null;

    // try to get the brand from multiple different sources
    const tm = '™';
    let brandText = 'Dyson';
    const setBrand = (text) => {
      if (text && text.includes(tm)) brandText = text.split(tm)[0];
    };
    // setBrand(getSel('title', 'innerText'));
    setBrand(brandText);
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
      const lastChance = getXpath("//div[@data-title][contains(normalize-space(@data-title),'™ ')]/@data-title", 'nodeValue');
      // Remove leading 'The'
      const cleaned = lastChance ? lastChance.split('The ') : [];
      if (cleaned.length > 0) setBrand(cleaned[1]);
      else setBrand(lastChance);
    }

    addElementToDocument('added_brandtext', brandText);

    // add the sku
    if (jsonObj) {
      addElementToDocument('added_sku', jsonObj.globalProductSKU || jsonObj.localProductSKU);
      // get the colour as well
      if (jsonObj.color) addElementToDocument('added_color', jsonObj.color);
      else {
        const prodID = jsonObj.globalProductID;
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

    // deal with the price
    const listPrice = getXpath("(//div[@class='product-hero__price-top']/div[1])[1]", 'innerText');
    const price = getXpath("(//div[@class='product-hero__price-top']/div[@data-product-price])[1]", 'innerText');
    // if (!price){
    //   let priceElm = document.evaluate('//script[contains(@type,"application/ld+json")][contains(.,"Product")]', document, null, 7, null);
    //   if(priceElm.snapshotLength>0){
    //     let scriptText = priceElm.snapshotItem(0).textContent.trim();
    //     if(scriptText){
    //       const regex = /"price":\s+\"+(\d+\.*\d+)/g;
    //       let codeElm = {};
    //       let code = ""
    //       if(scriptText.includes("price"))
    //       {
    //       codeElm = [...scriptText.matchAll(regex)];
    //       // for(let match of codeElm)
    //       // {
    //       // console.log(match[1]);
    //       // code = match[1];
    //       // }
    //       if(scriptText.includes('USD')){
    //         code = "$"+(codeElm[0][1]);
    //       }

    //       console.log(code);
    //       price= code;
    //       } else {
    //       console.log("price not found");
    //       }
    //     }
    //   }
    // }
    // transform the price to avoid locale issue
    const localeCleaner = (price) => {
      // first remove all possible thousand spearators
      const charToRemove = [' ', '\'', String.fromCharCode(160)];
      const newDecimalSeparator = '.';
      const potentialDecSeparators = [',', '.'];
      let temp = charToRemove.reduce((acc, char) => acc.split(char).join(''), price || '');
      // remove the currency and other text
      temp = temp.replace(/[^0-9.,\s]/g, '');
      // deal with comma and dots
      let decimalFound = false;
      return temp.split('').reverse().reduce((acc, char) => {
        if (!decimalFound && potentialDecSeparators.includes(char)) {
          decimalFound = true;
          return `${acc}${newDecimalSeparator}`;
        }
        if (potentialDecSeparators.includes(char)) return acc;
        return `${acc}${char}`;
      }, '').split('').reverse().join('');
    };
    const getCurrency = (price) => {
      // all currencies symbols
      const currSymb = [
        'L',
        '$',
        'Դ',
        'ман',
        'Br',
        'Bs.',
        'P',
        'Лв.',
        'R$',
        '៛',
        '¥',
        '₡',
        'kn',
        'Kč',
        'kr',
        '£',
        '€',
        '¢',
        'Q',
        '₣',
        'Ft',
        'Rp',
        '₹',
        '﷼',
        '₪',
        'лв',
        'ksh',
        'د.ك',
        'MK',
        'RM',
        'DH',
        'Rs',
        'ر.ع.',
        'S/.',
        '₱',
        'zł',
        'QR',
        'p.',
        'ر.س',
        'Дин.',
        '₨',
        'S',
        'R',
        'CHF',
        'NT$',
        '฿',
        'TT$',
        '₺',
        '₴',
        'UZS',
        'Bs F',
        '₫',
      ];
      // keep only letters and currency symbols
      const letter = RegExp(/[a-zA-Z\s]/);
      const temp = (price || '').split('').filter(char => letter.test(char) || currSymb.includes(char)).join('');
      // split per groups of words and only returns the last one
      return temp.split(' ').filter(word => word).slice(-1);
    };
    const fixPrice = price => `${localeCleaner(price)}`;
    addElementToDocument('added_currency', getCurrency(price));
    addElementToDocument('added_price', fixPrice(price));
    if (listPrice !== price) addElementToDocument('added_listPrice', fixPrice(listPrice));

    // add the extended name
    brandText = brandText || 'Dyson';
    const name = getXpath("//h1[contains(concat(' ',normalize-space(@class),' '),' product-hero__line1 ')]", 'innerText');
    const variant = getXpath("(//div[contains(concat(' ',normalize-space(@class),' '),' product-hero ')]//div[contains(concat(' ',normalize-space(@class),' '),' swatches ')]//img)[1]/@alt", 'nodeValue');
    const prefix = name && name.includes(brandText) ? '' : brandText;
    addElementToDocument('added_nameExtended', `${prefix ? prefix + ' - ' : ''}${name}${variant ? ' - ' + variant : ''}`);

    // add the type of info the variants are on
    const varInfo = [...getSel('.product-hero .swatches > div', 'classList')] || [];
    if (varInfo[0]) {
      // addElementToDocument('added_variantinformation', varInfo[0].replace('swatches__', ''));
      addElementToDocument('added_variantinformation', getSel('.product-hero .swatches > div .swatches__color-id', 'innerText'));
    }

    // Get the manufacturer description
    const descr = "//div[@class='par parsys']/*[contains(concat(' ',normalize-space(@class),' '),' column-control') or (contains(concat(' ',normalize-space(@class),' '),' parbase ') and (contains(concat(' ',normalize-space(@class),' '),' full-widthimage ') or contains(concat(' ',normalize-space(@class),' '),' rich-content ') or contains(concat(' ',normalize-space(@class),' '),' text ') or contains(concat(' ',normalize-space(@class),' '),' container-par ')))][not(.//*[contains(concat(' ',normalize-space(@class),' '),' icon-arrow ')])]//*[contains(concat(' ',normalize-space(@class),' '),' h1 ') or contains(concat(' ',normalize-space(@class),' '),' h2 ') or contains(concat(' ',normalize-space(@class),' '),' h3 ') or contains(concat(' ',normalize-space(@class),' '),' h4 ') or contains(concat(' ',normalize-space(@class),' '),' h5 ') or contains(concat(' ',normalize-space(@class),' '),' h6 ') or contains(concat(' ',normalize-space(@class),' '),' body ') or contains(concat(' ',normalize-space(@class),' '),' js-text-body ') or contains(concat(' ',normalize-space(@class),' '),' typography-body ')]";
    const imgs = "//div[@class='par parsys']/*[contains(concat(' ',normalize-space(@class),' '),' column-control') or (contains(concat(' ',normalize-space(@class),' '),' parbase ') and (contains(concat(' ',normalize-space(@class),' '),' full-widthimage ') or contains(concat(' ',normalize-space(@class),' '),' rich-content ') or contains(concat(' ',normalize-space(@class),' '),' text ') or contains(concat(' ',normalize-space(@class),' '),' container-par ')))][not(.//*[contains(concat(' ',normalize-space(@class),' '),' icon-arrow ')])][not(contains(concat(' ',normalize-space(@class),' '),' recs-container '))]//img/@src";
    const otherDescription = "//div[contains(concat(' ',normalize-space(@class),' '),' product-specification ')]//li";
    addElementToDocument('added_productOtherInformation', getAllXpath(otherDescription, 'innerText').join(' '));
    addElementToDocument('added_manufacturerDescription', getAllXpath(descr, 'innerText').join(' '));
    addElementToDocument('added_manufacturerImages', getAllXpath(imgs));

    // Get the description bullets
    const descBullets = getAllXpath("//div[contains(concat(' ',normalize-space(@class),' '),' product-hero__text-wrapper ')]//*[contains(text(), '•')] | //div[contains(concat(' ',normalize-space(@class),' '),' product-hero__text-wrapper ')]//li", 'innerText')
      .map(b => b.split('•').join(''));
    addElementToDocument('added_descBullets', descBullets);

    // get the videos
    const videos = ' (//div[contains(concat(\' \',normalize-space(@class),\' \'),\' s7videoviewer \') and boolean(//div[contains(@class,"product-hero__button-container")]/a)])[1]/@data-video-src';
    addElementToDocument('added_videos', getAllXpath(videos, 'nodeValue').map(v => `${window.location.hostname}${v}`));
  });
  return await context.extract(productDetails, { transform: parameters.transform });
};
module.exports = { implementation };
