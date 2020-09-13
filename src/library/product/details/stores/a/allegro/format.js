/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityText = row.availabilityText.map((item) => {
          return item.text;
        });
        if (availabilityText[0].includes('kup teraz')) {
          row.availabilityText = [{ text: 'In Stock' }];
        }
      }
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        const uniqueVariants = Array.from(new Set(variantArray));
        row.variants = [{ text: uniqueVariants.join(' | ') }];
        row.varaintCount = [{ text: uniqueVariants.length }];
      }
      if (row.shippingInfo) {
        const shippingInfoArray = row.shippingInfo.map((item) => {
          return item.text.replace(/\n/g, '');
        });
        row.shippingInfo = [{ text: shippingInfoArray.join(' || ') }];
      }
      if (row.productOtherInformation) {
        const otherInformation = row.productOtherInformation.map((item) => {
          return item.text.replace('\n', '');
        });
        row.productOtherInformation = [{ text: otherInformation.join(' || '), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.specifications) {
        if (row.specifications) {
          row.specifications = [{ text: row.specifications.map((item) => item.text.replace(/:\n/g, ': ').replace(/\n/g, ' || ')).join(' || ') }];
        }
      }
      if (row.shippingDimensions) {
        const shippingDimensions = row.shippingDimensions.map((item) => {
          return item.text;
        });
        row.shippingDimensions = [{ text: shippingDimensions.join('x') }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfo.join(' | '), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.brandText) {
        const brandTextArray = row.brandText.map((item) => {
          return item.text.replace('\n', '').match(/(.*?:)(.*)/)[2];
        });
        if (brandTextArray) {
          row.brandText = [{ text: brandTextArray.join('') }];
        }
      }
      if (row.color) {
        const colorArray = row.color.map((item) => {
          return item.text.replace(/u002F/g, '');
        });
        if (colorArray) {
          row.color = [{ text: colorArray.join('') }];
        }
      }
      // if (row.category) {
      //   row.category.shift();
      //   const categoryArray = row.category.map((item) => {
      //     return item.text;
      //   });
      //   const uniqueItems = Array.from(new Set(categoryArray));
      //   if (uniqueItems) {
      //     row.category = [{ text: uniqueItems.join(' > ') }];
      //   }
      // }
      if (row.price) {
        const priceRow = row.price.map((item) => {
          return item.text.replace('.', ',');
        });
        row.price = [{ text: priceRow.join(''), xpath: priceRow[0].xpath }];
      }
      if (row.description) {
        const rowData = row.description.map((item) => {
          return item.text ? JSON.parse(item.text) : {};
        });
        // @ts-ignore
        let description = '';
        if (rowData && rowData.length) {
          rowData[0].standardized.sections.forEach(itemsObj => {
            if (itemsObj && itemsObj.items.length) {
              itemsObj.items.forEach(element => {
                if (element.type === 'TEXT') {
                  if (!description.length) {
                    const firstOccuranceIndex = element.content.search(/<h1>/) + 1;
                    description += element.content.substr(0, firstOccuranceIndex).replace(/<h1>/, '') + element.content.slice(firstOccuranceIndex).replace(/<h1>/, '|').replace(/li/, '||').replace(/(<([^>]+)>)/ig, '');
                  } else {
                    description += element.content.replace(/<h1>/, '|').replace(/li/, '||').replace(/(<([^>]+)>)/ig, '').replace(/\n/g, '');
                  }
                }
              });
            }
          });
        }
        row.description = [{ text: description.replace(/(<([^>]+)>)/ig, ''), xpath: row.description && row.description[0].xpath }];
      }
    }
  }

  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
