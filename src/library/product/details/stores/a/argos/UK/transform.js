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

  for (const { group } of data) {
    for (const row of group) {
      // if (row.availabilityText) {
      //   let text = 'Out of Stock';
      //   row.availabilityText.forEach(item => {
      //     if (item.text === 'COLLECTION_FROM_TOMORROW_AT_TIME') {
      //       text = 'In Stock';
      //     } else if (item.text === 'DELIVERY_1_MAN_FROM_TODAY') {
      //       text = 'In Stock';
      //     } else if (item.text === 'COLLECTION_NOW') {
      //       text = 'In Stock';
      //     } else {
      //       console.log(`Unhandled case => ${item.text}`);
      //     }
      //   });
      //   row.availabilityText = [{ text }];
      // }
      if (row.unInterruptedPDP) {
        const PDPSet = new Set();
        row.unInterruptedPDP.forEach(el => PDPSet.add(el.text));
        const PDPData = [];
        PDPSet.forEach(title => {
          PDPData.push({ text: title });
        });

        row.unInterruptedPDP = PDPData;
      }

      if (row.backupInTheBoxText) {
        row.inTheBoxText = row.backupInTheBoxText;
        delete row.inTheBoxUrl;
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += ` ${item.text.trim()}`;
        });
        row.manufacturerDescription = [{ text: text.trim() }];
      }

      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = item.text.replace(/(.+)(Let’s compare):?(.+)/g, '$1');
        });
        row.manufacturerDescription = [{ text: text }];
      }

      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text += ` ${item.text.trim()}`;
        });
        row.warnings = [{ text: text.trim() }];
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = Number(item.text) ? Number(item.text).toFixed(1) : item.text;
        });
      }

      if (row.variants) {
        let text = '';
        row.variants.forEach(item => {
          text = row.variants.map(elm => elm.text).join(' | ');
        });
        row.variants = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = row.specifications.map(elm => elm.text).join(' ');
        });
        row.specifications = [{ text }];
      }

      if (row.aggregateRatingText) {
        row.aggregateRatingText.forEach(item => {
          item.text = Number(item.text) ? Number(item.text).toFixed(1) : item.text;
        });
      }

      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace('EAN:', '');
        });
      }
    };
  }


  // Cleaning up data
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
    el.text = el.text.trim();
  }))));

  return data;
};

module.exports = { transform };
