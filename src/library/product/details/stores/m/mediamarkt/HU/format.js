/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const clean = text =>
    text.toString()
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
        if (typeof el.text !== 'undefined') {
            el.text = clean(el.text);
        }
    }))));
  
    for (const { group } of data) {
      for (const row of group) {
        if (row.image) {
            row.image[0].text = row.image[0].text.includes('http') ? row.image[0].text : 'https:' + row.image[0].text;
        }

        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              item.text = item.text.includes('http') ? item.text : 'https:' + item.text;
            });
        }

        if (row.price) {
            row.price[0].text = row.price[0].text + ' Ft';
        }

        if (row.listPrice) {
            row.listPrice[0].text = row.listPrice[0].text + ' Ft';
        }

        if (row.specificationsKeys && row.specificationsValues) {
            var spec = "";

            for (var i = 0; i < row.specificationsValues.length; i++) {
                if (row.specificationsValues[i].text == 'Készülék típusa') {
                    row.specificationsValues.splice(i, 1);
                }
                if (row.specificationsKeys[i].text == 'Gyártó:') {
                    row.manufacturer = [{ text: row.specificationsValues[i].text, xpath: row.specificationsValues[i].xpath }];
                }
                if (row.specificationsKeys[i].text == 'Tömeg:') {
                    row.weightNet = [{ text: row.specificationsValues[i].text, xpath: row.specificationsValues[i].xpath }];
                }
                if (row.specificationsKeys[i].text == 'Szín:') {
                    row.color = [{ text: row.specificationsValues[i].text, xpath: row.specificationsValues[i].xpath }];
                }
                if (row.specificationsKeys[i].text == 'Gyártói garancia:') {
                    row.warranty = [{ text: row.specificationsValues[i].text, xpath: row.specificationsValues[i].xpath }];
                }
                spec += row.specificationsKeys[i].text.concat(row.specificationsValues[i].text, ' || ');
            }

            row.specifications = [{text:spec.slice(0, -4), xpath:row.specificationsValues[0].xpath}];

            delete row.specificationsKeys;
            delete row.specificationsValues;
        }

        if (row.firstVariant) {
            let temp = row.firstVariant[0].text.split('-');
            row.firstVariant[0].text = temp[temp.length-1].split('.')[0];
        }

        if (row.variants) {
            row.variants.forEach(element => {
                let temp = element.text.split('-');
                element.text = temp[temp.length-1].split('.')[0];
            });
        }
      }
    }

    return data;
  };
  module.exports = { transform };
  