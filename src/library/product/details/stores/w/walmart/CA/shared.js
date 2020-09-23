
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.ratingCount) {
        let text = '';
        let xpath = '';
        row.ratingCount.forEach(item => {
          text = item.text.replace('(', '');
          text = text.replace(')', '');
          xpath = item.xpath;
        });
        row.ratingCount = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.image) {
        row.image.length = 1;
      }

      if (row.imageAlt) {
        row.imageAlt.length = 1;
      }

      if (row.aggregateRating) {
        let text = '';
        let xpath = '';
        row.aggregateRating.forEach(item => {
          text = parseFloat(item.text).toFixed(1);
          xpath = item.xpath;
        });
        row.aggregateRating = [
          {
            text: text,
            xpath: xpath,
          },
        ];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          text += item.text.trim() + ' || ';
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
        const searchRegExp = /•/g;
        const replaceWith = '||';
        row.specifications.forEach((item, index) => {
          text = item.text.replace(searchRegExp, replaceWith);
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.variants) {
        let text = '';
        const searchRegExp = /,/g;
        const replaceWith = '|';
        row.variants.forEach((item, index) => {
          text = item.text.replace(searchRegExp, replaceWith);
        });
        row.variants = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.availabilityText) {
        let newText = '';
        row.availabilityText.forEach(item => {
          if (item.text.includes('Add to cart')) {
            newText = 'In Stock';
          } else {
            newText = item.text;
          }
        });
        row.availabilityText = [
          {
            text: newText,
          },
        ];
      }

      if (row.category && row.nameExtended) {
        const shortArray = [];
        row.category.forEach(item => {
          if (!item.text.includes('Walmart.ca') && !item.text.includes('Home') && !item.text.includes(row.nameExtended[0].text)) {
            shortArray.push({
              text: item.text.replace('›', ''),
            });
          }
        });
        row.category = shortArray;
      }

      if (row.warranty) {
        let text = '';
        row.warranty.forEach(item => {
          text = row.warranty.map(elm => elm.text).join(' | ');
        });
        row.warranty = [
          {
            text: text,
          },
        ];
      }

      if (row.variantInformation) {
        let text;
        row.variantInformation.forEach(item => {
          text = row.variantInformation.map(elm => elm.text).join(' | ');
        });
        row.variantInformation = [
          {
            text: text,
          },
        ];
      }

      if (row.alternateImages && row.image) {
        const shortArray = [];
        row.alternateImages.forEach(item => {
          if (item.text !== row.image[0].text) {
            shortArray.push(item);
          }
        });
        row.alternateImages = shortArray;
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
