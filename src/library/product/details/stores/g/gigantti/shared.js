
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.manufacturerImages) {				
				let newText = 'https://www.gigantti.fi/';
				row.manufacturerImages.forEach(item => {                    			
					newText = newText + item.text.trim()
				});
				row.manufacturerImages = [{ text: newText }];
			}

			if (row.videos) {				
				let newText = 'https://www.gigantti.fi/';
				row.videos.forEach(item => {                    			
					newText = newText + item.text.trim()
				});
				row.videos = [{ text: newText }];
			}

			if (row.productOtherInformation) {				
				let newText = '';
				row.productOtherInformation.forEach(item => {                    			
					newText +=  `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
				});
				row.productOtherInformation = [{ text: newText.slice(0, -4) }];
			}

			if (row.additionalDescBulletInfo) {				
				let newText = '';
				row.additionalDescBulletInfo.forEach(item => {                    			
					newText +=  `${item.text.replace(/\n|&dash;|\r/g, ' || ')}`;
				});
				row.additionalDescBulletInfo = [{ text: newText.slice(0, -4) }];
			}

			if (row.technicalInformationPdfPresent) {				
				let newText = 'No';
				row.technicalInformationPdfPresent.forEach(item => {                    			
					if (item.text.trim() > 0) {
						newText = 'Yes';
					}
				});
				row.technicalInformationPdfPresent = [{ text: newText }];
			}

			if (row.weightNet) {				
				let newText = '';
				row.weightNet.forEach(item => {
					newText +=  `${item.text.trim() + ' ' }` ;
				});
				
				row.weightNet = [{ text: newText }];
			}

			if (row.specifications) {				
				let newText = '';
				row.specifications.forEach(item => {
					newText +=  `${item.text.trim() + ' ' }` ;
				});
				
				row.specifications = [{ text: newText }];
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
