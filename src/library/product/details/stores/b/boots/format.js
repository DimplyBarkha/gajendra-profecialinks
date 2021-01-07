/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;|&nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.countryOfOrigin) {
        if (row.countryOfOrigin[0].text.match(/Made in the/)) {
          row.countryOfOrigin = [
            {
              text: row.countryOfOrigin[0].text.replace(/Made in the\s*/, ''),
              xpath: row.countryOfOrigin[0].xpath,
            },
          ];
        }
      }
      if (row.allergyAdvice) {
        const text = row.allergyAdvice.map(elm => elm.text).join(' ');
        row.allergyAdvice = [
          {
            text: text,
            xpath: row.allergyAdvice[0].xpath,
          },
        ];
      }
      if (row.promotion) {
        const text = row.promotion.map(elm => elm.text).join('|');
        row.promotion = [
          {
            text: text,
            xpath: row.promotion[0].xpath,
          },
        ];
      }
      if (row.ingredientsList && row.ingredientsList.length) {
        const text = row.ingredientsList[0].text.match(/^.+?(?=<br><br>)/) ? row.ingredientsList[0].text.match(/^.+?(?=<br><br>)/)[0] : row.ingredientsList[0].text;
        const list = clean(text.replace(/<[^>]+>/g, ' ')).split(/,+(?![^(]*\))/g).map(elm => ({ text: elm }));
        const text2 = list.map(elm => elm.text).join(', ');
        row.ingredientsList = [
          {
            text: text2,
            xpath: row.ingredientsList[0].xpath,
          },
        ];
      }

      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text).join(' ');
        row.specifications = [
          {
            text: text,
            xpath: row.specifications[0].xpath,
          },
        ];
      }
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.startsWith(' || ') ? row.additionalDescBulletInfo[0].text : ' || ' + row.additionalDescBulletInfo[0].text;
        const text = row.additionalDescBulletInfo.map(elm => elm.text).join(' || ');
        row.additionalDescBulletInfo = [
          {
            text: text,
            xpath: row.additionalDescBulletInfo[0].xpath,
          },
        ];
      }

      if (row.warnings && Array.isArray(row.warnings)) {
        row.warnings = [{ text: row.warnings.map(el => el.text).join(' ') }];
      }
      if (row.storage && Array.isArray(row.storage)) {
        row.storage = [{ text: row.storage.map(el => el.text).join(' ') }];
      }

      if (!row.ingredientsList && row.backupIngredients) {
        row.ingredientsList = [{ text: row.backupIngredients[0].text }];
      }

      // if (row.pricePerUnitUom) {
      //     row.pricePerUnitUom.forEach(item => {
      //         item.text = item.text.substr(item.text.indexOf('r')+2)
      //     });
      // }

      // if (row.pricePerUnit) {
      //     row.pricePerUnit.forEach(item => {
      //         item.text = item.text.substr(item.text.indexOf('|')+2)
      //         item.text = item.text.substr(0,item.text.indexOf('p')-1)
      //     });
      // }

      if (row.quantity) {
        row.quantity.forEach(item => {
          item.text = item.text.substr(0, item.text.indexOf('|') - 1);
        });
      }

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.substr(item.text.indexOf(' ') + 1);
        });
      }

      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.slice(1).map((elm, index) => {
          elm.text = elm.text.replace(/wid=(\d*)&hei=(\d*)/, 'wid=1920&hei=1080');
          return { text: clean(elm.text) };
        });
      }

      row.secondaryImageTotal = [
        {
          text: (row.alternateImages && row.alternateImages.length) || '0',
          type: 'NUMBER',
          value: (row.alternateImages && row.alternateImages.length) || 0,
        },
      ];
      // if (row.color) {
      //   const text = row.nameExtended[0].text + ' - ' + row.color[0].text;
      //   row.nameExtended = [
      //     {
      //       text: text,
      //       xpath: row.color[0].xpath,
      //     },
      //   ];
      // }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.directions = [{ text }];
      }
      if (row.description) {
        const text = row.description.map(elm => elm.text.replace('...read more', '').replace('...read less', '')).join(' ');
        row.description = [
          {
            text: text,
            xpath: row.description[0].xpath,
          },
        ];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
