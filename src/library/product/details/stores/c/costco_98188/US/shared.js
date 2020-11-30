/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      var bulletsText = '';
      var newArray = [];
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo.length) {
        var originalArray = row.additionalDescBulletInfo;
        var lookupObject = {};
        for (var i in originalArray) {
          lookupObject[originalArray[i].text] = originalArray[i];
        }
        for (i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        newArray.forEach((ele) => {
          if (ele.text) {
            bulletsText += '||' + ele.text.trim();
          }
        });
        row.additionalDescBulletInfo = [
          {
            text: bulletsText,
          }];
      }
      if (row.descriptionBullets && newArray.length) {
        row.descriptionBullets[0].text = newArray.length;
      }
      if (row.description) {
        var desc = '';
        var bullets = bulletsText.split('||');
        row.description.forEach((ele) => {
          desc += ' ' + ele.text;
        });
        bullets.forEach((el) => {
          desc = desc.replace(el, '');
        });
        row.description = [
          {
            text: bulletsText + ' ' + desc,
          }];
      } else if (bulletsText) {
        row.description = [
          {
            text: bulletsText,
          }];
      }
      if (row.specifications) {
        var specText = '';
        for (var j = 0; j < row.specifications.length; j = j + 2) {
          specText += row.specifications[j].text + ': ' + row.specifications[j + 1].text + ' || ';
        }
        row.specifications = [{
          text: (specText.slice(0, -3)).trim(),
        }];
      }
      if (row.category && row.category.length) {
        row.category = row.category.map((e) => {
          e.text = e.text.replace('Go to ', '');
          return e;
        });
      }
      if (row.alternateImages && row.alternateImages.length) {
        row.alternateImages = row.alternateImages.map((e) => {
          e.text = e.text.replace('recipeId=735', 'recipeId=728');
          return e;
        });
      }
      if (row.price && (!row.price[0].text.includes('$'))) {
        row.price[0].text = '$'.concat(row.price[0].text);
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
