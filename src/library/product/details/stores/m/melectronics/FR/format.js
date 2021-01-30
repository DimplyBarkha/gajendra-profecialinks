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
      if (row.image) {
        const imageArr = row.image.map((item) => {
          return item.text.replace('fm-sm', 'fm-lg2').replace('fm-md', 'fm-lg2').replace(/\/fm-lg\//g, 'fm-lg2').replace('fm-xl', 'fm-lg2');
        });
        const uniqueImage = new Set(imageArr);
        const imagesArray = [];
        uniqueImage.forEach((item) => {
          imagesArray.push(item);
        });
        row.image = [{ text: imagesArray.join(''), xpath: row.image[0].xpath }];
      }
      if (row.imageAlt) {
        const imageAltArr = row.imageAlt.map((item) => {
          return item.text;
        });
        const uniqueImageAlt = new Set(imageAltArr);
        const imageAltArray = [];
        uniqueImageAlt.forEach((item) => {
          imageAltArray.push(item);
        });
        row.imageAlt = [{ text: imageAltArray.join(''), xpath: row.imageAlt[0].xpath }];
      }
      if (row.name) {
        const nameArr = row.name.map((item) => {
          return item.text;
        });
        const uniqueName = new Set(nameArr);
        const nameArray = [];
        uniqueName.forEach((item) => {
          nameArray.push(item);
        });
        row.name = [{ text: nameArray.join(''), xpath: row.name[0].xpath }];
      }

      if (row.nameExtended) {
        const nameExtendedArr = row.nameExtended.map((item) => {
          return item.text;
        });
        const uniqueNameExtended = new Set(nameExtendedArr);
        const nameExtendedArray = [];
        uniqueNameExtended.forEach((item) => {
          nameExtendedArray.push(item);
        });
        row.nameExtended = [{ text: nameExtendedArray.join(''), xpath: row.nameExtended[0].xpath }];
      }
      if (row.additionalDescBulletInfo && row.additionalDescBulletInfo[0] && row.additionalDescBulletInfo[0].text.length > 1) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text.replace(/•/g, '||');
        });
        const uniqueDesc = new Set(additionalDescBulletInfoArr);
        const descBulletsArray = [];
        uniqueDesc.forEach((item) => {
          descBulletsArray.push(item);
        });
        if (descBulletsArray.length > 1) {
          descBulletsArray[0] = ' || ' + descBulletsArray[0];
        }
        row.additionalDescBulletInfo = [{ text: descBulletsArray.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
        row.descriptionBullets = [{ text: descBulletsArray.length, xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.alternateImages) {
        const alternateImagesArr = row.alternateImages.map((item) => {
          return item.text.replace('fm-thumbnail', 'fm-lg2');
        });
        const uniqueAltImages = new Set(alternateImagesArr);
        const altImagesArray = [];
        uniqueAltImages.forEach((item) => {
          altImagesArray.push(item);
        });
        row.alternateImages = [{ text: altImagesArray.join(' || '), xpath: row.alternateImages[0].xpath }];
      }
      if (row.description || row.descriptionBulletsPoints) {
        var text = '';
        if (row.description) {
          const descriptionArr = row.description.map((item) => {
            return item.text.replace('fm-thumbnail', 'fm-lg2');
          });
          const uniqueDescription = new Set(descriptionArr);
          uniqueDescription.forEach((item) => {
            text += item + ' ';
          });
        }
        if (row.descriptionBulletsPoints) {
          const descriptionBulletsPointsArr = row.descriptionBulletsPoints.map((item) => {
            return item.text;
          });
          const uniqueDesc = new Set(descriptionBulletsPointsArr);
          uniqueDesc.forEach((item) => {
            text += typeof (item) === 'string' && item.trim() !== '' ? ' || ' + item : '';
          });
        }
        row.description = [{ text }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return item.text.replace(/\n+/g, ' : ');
        });
        const uniqueSpecifications = new Set(specificationsArr);
        const specificationsArray = [];
        const lengthOfSpecification = uniqueSpecifications.values().next().value.split(':').length;
        uniqueSpecifications.values().next().value.split(':').forEach((element, index) => {
          if (index % 2 === 0) {
            specificationsArray.push(element + ':');
          } else if (index < lengthOfSpecification - 1) {
            specificationsArray.push(element + '|');
          } else {
            specificationsArray.push(element);
          }
        });
        row.specifications = [{ text: specificationsArray.join(''), xpath: row.specifications[0].xpath }];
      }
      if (row.nameExtended && row.brandText) {
        var nameExtendedText = row.nameExtended[0].text.includes(row.brandText[0].text) ? row.nameExtended[0].text.replace(row.brandText[0].text, row.brandText[0].text + ' -') : row.brandText[0].text + ' - ' + row.nameExtended[0].text;
        row.nameExtended = [{ text: nameExtendedText, xpath: row.nameExtended[0].xpath }];
      }
      if (row.sku) {
        if (row.sku.length > 1) {
          row.sku.shift();
        }
      }
      if (row.category) {
        const categoryList = [];
        const categoryArray = row.category.map((item) => item.text);
        const uniqueCategoryList = new Set(categoryArray);
        uniqueCategoryList.forEach((item) => { categoryList.push({ text: item }); });
        row.category = categoryList;
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('’', ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('’', ',');
        });
      }
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text.toLocaleLowerCase() === 'disponible en stock' ? 'In Stock' : 'Out Of Stock';
      }
      // if (row.variantCount) {
      //   row.variantCount = [{ text: row.variantCount.length }];
      // }
      // if (row.variants) {
      //   var scriptJSON = JSON.parse(row.variants[0].text);
      //   if (scriptJSON.productVariants) {
      //     var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
      //     var varientIds = [];
      //     for (var i = 0; i < objectsInVariants; i++) {
      //       var keyName = Object.keys(scriptJSON.productVariants)[i];
      //       var variants = scriptJSON.productVariants[keyName].variants;
      //       variants.forEach(function (item, index) {
      //         varientIds.push(item.fupid);
      //       });
      //     }
      //   }
      //   row.variants = [{ text: varientIds.join(' | ') }];
      // }
      // if (row.aggregateRating) {
      //   row.aggregateRating.forEach(item => {
      //     item.text = (item.text * 5) / 10;
      //   });
      // }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
