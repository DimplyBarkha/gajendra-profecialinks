
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.color) {
        row.color.forEach(item => {
          item.text = item.text.replace(/Farbe\s*:\s*/g, '');
          item.text = item.text.trim();
        });
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
        });
      }
      // if (row.price) {
      //   row.price.forEach(item => {
      //     item.text = item.text.replace('.', ',').trim();
      //   });
      // }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace(/ean"\s*:\s*/g, '');
          item.text = item.text.trim();
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
        row.description[0].text = '||' + row.description[0].text;
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          item.text = 'https://www.manor.ch' + item.text;
        });
      }
      if (row.category) {
        row.category.forEach(item => {
          item.text = item.text.trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('au lieu de', '');
          item.text = item.text.trim();
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        row.alternateImages.forEach(item => {
          item.text = 'https://www.manor.ch' + item.text;
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          item.text = 'https://www.manor.ch' + item.text;
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = 'https://www.manor.ch' + item.text;
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = item.text.replace(/Garantie/ig, ' ').trim();
        });
      }
      if (row.variants) {
        var arrVari = [];
        row.variants.forEach(item => {
          // /fr/p/p0-17361702
          arrVari.push(item.text.replace('/fr/p/', '').trim());
        });
        if (arrVari.length) {
          row.variants = [{ text: arrVari.join(' | ') }];
          row.variantCount = [{ text: arrVari.length }];
        }
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text = item.text.replace('Couleur:', '');
          item.text = item.text.trim();
        });
      }
      if (row.quantity) {
        row.quantity.forEach(item => {
          item.text = item.text.replace(/Taille\s*:\s*/, '');
          item.text = item.text.trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n\s*\n\s*/g, ' || ').trim();
          item.text = item.text.replace(/\n\s*/g, ':').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',').trim();
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
