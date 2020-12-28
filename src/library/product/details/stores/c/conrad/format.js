/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          return (typeof (item.text) === 'string') && (item.text.trim().includes('Online')) ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
      if (row.category) {
        const categoryArray = row.category.map((item) => {
          return item.text.trim();
        });
        categoryArray.shift();
        row.category = categoryArray.map((item) => {
          return { text: item, xpath: row.category[0].xpath };
        });
      }
      if (row.attributesNotesCustom) {
        const attributesNotesCustomArray = row.attributesNotesCustom.map((item) => {
          return item.text.trim();
        });
        let description = '';
        if (row.description) {
          const descriptionArray = row.description.map((item) => {
            return item.text.trim();
          });
          description = descriptionArray.join(' | ');
        }
        const des = row.description2 ? ' | ' + row.description2[0].text.trim() : '';
        row.description = [{ text: description + des + ' | ' + attributesNotesCustomArray.join(' | '), xpath: row.attributesNotesCustom[0].xpath }];
      }
      if (row.description) {
        const descriptionArray = row.description.map((item) => {
          return item.text.trim();
        });
        let description = descriptionArray.join(' | ');
        if (description.startsWith('| ')) {
          description = description.substring(2);
        }
        let des = row.description2 ? ' | ' + row.description2[0].text.trim() : '';
        des = description.includes(des) ? '' : des;
        // description = row.description2 ? description + '| ' + row.description2[0].text.trim() : description;
        row.description = [{ text: description + des, xpath: row.description[0].xpath }];
      }
      if (row.descriptionBullets) {
        const descriptionBullets = row.descriptionBullets2 ? row.descriptionBullets2.length + row.descriptionBullets.length : row.descriptionBullets.length;
        row.descriptionBullets = [{ text: descriptionBullets, xpath: row.descriptionBullets[0].xpath }];
      }
      if (row.descriptionBullets2 && !row.descriptionBullets) {
        row.descriptionBullets = [{ text: row.descriptionBullets2.length, xpath: row.descriptionBullets2[0].xpath }];
      }
      if (row.image) {
        let image = row.image[0].text.trim();
        image = image.includes('NO-IMAGE') ? '' : image.substring(0, image.lastIndexOf('?'));
        // image = image.substring(0, image.lastIndexOf('?'));
        row.image = [{ text: image, xpath: row.image[0].xpath }];
      }
      // if (row.imageAlt) {
      //   const imageAlt = row.imageAlt[0].text.trim().replace('  ', ' ');
      //   row.imageAlt = [{ text: imageAlt, xpath: row.imageAlt[0].xpath }];
      // }
      if (row.shippingDimensions) {
        const shippingDimensions = row.shippingDimensions[0].text.trim().replace('Breite', 'Breite :').replace('Höhe', '| Höhe :');
        row.shippingDimensions = [{ text: shippingDimensions, xpath: row.shippingDimensions[0].xpath }];
      }
      // if (row.alternateImages) {
      //   row.alternateImages.shift();
      //   // const alternateImagesArr = row.alternateImages.map((item) => {
      //   //   return typeof (item.text) === 'string' ? item.text.trim().substring(0, item.text.lastIndexOf('?')) : '';
      //   // });
      //   // alternateImagesArr.shift();
      //   // row.alternateImages = [{ text: alternateImagesArr.join('|'), xpath: row.alternateImages[0].xpath }];
      //   row.secondaryImageTotal = [{ text: row.alternateImages.length, xpath: row.alternateImages[0].xpath }];
      // }
      if (row.alternateImages) {
        row.alternateImages.shift();
        const alternateImagesLength = row.alternateImages.length;
        if (alternateImagesLength > 0) {
          row.secondaryImageTotal = [{ text: alternateImagesLength, xpath: row.alternateImages[0].xpath }];
        }
      }
      if (row.productOtherInformation) {
        const productOtherInformationK = row.productOtherInformation.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        const productOtherInformationV = row.productOtherInformation2.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        const productOtherInformation = [];
        for (let index = 0; index < productOtherInformationK.length; index++) {
          const element = productOtherInformationK[index] + ' : ' + productOtherInformationV[index].trim();
          productOtherInformation.push(element);
        }
        row.productOtherInformation = [{ text: productOtherInformation.join(' | '), xpath: row.productOtherInformation[0].xpath }];
      }
      if (row.manufacturerDescription) {
        const manufacturerDescriptionArr = row.manufacturerDescription.map((item) => {
          return typeof (item.text) === 'string' ? item.text.trim() : '';
        });
        row.manufacturerDescription = [{ text: manufacturerDescriptionArr.join('|'), xpath: row.manufacturerDescription[0].xpath }];
      }
      if (row.aggregateRating2) {
        const aggregateRating2 = row.aggregateRating2[0].text.trim().split(' ')[0].replace('.', ',');
        row.aggregateRating2 = [{ text: aggregateRating2, xpath: row.aggregateRating2[0].xpath }];
      }
      if (row.aggregateRating) {
        const aggregateRating = row.aggregateRating[0].text.trim().split(' ')[0].replace('.', ',');
        row.aggregateRating = [{ text: aggregateRating, xpath: row.aggregateRating[0].xpath }];
      }
      if (row.aggregateRatingText) {
        const aggregateRatingText = row.aggregateRatingText[0].text.trim().split(' ')[0].replace('.', ',');
        row.aggregateRatingText = [{ text: aggregateRatingText, xpath: row.aggregateRatingText[0].xpath }];
      }
      if (row.videoLength) {
        const videoLength = row.videoLength[0].text.split('/')[1].trim();
        row.videoLength = [{ text: videoLength, xpath: row.videoLength[0].xpath }];
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent = [{ text: 'Yes', xpath: row.technicalInformationPdfPresent[0].xpath }];
      }
    }
  }

  const clean = text =>
    text
      .toString()
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

  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
