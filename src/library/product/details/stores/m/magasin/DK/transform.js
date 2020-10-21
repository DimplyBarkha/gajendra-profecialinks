
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  // Default transform function
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
      try {
        if (row.gtin) {
          row.gtin = [{
            text: row.gtin[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ', '')
          }];
        }
        if (row.mpc) {
          row.mpc = [{ text: row.mpc[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ', '') }];
        }
        if (row.upc) {
          row.upc = [{ text: row.upc[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ', '') }];
        }
        if (row.eangtin) {
          row.eangtin = [{ text: row.eangtin[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ', '') }];
        }
        if (row.weightNet) {
          let newText = "";
          row.weightNet.forEach(item => {
            if (item.text.trim().charAt(item.text.trim().length - 1) == '.' || item.text.trim().charAt(item.text.trim().length - 1) == ',') {
              newText += `${item.text.trim().slice(0, -1)}`;
            } else {
              newText += `${item.text.trim()}`;
            }
          });
          row.weightNet = [{ text: newText.replace("Vægt: ", '').replace(',', '.') }];
        }
        if (row.gtin) {
          let newText = JSON.parse(row.gtin[0].text.trim());
          row.gtin = [{ text: newText.gtin13 }];
        }
        if (row.price) {
          const newText = row.price[0].text.replace('.', ',');
          row.price = [{ text: newText }];
        }
        if (row.nameExtended) {
          let newText = "";
          row.nameExtended.forEach(item => {
            let tempsplit = item.text.split(' ');
            if (tempsplit[0].trim().includes(row.brandText[0].text.trim())) {
              newText += `${item.text.trim()}`;
            } else {
              newText += `${row.brandText[0].text.trim() + ' ' + item.text.trim()}`;
            }
          });
          row.nameExtended = [{ text: newText }];
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };