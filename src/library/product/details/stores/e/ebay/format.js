/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      const uniqueArr = [];
      if (row.specifications) {
        for (let i = 0; i < row.specifications.length; i++) {
          if (!uniqueArr.includes(row.specifications[i].text)) uniqueArr.push(row.specifications[i].text);
        }

        row.specifications = [{
          text: uniqueArr.reduce((item, currItem) => item ? `${item} || ${currItem.replace(/:(\s*\n\s*)+/g, ': ').replace(/(\s*\n\s*)+/, ' || ')}` : currItem.replace(/:(\s*\n\s*)/g, ': ').replace(/(\s*\n\s*)+/, ' || '), ''),
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
      if (row.videos) {
        let vids = [];
        vids = row.videos;
        for (let i = 0; i < vids.length; i++) {
          if (vids[i].text.includes('undefined')) { row.videos.splice(i, i + 1); }
        }
      }
      if (row.shippingInfo) {
        let shippingInfos = [];
        shippingInfos = row.shippingInfo;
        if (shippingInfos.length > 1) row.shippingInfo.splice(1, shippingInfos.length);
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
