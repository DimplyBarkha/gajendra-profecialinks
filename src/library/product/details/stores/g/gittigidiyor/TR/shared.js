/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
	for (const { group } of data) {
		for (const row of group) {
			if (row.availability) {
				row.availability[0].text = row.availability[0].text.includes('adet ürün stokta') ? 'InStock' : 'OutOfStock'
			}

			if (row.nameExtended) {
				let nameExtended = row.nameExtended[0].text;
				nameExtended = nameExtended[nameExtended.length - 1] === '-' ? nameExtended.substring(0, nameExtended.length - 1).trim() : nameExtended.trim()
				nameExtended = nameExtended[0] === '-' ? nameExtended.substring(1, nameExtended.length).trim() : nameExtended.trim()
				row.nameExtended = [{
					text: nameExtended
				}]
			}

			if (row.specValues) {
				let specValues = row.specValues;
				let specTitles = row.specTitles;
				let specStr = '';
				for (let i = 0; i < specTitles.length; i++) {
					specStr += `${specTitles[i].text} : ${specValues[i].text} || `
				}
				specStr = specStr.substring(0, specStr.lastIndexOf(' ||'));
				row.specifications = [
					{
						text: specStr
					}
				]
			}

			if (row.description && row.featureHeading) {
				let finalDescription = '';
				finalDescription = row.descriptionTitle ? row.descriptionTitle[0].text : '';
				finalDescription += row.descriptionIconInfo ? ` ${row.descriptionIconInfo[0].text}` : '';
				let featureStr = '';
				if (row.featureTitles) {
					let featureTitles = row.featureTitles;
					let featureValues = row.featureValues;
					for (let i = 0; i < featureTitles.length; i++) {
						featureStr += `${featureTitles[i].text} : ${featureValues[i].text} || `
					}
					featureStr = featureStr.substring(0, featureStr.lastIndexOf(' ||'));
				}

				finalDescription += featureStr.length > 0 ? ` || ${featureStr}` : '';
				finalDescription += row.descriptionContent ? `${row.descriptionContent[0].text}` : '';
				row.description = [{ text: finalDescription }]
				// row.description = [{ text: `${row.description[0].text} ${row.featureHeading[0].text} || ${featureStr}` }];
			}
		}
	}

	// Clean up data
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
		.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
		.trim();

	data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
		el.text = clean(el.text);
	}))));

	return data;
};

module.exports = { transform };
