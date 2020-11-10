/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
      }

      if (row.description || row.descriptionTop) {
        let text = '';
        if(row.descriptionTop) {
          text = row.descriptionTop[0].text.replace(/\n/g, ' ');
        }
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(bullet => {
            text = text + ' || ' + bullet.text;
          });
        }
        if (row.description) {
          for (let i = 1; i < row.description.length; i++) {
            text = text + ' | ' + row.description[i].text.replace(/\n/g, ' ');
          }
          if(text) {
            text = `${text} | ${row.description[0].text}`
          } else {
            text = row.description[0].text
          }
        }
        row.description = [{
          text: text,
        }];
      }

      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/(\w+).*/,'$1')
        }]
      }

      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\s*\n\s\n)+/g, ': ')}`, '').slice(4),
        },
        ];
      }
      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.variants = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
     

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\n*\s\n)+/g, ' |');
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
};
module.exports = { transform };
