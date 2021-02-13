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

      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/(\w+).*/, '$1'),
        }];
      }

      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\s*\n\s\n)+/g, ': ')}`, '').slice(4),
        },
        ];
      }

      // if (row.manufacturerDescription) {
      //   row.manufacturerDescription = [{
      //     text: row.manufacturerDescription.reduce((item, currentItem) => `${item} | ${currentItem.text.replace(/(\s*\n\s\n)+/g, ': ')}`, '').slice(2),
      //   },
      //   ];
      // }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text + ' ';
        });
        row.manufacturerDescription = [{ text: text.trim() }];
      }
      if (!row.manufacturerDescription && row.manufacturerDescription1 && row.manufacturerDescription1.length > 0) {
        let text = '';
        row.manufacturerDescription1.forEach(item => {
          text += item.text + ' ';
        });
        row.manufacturerDescription1 = [{ text: text.trim() }];
        row.manufacturerDescription = row.manufacturerDescription1;
      }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/(\n*\s\n)+/g, ' |');
      }

      if (row.category) {
        // const text = '';
        let arr = [];
        const categs = [];
        row.category.forEach(item => {
          arr = item.text.split('/');
        });
        arr.forEach(elem => {
          categs.push({ text: elem });
        });
        row.category = categs;
      }

      if (row.variantInformation) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.variantInformation.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ', ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.variantInformation = nDesc;
      }

      if (row.variants) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.variants.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '| ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.variants = nDesc;
      }

      if (row.description) {
        if (row.description.length > 1) {
          let text = '';
          row.description.forEach(item => {
            text += item.text + ' ';
          });
          row.description = [{ text }];
          row.description[0].text = row.description[0].text.replace(/Key Benefits /, 'Key Benefits || ');
        }
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }

      if (row.manufacturerImages) {
        // let video = [];
        row.manufacturerImages.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https${item.text}`;
          }
        });
      }

      if (row.caloriesPerServing) {
        row.caloriesPerServing.forEach(item => {
          item.text = item.text.substring(0, item.text.indexOf('kcal'));
          item.text = item.text.replace(/[^0-9]/g, '');
        });
      }
      // if (row.description) {
      //   let text = '';
      //   row.description.forEach(item => {
      //     text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
      //   });
      //   row.description = [
      //     {
      //       text: text,
      //     },
      //   ];
      // }
      if (row.directions) {
        let text = '';
        row.directions.forEach(item => {
          text += item.text + ' ';
        });
        row.directions = [
          {
            text: text.trim(),
          },
        ];
      }
    }
    const clean = text => text && text.toString()
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
