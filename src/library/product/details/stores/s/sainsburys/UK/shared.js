
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.pricePerUnit2) {
        let text = '';
        row.pricePerUnit2.forEach(item => {
          item.text = item.text.trim();
          if (item.text.endsWith('p/')) {
            text = item.text.replace('p/', '');
          } else if (item.text.endsWith('/')) {
            text = item.text.slice(0, -1);
            console.log(text);
          } else {
            text = item.text;
          }
        });
        row.pricePerUnit2 = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.description = [{ text }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }

      if (row.saturatedFatPerServing) {
        let text = '';
        row.saturatedFatPerServing.forEach(item => {
          text = item.text.replace(/^\(/g, '').replace(/\)$/g, '');
        });
        row.saturatedFatPerServing = [{ text }];
      }

      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          if (item.text.includes('//')) {
            text = item.text.replace('//', '/');
          } else if (item.text.endsWith('/')) {
            text = item.text.slice(0, -1);
          } else {
            text = text.replace(/\n/g, '').replace('//', '/').replace(/\s{1,}/g, '').trim();
          }
        });
        row.caloriesPerServing = [
          {
            text,
          },
        ];
      }

      if ((!row.listPrice || !row.listPrice.length) && row.price) {
        row.listPrice = row.price;
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\n/g, '');
        });
        row.allergyAdvice = [{
          text: text,
        },
        ];
      }

      if (row.gtin) {
        let text = '';
        let len;
        row.gtin.forEach(item => {
          text = item.text.split('_L.')[0].split('/');
          len = text.length;
          text = text[len - 1];
        });
        row.gtin = [{
          text: text,
        },
        ];
        row.eangtin = [{
          text: text,
        },
        ];
      }
    }
  }

  // Clean up data
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
    el.text = el.text.trim();
  }))));

  return data;
};

module.exports = { transform };
