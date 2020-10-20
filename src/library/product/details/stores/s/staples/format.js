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
      if (row.sku) {
        row.sku.forEach(item => {
          var myRegexp = /products\/(.+?)-/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          }
          row.variantId = row.sku;
        });
      }
      if (row.variants) {
        var variants = [];
        row.variants.forEach(item => {
          var myRegexp = /products\/(.+?)-/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            variants.push(match[1].trim());
          }
          if(variants.length){
            row.variants = [{"text": variants.join(' | ')}];
            row.variantCount = [{"text": variants.length}];
          }else{
            delete row.variants;
          }
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace(/Model\s*:/i, '');
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.replace(/Item\s*:/i, '');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0,1);
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/140x140/i, '1000x1000');
        });
        if(row.alternateImages.length == 0){
          delete row.alternateImages;
        }
      }      
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text);
        });
        if (row.description && bulletArr.length) {
          row.description = [{ "text": row.description[0]["text"] + "|| " + bulletArr.join(" || ") }];
        }
        row.descriptionBullets = [{ "text": row.descriptionBullets.length }];
      }
      if (row.category) {
        if (row.category.length) {
          row.category.splice(0, 1);
          row.category.splice(row.category.length - 1, 1);
        }
        row.category.forEach(item => {
          item.text = item.text.replace('>', '').trim();
        });
      }
      if (row.specifications) {
        var specificationArr = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s\n/, ' : ');
          specificationArr.push(item.text);
        });
        if (specificationArr.length) {
          row.specifications = [{ "text": specificationArr.join(" || ") }];
        } else {
          delete row.specifications;
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };