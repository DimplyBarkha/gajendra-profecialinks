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
      if (row.description) {
        var descArr = [];
        row.description.forEach(item => {
          descArr.push(item.text);
        });
        if (descArr.length) {
          row.description = [{ "text": descArr.join(' | ') }];
        }
      }
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text);
        });
        if (row.description && bulletArr.length) {
          row.description = [{ "text": "|| " + bulletArr.join(" || ") + " | " + row.description[0]["text"] }];
        }
        row.descriptionBullets = [{ "text": row.descriptionBullets.length }];
      }
      if (row.specifications) {        
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\r\n|\r|\n/g, '||')
          item.text = '||'+item.text;
        });               
      }
      if (row.category) {
        if (row.category.length) {
          row.category.splice(0, 1);
          row.category.splice(row.category.length - 1, 1);
        }
        var categoryArr = [];
        row.category.forEach(item => {
          if (item.text != '>') {
            categoryArr.push({ "text": item.text, "xpath": item.xpath });
          }
        });
        if (categoryArr.length) {
          row.category = categoryArr;
        } else {
          delete row.category;
        }
      }
      if (!row.variantId && row.firstVariant) {
        row.variantId = row.firstVariant;
      }
      if (row.variants) {
        var variantsArr = [];
        row.variants.forEach(item => {
          variantsArr.push(item.text);
        });
        if (variantsArr.length) {
          row.variants = [{ "text": variantsArr.join(' | ') }];
        }
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = "https://www.capitalhairandbeauty.co.uk" + item.text;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        if (row.alternateImages.length) {
          row.alternateImages.forEach(item => {
            item.text = "https://www.capitalhairandbeauty.co.uk" + item.text.replace('small', 'xlarge');
          });
        } else {
          delete row.alternateImages;
        }
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };