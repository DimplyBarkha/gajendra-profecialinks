/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currItem) => item ? `${item} || ${currItem.text.replace(/:(\s*\n\s*)+/g, ': ').replace(/(\s*\n\s*)+/, ' || ')}` : currItem.text.replace(/:(\s*\n\s*)/g, ': ').replace(/(\s*\n\s*)+/, ' || '), ''),
        }];
      }
      if (row.unInterruptedPDP) {
        const set = new Set();
        row.unInterruptedPDP.forEach(item => {
          set.add(item.text);
        });
        const uniqArr = [];
        set.forEach(txt => {
          uniqArr.push({ text: txt });
        });
        console.log(`uniqArr size: ${uniqArr.length} vs. set size: ${set.size}`);
        row.unInterruptedPDP = uniqArr;
      }
      if (row.image && !row.image[0].text.includes('l500')) {
        row.image[0].text = row.image[0].text.replace(/(.+\/s-)l.*?(\..*)/, '$1l500$2');
      }
      if (row.gtin) {
        const GTIN = row.gtin.find(gtin => /\d+/.test(gtin.text));
        if (GTIN) {
          row.gtin = [{
            text: GTIN.text,
          }];
        } else {
          delete row.gtin;
        }
      }
      if (row.upc && /\d+/.test(row.upc[0].text) && !row.gtin) {
        row.gtin = [{
          text: row.upc[0].text,
        }];
      }
      if (row.brandText && row.brandText[0].text.includes('Brand:')) {
        row.brandText = [{
          text: row.brandText[0].text.replace('Brand:', '').trim(),
        }];
      }
      if (row.nameExtended && row.brandText && !row.nameExtended[0].text.startsWith(row.brandText[0].text)) {
        row.nameExtended[0].text = `${row.brandText[0].text} - ${row.nameExtended[0].text}`;
      }
      if (row.name && !row.brandText) {
        row.brandText = [{
          text: row.name[0].text.trim().replace(/([^\s]+).*/, '$1'),
        }];
      }
      if (row.name && row.brandText && !row.brandText[0].text) {
        row.brandText[0].text = row.name[0].text.trim().replace(/([^\s]+).*/, '$1');
      }
      if (row.mpc) {
        row.mpc = row.mpc.filter(mpc => !/Does not apply/i.test(mpc.text));
      }
      if (row.aggregateRating && row.decimalSeperator && row.decimalSeperator[0].text === 'EU') {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
      }
      console.log(row.inTheBoxUrl + ' IS INBOX URL');
      console.log(row.inTheBoxText + ' IS INBOX text');
      let spliceUrl = true;
      let spliceText = true;
      if (row.inTheBoxUrl == null) { spliceUrl = false; }
      if (row.inTheBoxText == null) { spliceText = false; }
      console.log(spliceUrl + ' and ' + spliceText);
      if (spliceUrl === true) {
        for (let i = 0; i < row.inTheBoxUrl.length; i++) {
          try {
            if (row.inTheBoxUrl[i] !== undefined) {
              if (row.inTheBoxUrl[i].text.includes('stores.ebay.co')) { row.inTheBoxUrl.splice(i, 1); }
              if (!row.inTheBoxUrl[i].text.includes('/')) { row.inTheBoxUrl.splice(i, 1); }
            }
          } catch (e) {}
        }
      }
      if (spliceText === true) {
        for (let i = 0; i < row.inTheBoxText.length; i++) {
          try {
            if (row.inTheBoxText[i] !== undefined) {
              if (row.inTheBoxText[i].text.includes('https://')) { row.inTheBoxText.splice(i, 1); }
            }
          } catch (e) {}
        }
      }
      // row.hasComparisonTable = row.hasComparisonTable ? [{ text: 'Yes' }] : [{ text: 'No' }]
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
