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
      //.replace(/"\s{1,}/g, '"')
      //.replace(/\s{1,}"/g, '"')
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
      if (row.variantId) {
        row.variantId.forEach(item => {
          var myRegexp = /.+-(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          } else {
            delete row.variantId;
          }
        });
      }
      if (row.firstVariant) {
        row.firstVariant.forEach(item => {
          var myRegexp = /.+-(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          } else {
            delete row.firstVariant;
          }
        });
      }
      if (row.variants) {
        var varinatsArr = [];
        row.variants.forEach(item => {
          var myRegexp = /.+-(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            varinatsArr.push(match[1].trim());
          }
        });
        if (varinatsArr.length) {
          row.variants = [{ "text": varinatsArr.join(" | ") }];
          row.variantCount = [{ "text": varinatsArr.length }];
        } else {
          delete row.variants;
        }
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('_small', '_1920x');
          if (item.text.indexOf('https') < 0) {
            item.text = "https:" + item.text;
          }
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.replace('-', ' ');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('_300x', '_1920x');
          if (item.text.indexOf('https') < 0) {
            item.text = "https:" + item.text;
          }
        });
      }      
      if (row.category) {
        if (row.category.length) {
          row.category.splice(0, 1);
        }
      }
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text);
        });
        if (row.description && bulletArr.length) {
          row.description = [{ "text": row.description[0]["text"].replace(/^Description/,'').trim() + " || " + bulletArr.join(" || ") }];
        }
        row.descriptionBullets = [{ "text": row.descriptionBullets.length }];
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