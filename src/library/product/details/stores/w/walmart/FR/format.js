
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.walmart.ca' + item.text;
        });
      }
      if (row.description) {
        var text = [];
        row.description.forEach(item => {
          text += item.text.replace(/•/g, '||').replace(/❋/g, '||').replace(/\|\|\s*\|\|/g, '||');
        });
        row.description = [{ text }];
        const bulletCount = text.match(/\|\|/g);
        if (bulletCount) {
          row.descriptionBullets = [{ text: bulletCount.length }];
        }
      }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          if (item.text) {
            item.text = Number(item.text).toFixed(2);
          }
        });
      }
      if (row.unInterruptedPDP) {
        const pdp = Array.from(new Set(row.unInterruptedPDP.map(elm => elm.text.trim())));
        row.unInterruptedPDP = pdp.map(text => ({ text }));
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.trim();
        });
        row.manufacturerDescription = [{ text }];
      }
    }
  }
  return data;
};

module.exports = { transform };
