/* eslint-disable camelcase */
const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'fetch',
    transform: cleanUp,
    domain: 'fetch.co.uk',
    zipcode: '',
  },

  // @ts-ignore
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    // const sectionsDiv = 'div.bv-content-list-container div[itemprop="aggregateRating"] meta[itemprop="reviewCount"]';
    // await context.waitForSelector(sectionsDiv, { timeout: 9000 });

    await context.evaluate(async function () {
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      var added_ratingCount = '';
      var added_aggregateRating = '';
      const ratingCount = getXpath("//dl[@class='bv-stars-container']//div[@class='bv-histogram-target']//span", 'innerText');
      if (ratingCount !== null) {
        added_ratingCount = ratingCount;
      }
      const aggregateRating = getXpath("//dl[@class='bv-stars-container']//span[@class='bv-rating-ratio-count']//span[@itemprop='reviewCount']", 'innerText');
      if (aggregateRating !== null) {
        added_aggregateRating = aggregateRating;
      }
      console.log(ratingCount + '.......' + aggregateRating);
      //= =======Append a UL and LI tag append the variant info in the DOM | Start============

      function setAttributes (el, attrs) {
        for (var key in attrs) {
          el.setAttribute(key, attrs[key]);
        }
      }

      function getSize (size) {
        if (size !== '' && size !== undefined) {
          var sizeArray = size.split(' ');
          var sizeValue = '';
          if (sizeArray[sizeArray.length - 1] === 'pack') {
            sizeValue = sizeArray[sizeArray.length - 3] + ' ' + sizeArray[sizeArray.length - 2] + ' ' + sizeArray[sizeArray.length - 1]; ;
          } else {
            sizeValue = sizeArray[sizeArray.length - 1];
          }
          return sizeValue;
        }
      }

      function getSizePack (size) {
        if (size !== '' && size !== undefined) {
          var sizeArray = size.split(' ');
          var sizeValue = '';
          if (sizeArray[sizeArray.length - 1] === 'pack') {
            sizeValue = sizeArray[sizeArray.length - 3] + ' ' + sizeArray[sizeArray.length - 2] + ' ' + sizeArray[sizeArray.length - 1]; ;
          }
          return sizeValue;
        }
      }

      function stripHtml (html) {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      }

      function getStock (variants) {
        if (variants) {
          if (variants.availability.availabilityType.toLocaleLowerCase() === 'limited') {
            return 'In Stock';
          } else if (variants.availability.availabilityType.toLocaleLowerCase() === 'available') {
            return 'In Stock';
          } else if (variants.availability.availabilityType.toLocaleLowerCase() === 'mixed') {
            return 'In Stock';
          } else {
            return 'Out Of Stock';
          }
        } else {
          return 'Out Of Stock';
        }
      }

      function getDescription (variants, type) {
        var htmlview = '';
        if (variants) {
          const description = variants.content;

          if (description.length) {
            for (let i = 0; i < description.length; i++) {
              if (type === 'description' && description[i].title.toLocaleLowerCase() === 'description' && description[i].title !== undefined) {
                htmlview = stripHtml(description[i].content);
              } else if (type === 'ingredients' && description[i].title.toLocaleLowerCase() === 'ingredients' && description[i].title !== undefined) {
                htmlview = stripHtml(description[i].content);
              } else if (type === 'instructions' && description[i].title.toLocaleLowerCase() === 'instructions' && description[i].title !== undefined) {
                htmlview = stripHtml(description[i].title) + ' ' + stripHtml(description[i].content);
              } else if (type === 'benefits' && description[i].title.toLocaleLowerCase() === 'key benefits' && description[i].title !== undefined) {
                htmlview = stripHtml(description[i].title) + ' ' + stripHtml(description[i].content);
              } else if (type === 'recommended' && description[i].title.toLocaleLowerCase() === 'recommended for' && description[i].title !== undefined) {
                htmlview = stripHtml(description[i].title) + ' ' + stripHtml(description[i].content);
              }
            }
          }
        }
        return htmlview;
      }

      function variantDetails (variants) {
        var variantsValues = '';
        if (variants) {
          if (variants.length > 1) {
            var count = 1;
            for (let i = 0; i < variants.length; i++) {
              variantsValues += variants[i].sku;
              if (count !== variants.length) {
                variantsValues += ' | ';
              }
              count++;
            }
          }
        }
        return variantsValues;
      }

      function savingInformation (saving) {
        var savingText = '';
        if (saving !== '' && saving !== undefined) {
          // console.log(saving.amount.amount);
          if (saving.amount.amount > 0) {
            savingText += 'You save: £' + saving.amount.amount;
          }
          if (saving.percentage > 0) {
            savingText += '(' + saving.percentage + '%)';
          }
        }
        return savingText;
      }

      function alternateImages (images) {
        if (images !== '' && images !== undefined) {
          var imgArray = [];
          if (images.length > 1) {
            for (let i = 1; i < images.length; i++) {
              imgArray.push('https:' + images[i].url);
            }
            return imgArray.join('|');
          }
        }
      }

      function variantcount (totalcount) {
        if (totalcount) {
          return totalcount;
        } else {
          return '';
        }
      }

      function firstvariant (totalcount, sku) {
        var values = '';
        if (totalcount > 1) {
          values = sku;
        }
        return values;
      }

      function variantinformation (size, totalcount) {
        var sizeValue = '';
        if (totalcount > 1) {
          if (size !== '' && size !== undefined) {
            var sizeArray = size.split(' ');
            if (sizeArray[sizeArray.length - 1] === 'pack') {
              sizeValue = sizeArray[sizeArray.length - 3] + ' ' + sizeArray[sizeArray.length - 2] + ' ' + sizeArray[sizeArray.length - 1]; ;
            } else {
              sizeValue = sizeArray[sizeArray.length - 1];
            }
          }
        }
        return sizeValue;
      }

      function variantId (sku, totalcount) {
        var values = '';
        if (totalcount) {
          values = sku;
        }
        return values;
      }

      function getlistPrice (prices, currency) {
        var listprice = '';
        if (prices !== '' && prices !== undefined) {
          if (prices.rrp !== '' && prices.rrp !== undefined) {
            listprice = currency + ' ' + prices.rrp.amount;
          }
        }
        return listprice;
      }

      function getUnitCode (variant) {
        var uom = '';
        if (variant) {
          if (variant.unitPrice !== undefined && variant.unitPrice.code !== undefined) {
            var price_per_unit_uom = variant.unitPrice.code;
            price_per_unit_uom = price_per_unit_uom.split(' ');
            if (price_per_unit_uom.length > 0) {
              uom = price_per_unit_uom[price_per_unit_uom.length - 1];
            }
          }
        }
        return uom;
      }

      function unitPriceFun (variant) {
        var unitprice = '';
        if (variant) {
          if (variant.unitPrice !== undefined && variant.unitPrice.price !== undefined && variant.unitPrice.price.amount !== undefined) {
            unitprice = variant.unitPrice.price.amount;
          }
        }
        return unitprice;
      }

      const jsonData = getXpath("//script[@id='__NEXT_DATA__']", 'innerText');
      var jsonParse = JSON.parse(jsonData);
      console.log(jsonParse);
      // console.log(jsonParse.props.pageProps.productGroup.children);
      const variants = jsonParse.props.pageProps.productGroup.children;
      const targetElement = document.querySelector('body');
      const newUl = document.createElement('ul');
      newUl.id = 'variantsadd';
      targetElement.appendChild(newUl);

      const ul = document.querySelector('#variantsadd');
      try {
        if (variants.length) {
          for (let i = 0; i < variants.length; i++) {
            const listItem = document.createElement('li');

            setAttributes(listItem, {

              sk_sku: jsonParse.query.sku ? jsonParse.query.sku : '',
              sk_nameextended: variants[i].name ? variants[i].name : '',
              sk_productUrl: variants[i].url ? 'https://fetch.co.uk' + variants[i].url : '',
              sk_availabilityText: getStock(variants[i]),
              sk_description: getDescription(variants[i], 'description'),
              sk_ingredients: getDescription(variants[i], 'ingredients'),
              sk_benefits: getDescription(variants[i], 'benefits'),
              sk_recommended: getDescription(variants[i], 'recommended'),
              sk_brand: variants[i].brand.name ? variants[i].brand.name : '',
              sk_unit_price: unitPriceFun(variants[i]),
              sk_unit_currency: variants[i].prices.final.currency ? variants[i].prices.final.currency : '',
              sk_unit_code: getUnitCode(variants[i]),
              sk_listPrice: getlistPrice(variants[i].prices, variants[i].prices.final.currency),
              sk_price: variants[i].prices.final.amount ? 'GBP ' + variants[i].prices.final.amount : '',
              sk_saving: savingInformation(variants[i].prices.saving),
              sk_image: variants[i].images ? 'https:' + variants[i].images[0].url : '',
              sk_image_alt: variants[i].images[0].altText,
              sk_variantdetails: variantDetails(variants),
              sk_alternateimages: alternateImages(variants[i].images),
              sk_size: variants[i].name ? getSize(variants[i].name) : '',
              sk_pack_size: variants[i].name ? getSizePack(variants[i].name) : '',
              sk_variantinformation: variants[i].name ? variantinformation(variants[i].name, variants.length) : '',
              sk_variantcount: variantcount(variants.length),
              sk_firstvariant: firstvariant(variants.length, jsonParse.query.sku),
              sk_instructions: getDescription(variants[i], 'instructions'),
              sk_aggregaterating: added_aggregateRating,
              sk_ratingcount: added_ratingCount,
              sk_variantid: variantId(variants[i].sku, variants.length),
            });
            ul.appendChild(listItem);
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-throw-literal
        throw '........API Needs a change.........' + err;
      }
      //= =======Append a UL and LI tag append the variant info in the DOM | End==============
    });
    return await context.extract(productDetails, { transform: transformParam });
  },
};
