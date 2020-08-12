
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

  for (const { group } of data) {
    for (const row of group) {
      // Hack: Escaping new lines in the text
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += `${item.text} `;
        });
        text = text.replace(/\n/g, ' ');
        row.directions = [
          {
            text: `${row.directionsTitle ? row.directionsTitle[0].text.trim() : ''} ${text.trim()} ${row.servingSuggest ? '|| ' + row.servingSuggest[0].text.trim() : ''}`.trim(),
          },
        ];
        delete row.directionsTitle;
        delete row.servingSuggest;
      } else if (row.servingSuggest) {
        row.directions = [
          {
            text: row.servingSuggest[0].text.trim(),
          },
        ];
      }

      if (row.availabilityText) {
        for (const item of row.availabilityText) {
          if (item.text.includes('Out of Stock')) {
            delete row.price;
          }
        }
      }

      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += `${item.text}, `;
        });
        row.allergyAdvice = [
          {
            text: text.slice(0, -2),
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `|| ${item.text} `;
        });
        row.description = [
          {
            text: `${text.trim()}`,
          },
        ];
      }

      if (row.descriptionExtended) {
        let text = '';
        row.descriptionExtended.forEach(item => {
          text += `${item.text} `;
        });
        text = text.trim();
        if (row.description) {
          row.description = [
            {
              text: `${row.description[0].text} ${text}`,
            },
          ];
        } else {
          row.description = [
            {
              text: `${text}`,
            },
          ];
        }
        delete row.descriptionExtended;
      }

      if (row.descriptionAdditional) {
        let text = '';
        row.descriptionAdditional.forEach(item => {
          text += `|| ${item.text} `;
        });
        text = text.trim();
        if (row.description) {
          row.description = [
            {
              text: `${row.description[0].text} ${text}`,
            },
          ];
        } else {
          row.description = [
            {
              text: `${text}`,
            },
          ];
        }
        delete row.descriptionAdditional;
      }

      if (row.description) {
        row.additionalDescBulletInfo = row.description;
      }

      if (row.image) {
        if (row.image[0].text.match(/no-image/ig) && !row.image[0].text.match(/http/ig)) {
          row.image[0].text = `https://www.bestwaywholesale.co.uk${row.image[0].text}`;
        }
      }

      if (!row.ingredientsList && row.ingredientsList2) {
        row.ingredientsList = row.ingredientsList2;
      }

      if (row.ingredientsList) {
        if (row.ingredientsList[0].text.match(/sodium/ig)) {
          let sodiumPerServing = row.ingredientsList[0].text.split('Sodium')[1];
          if (sodiumPerServing) {
            sodiumPerServing = sodiumPerServing.substr(0, sodiumPerServing.indexOf(', ')).replace(/:/g, '').trim();
          }
          row.sodiumPerServing = [
            {
              text: sodiumPerServing,
            },
          ];
          row.sodiumPerServingUom = [
            {
              text: '(mg/L)',
            },
          ];
        }
        if (row.ingredientsList[0].text.match(/magnesium/ig)) {
          let magnesiumPerServing = row.ingredientsList[0].text.split('Magnesium')[1];
          if (magnesiumPerServing) {
            magnesiumPerServing = magnesiumPerServing.substr(0, magnesiumPerServing.indexOf(', ')).replace(/:/g, '').trim();
            if (magnesiumPerServing[magnesiumPerServing.length - 1] === '.') {
              magnesiumPerServing = magnesiumPerServing.substring(0, magnesiumPerServing.length - 1);
            }
          }
          row.magnesiumPerServing = [
            {
              text: magnesiumPerServing,
            },
          ];
          row.magnesiumPerServingUom = [
            {
              text: '(mg/L)',
            },
          ];
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
