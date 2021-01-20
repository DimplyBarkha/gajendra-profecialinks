[33mcommit d8b295a74f58f669f93063ab2ab919e5d6aba205[m[33m ([m[1;36mHEAD -> [m[1;32mkiehls_ebt_au[m[33m, [m[1;31morigin/kiehls_ebt_au[m[33m, [m[1;32mmaster[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Mon Jan 4 12:35:01 2021 +0000

    Menu feed template (#3346)
    
    * init
    
    * asda extractor
    
    * linting
    
    * added goto
    
    * fix path
    
    * lint
    
    * suffix
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit ba1530b472d6acd392c50f4a7fc78f140e0bac06[m[33m ([m[1;31morigin/origin/DrogariaSaoPaulo_BR[m[33m, [m[1;31morigin/helper[m[33m, [m[1;31morigin/bat-govype[m[33m, [m[1;31morigin/UK---Ao[m[33m, [m[1;31morigin/Shoprite_08906[m[33m, [m[1;31morigin/Shoprite_08753[m[33m, [m[1;31morigin/FarmaciasGuadalajara_MX_Core[m[33m, [m[1;31morigin/DrogaRaia_BR_RD[m[33m, [m[1;31morigin/DE---ao_de[m[33m, [m[1;31morigin/AGParfetts_UK[m[33m)[m
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Tue Dec 15 15:23:17 2020 +0000

    added parentinput

[33mcommit 72b88a2c7923ce423348af2cfbf71a779c13bde1[m
Author: Avinash Kadam <avinash.kadam@profecialinks.com>
Date:   Fri Dec 11 23:29:00 2020 +0530

    Bat njoy (#2996)
    
    * review extractor
    
    review extractor
    
    * update extractor for review
    
    update extractor for review
    
    * removed console logs & input.yaml updated
    
    * schema updated, search extractor added
    
    * lint fixes
    
    Co-authored-by: cshelake <cshelake7@gmail.com>
    Co-authored-by: alscotty <alawrencescott@gmail.com>

[33mcommit 027dd471e16a40e288a1fec36e3f94802b39fc2d[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Thu Dec 10 14:53:25 2020 +0000

    Support for media tracker and geo (#2749)
    
    * media tracker schema
    
    * storeID for search
    
    * screen cap
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit 256fd629d3726c6df27130274a32871885c5d04a[m[33m ([m[1;31morigin/cosco[m[33m, [m[1;31morigin/core-angeloni_com_br[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Mon Dec 7 12:30:34 2020 +0000

    support for UPC (#2887)
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit 486ab30c2f315688ca4a4fc3e9ac520d2d3c155a[m[33m ([m[1;31morigin/makeitease[m[33m, [m[1;31morigin/hemkol[m[33m, [m[1;31morigin/core-angeloni_br[m[33m)[m
Author: Piotr Wieleba <wieleba.piotr@gmail.com>
Date:   Tue Dec 1 16:15:07 2020 +0100

    Fix to an issue with the 'noRecordXPath' not working for Core extractors (#1961)
    
    * - Improve execute.js to actually check for a given noRecordXpath
    - Modify action.js not to extract any data if noResultsXpath is present on the page
    
    * - Apply requested PR changes
    
    * - Linting issue fix
    
    Co-authored-by: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>

[33mcommit fc5a39e09e69377b7c80d1f4a80ab3828e85a234[m
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Tue Dec 1 14:15:39 2020 +0000

    hotfix getter/setter issue

[33mcommit c06b930ea1984c1c2c8a4748d832e3c2a2ae4269[m[33m ([m[1;31morigin/zooplus-it[m[33m, [m[1;31morigin/zooplus-IT[m[33m, [m[1;31morigin/tretti'[m[33m, [m[1;31morigin/superma[m[33m, [m[1;31morigin/staples.uk[m[33m, [m[1;31morigin/petsmart'[m[33m, [m[1;31morigin/medikamente-per-klick-11-30-2020[m[33m, [m[1;31morigin/dyson_fi[m[33m, [m[1;31morigin/conforama_ch_fr[m[33m)[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Wed Nov 25 05:24:01 2020 +0530

    Added reviews template (#1741)
    
    * added reviews template
    
    * update pagination
    
    * abstracted paginate to re-use in other templates
    
    * cleaned up code
    
    * OS fix
    
    * fixed linting, updated try catch block
    
    * removed infinty
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit d5da5883a1e881688ba15995bae127527f8784dd[m[33m ([m[1;31morigin/​DS-core-gigantti_fi[m[33m, [m[1;31morigin/zolando[m[33m, [m[1;31morigin/walmart_ar[m[33m, [m[1;31morigin/macca[m[33m, [m[1;31morigin/kroger-pro[m[33m, [m[1;31morigin/core-euronics[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Thu Nov 12 18:29:37 2020 +0000

    added support for xpath (#860)
    
    * added support for xpath
    
    * fix
    
    * Added loadedxpath
    
    * Added a stopcondition selector
    
    * fix
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit a8155da1dc4511d90e32a16fa56de6f7782c490f[m
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Wed Nov 11 21:34:14 2020 +0000

    walgreens fix

[33mcommit ba2000a177c0d61f5eaa24d3e1153bb4e81dc444[m[33m ([m[1;31morigin/acro[m[33m)[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Mon Nov 9 13:23:59 2020 -0800

    Mangalapally walgreens search (#493)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    * Add missing fields
    
    * Fix lint issue
    
    * Remove extra line
    
    * Remove comments
    
    * Add functionality  when results is one page
    
    * Modify if statement
    
    * Modify rating
    
    * Remove ts-ignore comments
    
    * Fix ts errors
    
    * Manually wrote description text for id
    
    * Make sure productInfo exists and also change price data
    
    * Change alternate images to return in string for array
    
    * Fix issues for first two and modify alternate images src
    
    * Make changes
    
    * Remove JS funct for description and alt img
    
    * Modify if statement
    
    * Modify obj key
    
    * added searchUrl with %20 filter
    
    * lint fix
    
    * searchUrl regex fix
    
    * Modify xpath for alt images due to class change
    
    * Update inputs.yaml
    
    * add aggregateRating2 field
    
    * Update extractor.yaml according to issues
    
    * Make more requested changes
    
    * Modify xpath
    
    * Add sample inputs and fix lint issues
    
    * Fix typos
    
    * updated xpaths
    
    * Comment out finding locations functionality
    
    * D
    
    * Remove comment out
    
    * remove type in yaml
    
    * Fix request call issues due to redirect
    
    * Got rid of other unused code and clean up search query
    
    * Fix issues
    
    * Fix quantity size
    
    * Create transform file for Walmart OG core
    
    * Add more inputs
    
    * Add another 0 results xpath
    
    * Add parameter zipcode functionality
    
    * Fix zipcode functionality and modify transform
    
    * Add zipcode functionality
    
    * Fix issues for 28th/29th
    
    * fixed customer reported issues
    
    * Fix tracker issues
    
    * Fix issues for walgreens search
    
    * Modify quantity issues
    
    * updated zipcode in details
    
    * Add disabled button functionality
    
    * Change product info to window.data if only one page
    
    * Make modifications to avoid interaction error
    
    * Modify timeout requests
    
    * Add fix for fetch if response status is not 200
    
    * Use shared transform file
    
    * Modify regex for one of the fields
    
    * Modify variable for one product
    
    * updated for zipcode
    
    * Grab price, old price, and availability from API call
    
    * Update API call link
    
    * Change url for domain
    
    * Modify domain block error
    
    * Set setBlock to false
    
    * Set block ads to false
    
    * Add if API Call fails
    
    * Modify for sponsored products issues
    
    * Set data according to placement
    
    * Add quick change
    
    * Add sponsored search API call
    
    * Remove extra comments
    
    * Add more check when loading zipcode entry
    
    * Add check for length
    
    * Add if check for objects
    
    * Fix issues for sponsored products api call
    
    * Add functionality to close modal if survey pop up
    
    * Make changes according to manual QA
    
    * Chang number from 24 to 72
    
    * Using a workaround to check number of results again
    
    * Fix issue for rating
    
    * Ignore pop-ups
    
    * Ignore pop-ups checks
    
    * Wait for few seconds to popup
    
    * Add more checks
    
    * Modify sponsored tags number
    
    * Add extra check for sponsored products
    
    * Fix lint issue
    
    * Refactor parts of code
    
    * Modify fetch functions
    
    * Change back to use if statements for fail
    
    * Remove comments got action.js for search
    
    * fixed custom transform and paginate loadedSelector
    
    * removed custom transform, and hooked the shared transform. As it is removing rows with no ids for dedup, but that is currently handled in workbench
    
    * Updated required selectors,api url and api parameters
    
    * Improved pager and simplified code
    
    * lint fix
    
    * reverted changes to search action
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Bindu Datla <bindu.datla@import.io>
    Co-authored-by: alscotty <alawrencescott@gmail.com>
    Co-authored-by: Sashi Datla <sashi.datla@import.io>
    Co-authored-by: Venkata Akhilesh Pasupuleti <41539204+VenkataAkhileshP@users.noreply.github.com>
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>

[33mcommit adb563709758163e36f1b370d7964309abf3b558[m[33m ([m[1;31morigin/search-Extra_br[m[33m, [m[1;31morigin/lild[m[33m, [m[1;31morigin/fragnance[m[33m, [m[1;31morigin/ds-1000[m[33m, [m[1;31morigin/ah_nl[m[33m, [m[1;31morigin/DS_Tesco_UK_search[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Mon Nov 2 10:33:38 2020 +0000

    Update extractor-build.md

[33mcommit d0247493bfc841bcf568b88d07a36ff96a2c01f1[m[33m ([m[1;31morigin/cdisc[m[33m, [m[1;31morigin/DS_meny_core[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 27 16:34:23 2020 +0000

    Create config.yaml

[33mcommit ef73c78529c04e447d7a73db5f7a71e16f085301[m
Merge: 17d74c2950 ff5f49e49c
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Tue Oct 27 16:33:25 2020 +0000

    Merge branch 'master' of github.com:import-io/robot-library

[33mcommit 17d74c2950b8dca2a0f6fdad5ec2f98f6fd3711f[m
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Tue Oct 27 16:33:20 2020 +0000

    removed test config.yaml

[33mcommit ff5f49e49c6efb63945596a7914708353b10d9a8[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 27 16:26:16 2020 +0000

    Update extractor-build.md

[33mcommit 660b1f0185e97139b1146064c2a31a95ba907014[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 27 16:23:12 2020 +0000

    Create config.yaml

[33mcommit 1b71c4dc61a984c018f8d6b34bf798b75076e4b8[m
Author: Guillaume Vial <guillaumevial@Guiguis-mac.local>
Date:   Tue Oct 27 16:16:47 2020 +0000

    Fixed gitignore

[33mcommit 848ff5997e3a0fe4bbf916b5f269d7ea91e5ac69[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 27 09:16:15 2020 +0000

    removed (#797)
    
    * removed
    
    * added config.yaml to gitignore
    
    * update on stale.yml
    
    Co-authored-by: Guillaume Vial <guillaumevial@Guiguis-mac.local>
    Co-authored-by: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>

[33mcommit 70f6774e351431faf3cadbbc97ee8f6b1733081a[m[33m ([m[1;31morigin/o2[m[33m, [m[1;31morigin/npm-install-eslint-config-standard---save[m[33m, [m[1;31morigin/internal_iga.net_ca_search[m[33m, [m[1;31morigin/internal_iga.net_ca_core[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Fri Oct 23 16:29:06 2020 +0100

    Update node.js.yml

[33mcommit e59e5946f1e010339f4482a26e6d8331954e7375[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Fri Oct 23 16:01:38 2020 +0100

    Update node.js.yml

[33mcommit 899817bb9516c246ddabede8894a9710122ed9d7[m[33m ([m[1;31morigin/paco[m[33m, [m[1;31morigin/internal_yan[m[33m, [m[1;31morigin/dcm_staplesadvantage_US_search[m[33m, [m[1;31morigin/DS-Core-falabella_PE[m[33m)[m
Author: Akhilesh PV <70310356+AkhileshPV21@users.noreply.github.com>
Date:   Thu Oct 22 16:29:28 2020 +0530

    Updated code to get images and gtin for the product from an API (#819)
    
    Co-authored-by: Venkata Akhilesh Pasupuleti <41539204+VenkataAkhileshP@users.noreply.github.com>

[33mcommit 271e0a11bdbec3f4f537c568f02e2350352c75f0[m[33m ([m[1;31morigin/Houzz_US_core[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 20 09:08:23 2020 +0100

    Update extractor-build.md

[33mcommit e25514da5d734ff7a7a10301877049860e345d8d[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Tue Oct 20 08:41:26 2020 +0100

    Update extractor-build.md

[33mcommit 98bbb3af730afa5942c26c09f14e4584a8203b25[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Mon Oct 19 12:41:45 2020 -0400

    [Osmosys] Carrefour es core (#221) (#721)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    Co-authored-by: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>

[33mcommit e94ac1daa900e851ed6e70228385a7afb0a667de[m[33m ([m[1;31morigin/internal_holmesproducts.com_us_search[m[33m, [m[1;31morigin/internal_holmesproducts.com_us_core[m[33m, [m[1;31morigin/git-hub[m[33m, [m[1;31morigin/application/ld+json[m[33m)[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Fri Oct 16 18:28:54 2020 +0100

    Update extractor-build.md

[33mcommit 56580ee77b0fb1af19d26ce0ff1278f2715040ca[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Fri Oct 16 12:07:40 2020 +0100

    Update extractor-build.md

[33mcommit 238f757f953f47ffcfa09d426e273a8e10dd6b28[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Thu Oct 15 19:28:47 2020 +0100

    Update extractor-build.md

[33mcommit 348b44a01fafa3be3e83bfacaee90b04b379aaa4[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Thu Oct 15 17:48:01 2020 +0100

    Update extractor-build.md

[33mcommit 3f6b4b28a95fbcf410394f977e5d6596d1667627[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 17:49:50 2020 +0100

    Update digital-shelf-source-build.md

[33mcommit 6617d8b46b646f8c065791743d8195c348d0f0ae[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 17:49:39 2020 +0100

    Update marketshare-extensions-source-build.md

[33mcommit 5a5b2177410792225f5f9d1ec6f1fbf694219e60[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 16:30:32 2020 +0100

    Update extractor-build.md

[33mcommit 582fe1f4674637e29b34d7ba6f9c1b3f254824b9[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 16:30:03 2020 +0100

    Update extractor-build.md

[33mcommit afde4c0b35130eb51e9864108001c96dcbd9bcee[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 16:09:47 2020 +0100

    Update extractor-build.md

[33mcommit 20a691f5b9e228484dc8943c3f4d5a650625666f[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 16:01:27 2020 +0100

    Update digital-shelf-source-build.md

[33mcommit a1756ff91457ba5b76bc91e0c9367fa1d2397cdf[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 16:00:05 2020 +0100

    Update extractor-build.md

[33mcommit f20bc2694b932daa3e1ee4577c9649fa3cb346c6[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 15:51:56 2020 +0100

    Remove option for blank issues

[33mcommit 816a7b48126819117dd4fa00b6a4e46f19c4b916[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 15:46:15 2020 +0100

    small change

[33mcommit e5e522f14133e93b43a1e2deec7f37aad4254769[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 15:38:53 2020 +0100

    Update extractor-build.md

[33mcommit 3c4aa49151d0fdca923bbd75d88196cefd90355b[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 15:36:43 2020 +0100

    added md extension

[33mcommit dbf79c0d2cb1464b57d8f57a1dac799f82567863[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 15:33:51 2020 +0100

    Finalized

[33mcommit 0364f91456823096664964a6f1fb24005093a727[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 13:57:54 2020 +0100

    First edit

[33mcommit 2352b880f73566842fd11f03e9219f6ea2705aec[m
Author: Guillaume-Vial <61331399+Guillaume-Vial@users.noreply.github.com>
Date:   Wed Oct 14 12:42:21 2020 +0100

    Added issue template for new sources
    
    All possible documentation is gathered here

[33mcommit 9113d67a4fb96a3ae9e6a462126012e50a772017[m[33m ([m[1;31morigin/tennents[m[33m, [m[1;31morigin/supply[m[33m, [m[1;31morigin/internal_ajmadison_us_search[m[33m, [m[1;31morigin/DS_jcpenney_us_search[m[33m, [m[1;31morigin/DS-core-am_UK[m[33m, [m[1;31morigin/DS-HighTechZone[m[33m)[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Tue Oct 6 09:02:54 2020 -0700

    Update issue templates

[33mcommit 61cbbbac942f3c0e1811462abe491b0d9555846a[m[33m ([m[1;31morigin/tf_docs[m[33m, [m[1;31morigin/robot-library[m[33m, [m[1;31morigin/neonat[m[33m, [m[1;31morigin/harristatar[m[33m, [m[1;31morigin/doom[m[33m, [m[1;31morigin/DS_core-pulsat_fr[m[33m, [m[1;31morigin/DS-londondrugs_ca[m[33m, [m[1;31morigin/DS-Electrocity_test[m[33m, [m[1;31morigin/DS-Electrocity-test[m[33m)[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Sep 23 06:36:26 2020 -0700

    Mangalapally foodservice search (#381)
    
    * Create a new extractor for foodservicedirect search
    
    * Use fetch to get data from each page
    
    * Modify selectors
    
    * Mulitply by 32 to get accurate api search page
    
    * Add new field
    
    * Modify to use xpath for link
    
    * Add some edits
    
    * Add opt tags to search url
    
    * Add staging extractor
    
    * Add if cases
    
    * Create temporary fix for action.js
    
    * Change action.js back and change selectors
    
    * Add quick change
    
    * Put action.js back
    
    * Replace pager function
    
    * Clean up for code reviews
    
    * Add reason for comments
    
    * Increment number of seconds
    
    * Remove unnecessary comments
    
    * Fix lint
    
    * Remove goto function and add implementation function to execute
    
    * Increment waiting time for loadedselector
    
    * Change it to 20 seconds
    
    * Added waitForSelector in extract ot handle api request errors
    
    * Fixed issue with fetchURL and added wait for selector to wait until the page load's
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Sashi Datla <sashi.datla@import.io>
    Co-authored-by: Venkata Akhilesh Pasupuleti <41539204+VenkataAkhileshP@users.noreply.github.com>

[33mcommit 64f09331e3668b2e99efd8f6cae814cf50561f2c[m[33m ([m[1;31morigin/cs-core-ep[m[33m, [m[1;31morigin/amazon.com-williantest[m[33m, [m[1;31morigin/DS_teknosa_richarani[m[33m, [m[1;31morigin/DS_Core_soundstore_IE[m[33m, [m[1;31morigin/DS-Varient-Namshi_AE[m[33m, [m[1;31morigin/DS-Varient-Namshi[m[33m, [m[1;31morigin/DS-Soundstore[m[33m, [m[1;31morigin/DS-Search-Core_ES[m[33m, [m[1;31morigin/DS-Core-Milar_CH[m[33m)[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Aug 28 15:03:17 2020 -0400

    Search template brands (#442)
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * included to accept brands as inputs
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit ec0cb21d7b672c64ea9726f1828f0b561cf564b6[m
Author: Sindhusha Balla <50326674+SindhuBalla@users.noreply.github.com>
Date:   Sat Aug 22 03:17:25 2020 +0530

    [Osm] Ds search argos uk (#410)
    
    * Created search extractor
    
    * Fixed lint issues
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>

[33mcommit f3ff9b5a3bd0a186b02393a6b9e005c743576feb[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Sat Aug 22 03:12:01 2020 +0530

    [OSM] Updated field values. (#416)
    
    * Updated field values.
    
    * staging extractor
    
    Co-authored-by: Bindu Datla <bindu.datla@import.io>

[33mcommit e1859f0d85ed92b82cd876b1bdac656c40939089[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:42:49 2020 -0700

    only pulls

[33mcommit c0e4f663ce0343425877d61ff18e721dec5afae2[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:23:27 2020 -0700

    just need to wait for bot

[33mcommit 0302d2c5adf606e7c5a122bbe2b3b1807262b05a[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:19:27 2020 -0700

    try this

[33mcommit afb9654244a28090d0035c4721eb52e1c621771b[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:13:59 2020 -0700

    fix stale file

[33mcommit ffdd82dfa2b4ef5ffb2e9a3661f5d3d552b307de[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:12:07 2020 -0700

    is this working

[33mcommit 90836700274e230d9c52e62ae34a456e5f32bd2b[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Fri Aug 21 12:10:08 2020 -0700

    Add Stale

[33mcommit 626d5a0d91704d744b663ceb794072dd10898d95[m[33m ([m[1;31morigin/medmax[m[33m, [m[1;31morigin/DS-core-homedepot-us[m[33m, [m[1;31morigin/DS-Auchan_FR[m[33m)[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Aug 7 17:00:02 2020 -0400

    Shared transform   remove deduplication (#379)
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * removing deduplication of records in search
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 34adcf7f63565f1f0527b52482e9a7b2d837ca1f[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Aug 6 19:14:30 2020 +0530

    Updated a field to fix character mismatch. (#375)

[33mcommit 067667747081addb62b8519a094de6b3b8ea84b3[m
Author: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
Date:   Wed Aug 5 22:49:39 2020 +0530

    Osmosys asda uk details (#309)
    
    * Updated yaml file
    
    * Updated yaml file
    
    * Updated yaml file
    
    * Added zipcode file
    
    * Updated yaml file
    
    * Updated yaml file
    
    * Updated yaml file
    
    * Updated yaml
    
    * Fixed iamges issue
    
    * Updated code
    
    * Updated shared
    
    * updated shared.js file
    
    * Fixed linting issues
    
    * Updatedcode
    
    * Updated folder structure.
    
    * Updated extract code to support package and brand info.
    
    * Fixed linting issues.
    
    * Some more lint fixes.
    
    * Some more lint fixes.
    
    * Some more lint fixes.
    
    * Updated transform function to remove special characters from the end.
    
    * Adding list price as actual price incase of no discounts.
    
    * Updated ternary conditions.
    
    * Lint fix.
    
    * Added product name field as well.
    
    * Updated extraction code for better performance.
    
    * Lint fix
    
    * Updated selector for description.
    
    * Updated types in extraction code.
    
    Co-authored-by: Manas Ranjan <manas.n@osmosys.asia>
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 9f926887f11b6c6103aa325c48fdf6515687924a[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Wed Aug 5 21:13:25 2020 +0530

    [Osmosys] carrefour ES Core (#361)
    
    * Fixed issue.
    
    * Added missing column.
    
    * Fixed linting issue.
    
    * Updated domain for less errors.
    
    * Simplified code.
    
    * Added name field for extraction.
    
    * Updated ternary condition.
    
    * Updated description field selectors.
    
    * Removed unnecessary escape character.
    
    * Updated xpath for price per unit.
    
    * Updated description field to fetch extrac information.
    
    * Updated the selector for considering both isntructions and how to use section.
    
    Co-authored-by: Manas Ranjan <manas.n@osmosys.asia>
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>

[33mcommit 527432390ebd441a36aba8cf108adcb8d32768e1[m
Author: Sindhusha Balla <50326674+SindhuBalla@users.noreply.github.com>
Date:   Wed Aug 5 00:13:07 2020 +0530

    Added auth extractor template (#369)
    
    * Added auth extractor template
    
    * Added form selector
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>

[33mcommit 4a8d11b16a5066e172ad3b0a39309ef1df652f5a[m
Author: Satyam Rathod <satyam.rathod@synerzip.com>
Date:   Sat Aug 1 03:43:37 2020 +0530

    Geo template (#365)
    
    * Geo variant initial template with postcode and zipcode as an inputs
    
    * prepare and ge extract actions added to the geo template
    
    * Updated all the inputs to make them optional
    
    * Revert "Updated all the inputs to make them optional"
    
    This reverts commit 6f5f54fe847dd315b272a089e74c146225442ac7.
    
    * Updated all the inputs to make them optional

[33mcommit f7979f196c66d2aef80ff9fede0df7be3637cb33[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jul 29 17:25:35 2020 -0400

    Variants template (#367)
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * variants template with walmart example
    
    * lint fixes
    
    * updated to remove dependencies and fix xpaths.
    
    * lint fixes
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit ba813f7abcfc178db96c7caa3b191b48afe1f14c[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Wed Jul 29 18:50:06 2020 +0530

    Updated regular expression to fetch larger images. (#368)

[33mcommit 7f899d205f620b635ef5b5c41f0f5f0738de61d8[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Tue Jul 28 18:46:21 2020 +0530

    [Osmosys] amazon_apparel US search (#337)
    
    * Fixed issue.
    
    * Fixed product name issue.
    
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>

[33mcommit 166d91d1e9f214a1cb27ba7c89d11d2536792129[m
Author: radhakrishna-osm <66716612+radhakrishna-osm@users.noreply.github.com>
Date:   Fri Jul 24 18:38:27 2020 +0530

    [Osm Amazon Pharmapacks US Search] Fixed issues with few schema properties (#304)
    
    * fixed aggregate rating to aggregate rating 2
    
    * fixed amazonchoice issues
    
    * Tweaked amazon choice regExp
    
    * Reverted inputs file change
    
    * Reverted inputs file change
    
    Co-authored-by: ajayradhakrishna <ajayradhakrishna.t@osmosys.asia>
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>

[33mcommit da027ce380f008402e23fb57b9cabcfa5d79af7b[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Fri Jul 24 03:57:52 2020 +0530

    [Osmosys] amazon_runa US search (#357)
    
    * Changed search url.
    
    * Fixed rating issue.
    
    * Fixed amazon choice issue.
    
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>

[33mcommit 3fccbed3607e7375c15e2ba528c9b5d0749f6466[m
Author: Satyam Rathod <satyam.rathod@synerzip.com>
Date:   Thu Jul 23 00:42:29 2020 +0530

    Geo template (#359)
    
    * Geo variant initial template with postcode and zipcode as an inputs
    
    * prepare and ge extract actions added to the geo template

[33mcommit d95f97099fa753c762a2d504fde447c181e6fd2e[m[33m ([m[1;31morigin/amazon_ds[m[33m)[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Thu Jul 16 18:51:17 2020 +0530

    Ds search costco lg us (#283)
    
    * built extractor
    
    * updated thumbnail xpath
    
    * removed unused parameters
    
    * removed unused parameters
    
    * updated code to handle redirection
    
    * renamed store name to costco_lg
    
    * removed type modified
    
    * #343 Resolved comments
    
    * updated variable name
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit c3cdcec5f8e460c6a124a37c3c99edeec8ea14a7[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Mon Jul 13 09:21:16 2020 -0700

    Update issue templates

[33mcommit b689084cabf1f56361061481c073283a1b0ddf5a[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Mon Jul 13 18:51:35 2020 +0530

    Update-DS-search-Tesco-UK (#320)
    
    * updated extractor to populate image/gtin from API
    
    * undid changes
    
    * added try catch block
    
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit db2fd0e9854d3491399ebe230008634e51711a67[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Sun Jul 12 22:31:04 2020 -0700

    Update issue templates

[33mcommit b40f9535f4abe064e7888371d69acc029a40dbe4[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Sun Jul 12 16:05:26 2020 -0700

    Update issue templates

[33mcommit b74c8001628c2f7230afb4ff61deeb2392c2ecf0[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Sun Jul 12 15:48:09 2020 -0700

    Update issue templates

[33mcommit 11029599fb4db779b336ec8b7e3b65369452c870[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Fri Jul 10 21:06:18 2020 +0530

    updated extractor as website changed (#324)

[33mcommit c518f2c4a3b3164191f5aa1542fe29ad56531d81[m[33m ([m[1;31morigin/osm_amazon_pharmapacks_us_core_variant_fix[m[33m)[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Thu Jul 9 15:12:42 2020 -0700

    Mangalapally foodservice core cleanup (#199)
    
    * Grab serving size unit from serving size text
    
    * Fix issues to show UPC instead of DTIN and serving size value
    
    * Clean up
    
    * Add new field to accomadate client's new request
    
    * D
    
    * Update to add zipcode
    
    * Update xpath
    
    * Update xpath for category
    
    * Make modifications for coding standards
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 3aedd97b769f6dc764007bd23257c36a306356e1[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Fri Jul 10 00:30:02 2020 +0530

    [Osmosys] lowes lg us core (#274)
    
    * Added base code to create extractor
    
    * lowes-us-core
    
    * added inputs
    
    * Added extraction code
    
    * updated schema fields
    
    * lint fixes
    
    * Added inputs, deployed extractor & ran tests
    
    * Added scroll code & updated xpaths for manufacturer schema properties
    
    * lowes_search
    
    * updated schema
    
    * lint fixes
    
    * added new field
    
    * added new fields
    
    * Deploying extractor
    
    * added zipcode
    
    * Added zip code support.
    
    * xpath fixes
    
    * Added check to click on shop store button
    
    * Increased the timeout for search URL
    
    * Added context click & navigate support
    
    * updated code
    
    * Added DOM manipulation to fetch video & video URLS
    
    * Fixed lint issues
    
    * added zipcode
    
    * Added zip code support.
    
    * Updated code.
    
    * fixes
    
    * added store
    
    * Fixed sku issue.
    
    * Fixed issue.
    
    * updated code
    
    * added shared
    
    * Updated execute & extract code
    
    * fixed navigation
    
    * fix linting error
    
    * Removed unwanted code
    
    * Fixed enhancement issue.
    
    * Added zip code support
    
    * Fixed lint issues
    
    * removed unused files
    
    * Resolved PR.
    
    * Reverted back config file
    
    * Resolved comments.
    
    * Resolved comments.
    
    * Used object shorthand.
    
    * Renamed store name.
    
    * Renamed store name in test files.
    
    * Formatted line and resolved comments
    
    * Removed zipcode.
    
    * Resolved comments.
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Shreyam <shreyam.g@osmosys.asia>
    Co-authored-by: richa.t@osmosys.asia <richa.t@osmosys.asia>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit cb7cb50113cb13aae76044274ec3c7333e5c5b3b[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Wed Jul 8 15:47:22 2020 -0700

    Scott kroger (#220)
    
    * migrate changes and fix pricing issue on kroger product/details
    
    * fix undefined if not found bug
    
    * edit and deploy to workbench
    
    * add inputs
    
    * fix timing delay
    
    * xpath and input updates
    
    * fix input
    
    * fix some input names
    
    * extract.yaml naming fixes and update xpaths
    
    * format fix and remove raw.json
    
    * add zip code logic for core
    
    * lint fixes
    
    * add new test branch workbench
    
    * fix zip code bug
    
    * npm lint fixes
    
    * other merge fix
    
    * consolidated zip code logic to goto implementation
    
    * final lint fixes
    
    * syntax fixes
    
    * fix linting errors
    
    * url fix
    
    * updated url
    
    * xpath improvements
    
    * update nutrition xpaths
    
    * removed unneeded undefined check
    
    * update fibre typo
    
    * xpath adjustments
    
    * lint fixes
    
    * ratings/reviews xpaths
    
    * xpath update for brand and secondaryImageCount
    
    * fix default values xpaths
    
    * improved xpaths
    
    * additional updates for xpaths
    
    * add transform for product details
    
    * remove Perspective text from imageAlt
    
    * lint fix
    
    * transform fix and update item selector
    
    * update inputs to RPC
    
    * increased timeout on zip logic
    
    * lint fix
    
    * remove comments
    
    * drop to 100 inputs
    
    * fixes per ascential feedback
    
    * QA fixes and .textContent of null fix
    
    * more QA fixes
    
    * fix for additional_description
    
    * lint fixes
    
    * new files
    
    * deleted unneeded files
    
    * updated for noresultsxpath
    
    * Revert "updated for noresultsxpath"
    
    This reverts commit 568ecc76e6840795c2c62aebbb373ae25cb4bad5.
    
    * Revert "updated for noresultsxpath"
    
    This reverts commit 568ecc76e6840795c2c62aebbb373ae25cb4bad5.
    
    * improved extract
    
    * update upc xpath
    
    * testing
    
    * small inputs test
    
    * update sku
    
    * increased first req timeout
    
    * updated inputs
    
    * increased to 30 sec first req timeout
    
    * update test inputs
    
    * updates per PR feedback
    
    * update w PR feedback
    
    * remove sci notation for sec
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: Bindu Datla <bindu.datla@import.io>

[33mcommit 9ebb5423a79d891bc6042a39a4f8898927f1871f[m
Author: manoj-dey <66370612+manoj-dey@users.noreply.github.com>
Date:   Wed Jul 8 20:27:39 2020 +0530

    [Osmosys] AmazonPrimeNow_75204 US Search (#194)
    
    * updated the extractor
    
    * updated the code
    
    * updated store name
    
    * updated zip code implementation
    
    * updated selectors
    
    * updated zip code
    
    * resolved comments
    
    * added scroll
    
    * updated goto
    
    * updated code
    
    * updated setZipCode
    
    * updated seletor
    
    * resolved comments
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 7b28c85f09f50950f3f7ee877eb91f0bf9a87e71[m
Author: Lakshmi-Korlapati <45190046+Lakshmi-Korlapati@users.noreply.github.com>
Date:   Wed Jul 8 18:43:48 2020 +0530

    Osm carrefour es core fix (#306)
    
    * Added the some of the xpaths
    
    * Added a check for the gtin
    
    * Updated the code for extract.js file
    
    * Removed the ts-ignore
    
    * Updated the ternary condition
    
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>

[33mcommit 8f73b56d08283d3eb19adcf4299ea07a84325cb8[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Tue Jul 7 10:45:01 2020 -0700

    Scott kroger search (#310)
    
    * update xpaths
    
    * pending work on searchUrl
    
    * add search url manually
    
    * updated xpaths
    
    * add aggregateRating2 field
    
    * increased zip code timeouts
    
    * new files
    
    * deleted unneeded files
    
    * edit paginate to avoid dups
    
    * fix zip on search
    
    * removed zip for search
    
    * fixed paginate errors
    
    * updated upc xpath
    
    * new paginate xpaths
    
    * fix search dedups
    
    * resolve module dependency error
    
    * fix zip input
    
    * adding zip code
    
    * updated setzipcode
    
    * final zipcode fixes for search
    
    * add zip to extractor.yaml
    
    * added new transform
    
    * better syntax per PR
    
    * refactor zip code logic
    
    * moved import
    
    * added timeouts
    
    * increased loading timeout
    
    * merge and updated
    
    * moved the goto
    
    * updated for timeouts
    
    * extended timeouts
    
    * lint fix
    
    * re-add deleted file
    
    * syntax fix and merge in master
    
    Co-authored-by: Bindu Datla <bindu.datla@import.io>

[33mcommit 9785f822781067bba240a593e4310a97e7682e5c[m
Author: Lakshmi-Korlapati <45190046+Lakshmi-Korlapati@users.noreply.github.com>
Date:   Tue Jul 7 21:55:27 2020 +0530

    DS core amazon apparel us (#250)
    
    * saving changes
    
    * Updated the extract and xpath file
    
    * updated schema
    
    * Updated the xpaths
    
    * Added basic extractor info.
    
    * Updated the xpaths
    
    * Updated the xpaths
    
    * Updated the xpaths
    
    * Updated the code
    
    * Updated the xpaths
    
    * Fixed the linting issues
    
    * Updated the name field
    
    * Updated code
    
    * Updated the xpaths
    
    * Added the other fields
    
    * Updated code
    
    * Added the xpath and updated the code
    
    * Updated the code
    
    * Changedd the shared file
    
    * Updated the xpaths
    
    * updated code
    
    * Added schema related changes.
    
    * updated other seller shipping
    
    * added asin column
    
    * saving changes
    
    * renamed to Image360Present
    
    * updated videos and removed sku
    
    * fixed regex
    
    * fixed wrong xpath
    
    * Updated the code and xpath
    
    * saving changes
    
    * updated largeImageCount
    
    * undid changes
    
    * removed test files
    
    * Updated the xpath and shared file
    
    * moved changes from base amazon US to pharmapacks
    
    * Updated the xpaths
    
    * Updated the xpaths based on the pharmapack
    
    * resolved the linting issues
    
    * Updated the xpath
    
    * Added the xpaths for two fields
    
    * Updated the execute and extract files
    
    * Added the setZipCode file and Updated the extractor
    
    * Removed the implements line from amazon.com file
    
    * reverted the amazon.com file
    
    * Removed the implements line from amazon.com file
    
    * Updated the code and reverted pharmapack changes
    
    * Reverted the amazon.com changes
    
    * Updated the code and created a setZipCode file
    
    * Added new fields and updated the pharmapack file
    
    * Updated the extract.yaml files
    
    * Updated the manufacturer xpath
    
    * Updated the xpath and removed the zipcoe
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Manas Ranjan <manas.n@osmosys.asia>
    Co-authored-by: nagajyothi.cp <nagajyothi.cp@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 9d6905c164ba4b0345c51892d7aaa50668f8c78b[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Tue Jul 7 21:54:32 2020 +0530

    DS-search-Douglas-ES (#292)
    
    * built extractor
    
    * updated url
    
    * updated extractor
    
    * removed null timeout
    
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit f5e87ac7dc5a8e596fcc4d04c0b5e75ca841485f[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Tue Jul 7 21:23:29 2020 +0530

    Update-DS-core-Elcorteingles_Apparel-ES (#312)
    
    * updated domain and fixed folder structure
    
    * checked out setzipcode file

[33mcommit 283aa2330cca41ff2e6a263dbcf97397c52c0823[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Tue Jul 7 19:24:36 2020 +0530

    [Osmosys] LowesLg us search (#262)
    
    * lowes_search
    
    * Added base for the extractor
    
    * Deployed extractor.
    
    * Fixed timeout issue.
    
    * Extended yaml file.
    
    * Merged with latest master.
    
    * Fixed linting issue.
    
    * Fixed zipcode issue.
    
    * Removed null keys.
    
    * removed null keys.
    
    * Resolved comments.
    
    * Renamed store name.
    
    * Fetched from latest.
    
    * Renamed file name.
    
    * removed zip code.
    
    Co-authored-by: Shreyam <shreyam.g@osmosys.asia>
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit f9edbb48f36e7903b6628384ced016af90081961[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Tue Jul 7 19:22:29 2020 +0530

    DS-search-Elcorteingles_Apparel-ES (#313)
    
    * built extractor
    
    * updated inputs.yaml file

[33mcommit bd29221aa808c9e5c2bd67c5feb6c26871d7d69b[m
Author: manoj-dey <66370612+manoj-dey@users.noreply.github.com>
Date:   Mon Jul 6 21:54:28 2020 +0530

    DS search amazon primenow98005 us (#209)
    
    * created the extractor
    
    * updated extractor id
    
    * updated store name
    
    * updated selectors
    
    * updated zip code
    
    * resolved comments
    
    * added scroll
    
    * updated goto
    
    * updated goto
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>

[33mcommit 88943979b965b7d6b86cfddfa0a5514c248260e3[m
Author: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
Date:   Thu Jul 2 22:41:59 2020 +0530

    Osmosys amazonprimenow 75204 us details (#219)
    
    * Added details file
    
    * Added the amazon prime details extractor
    
    * Updated the xpath and extract.js file
    
    * Updated the xpaths
    
    * fixed navigation issue
    
    * saving changes
    
    * Updated navigation file
    
    * saving changes
    
    * fixed linting issues
    
    * Added files for amazonprimenow 98005 zipcode core domain
    
    * extended schema from amazonPrimeNow_98005
    
    * Updated schema
    
    * Removed unwanted folders
    
    * Removed unwanted folders
    
    * Removed serach files
    
    * Upadted yaml file
    
    * Updated yaml fle
    
    * Updated extract.yaml file
    
    * Added files
    
    * Removed amazonPrimeNow_98005 domain extract.yaml file
    
    * Added extract.yaml file
    
    * Updated schema
    
    * Updated secondary image total xpath
    
    * Updated zipcode implementation
    
    * Updated zipcode implementation
    
    * Deleted shared file
    
    * Update setZipCode.primenow.amazon.com.js
    
    * Removed ts ignore statements
    
    * updated goto
    
    * Removed prefix attribut
    
    * Reformated code
    
    * Updated parameters values
    
    * Added navigation file
    
    * Added navigation file
    
    Co-authored-by: Lakshmi-Korlapati <lakshmi.k@osmosys.asia>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Manoj <manoj.d@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit e245d26d88f685e0a0090ef3e887f1588cca19c1[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Thu Jul 2 12:53:35 2020 -0400

    Ds search walmart us (#287)
    
    * transform and variants update
    
    * fixed typo
    
    * updated extract code to include tranform for all pages
    
    * lint fixes
    
    * xpath updates
    
    * xpaths and variantid
    
    * more fixes
    
    * updates on some fields
    
    * updates
    
    * tried iframe elements
    
    * Updates based on customer feedback
    
    * lint fixes
    
    * iframe elements
    
    * fixed issues reported and added searchUrl
    
    * product code regex update
    
    * updated xpath
    
    * updated to new schema element
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * Updated paginate to include the noResultsXPath
    
    * removed walmart details changes
    
    * fixed eol
    
    * updated xpath, so not to consider ads
    
    * updated for more examples
    
    * updated shared transform for duplicates
    
    * updated shared.js
    
    * updated based on PR
    
    * lint fixes
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit d711bac104cc7cf993b36c2799da38b2af99d7b6[m
Author: Sindhusha Balla <50326674+SindhuBalla@users.noreply.github.com>
Date:   Thu Jul 2 22:22:15 2020 +0530

    Ds core lowes 1360 us (#272)
    
    * Added base code to create extractor
    
    * lowes-us-core
    
    * added inputs
    
    * Added extraction code
    
    * updated schema fields
    
    * lint fixes
    
    * Added inputs, deployed extractor & ran tests
    
    * Added scroll code & updated xpaths for manufacturer schema properties
    
    * lowes_search
    
    * updated schema
    
    * lint fixes
    
    * added new field
    
    * added new fields
    
    * added zipcode
    
    * xpath fixes
    
    * Added check to click on shop store button
    
    * Increased the timeout for search URL
    
    * Added context click & navigate support
    
    * updated code
    
    * Added DOM manipulation to fetch video & video URLS
    
    * Fixed lint issues
    
    * added zipcode
    
    * fixes
    
    * added store
    
    * updated code
    
    * added shared
    
    * Updated execute & extract code
    
    * fixed navigation
    
    * fix linting error
    
    * Removed unwanted code
    
    * Added zip code support
    
    * Fixed lint issues
    
    * Added zip code support
    
    * removed unused files
    
    * Fixed lint issue
    
    * Updated the alternate images selector
    
    * added fix
    
    * updated config.yaml
    
    * Reverted account id update
    
    * resolved comment
    
    * resolved comments
    
    * Updated the code as per the PR comments mentioned in Lowes Core US
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Shreyam <shreyam.g@osmosys.asia>
    Co-authored-by: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 05ebf4e106ed7d7e0330a3db8677df63fa15451d[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Thu Jul 2 22:08:57 2020 +0530

    Updated row xpath selector. (#300)
    
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 5f626f78c7c38f0669ac47f3fd1a00fbbca91e71[m
Author: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>
Date:   Thu Jul 2 21:38:17 2020 +0530

    [Osmoys] Lowes US Core (#273)
    
    * Added base code to create extractor
    
    * lowes-us-core
    
    * added inputs
    
    * Added extraction code
    
    * updated schema fields
    
    * lint fixes
    
    * Added inputs, deployed extractor & ran tests
    
    * Added scroll code & updated xpaths for manufacturer schema properties
    
    * lowes_search
    
    * updated schema
    
    * lint fixes
    
    * added new field
    
    * added new fields
    
    * added zipcode
    
    * xpath fixes
    
    * Added check to click on shop store button
    
    * Increased the timeout for search URL
    
    * Added context click & navigate support
    
    * updated code
    
    * Added DOM manipulation to fetch video & video URLS
    
    * Fixed lint issues
    
    * added zipcode
    
    * fixes
    
    * added store
    
    * updated code
    
    * added shared
    
    * Updated execute & extract code
    
    * fixed navigation
    
    * fix linting error
    
    * Removed unwanted code
    
    * Added zip code support
    
    * Fixed lint issues
    
    * removed unused files
    
    * added fix
    
    * updated config.yaml
    
    * resolved comment
    
    * resolved comments
    
    * resolved comment
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 781293a878f3d4968a13ae0583b0b9dfdb865abd[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Thu Jul 2 21:22:48 2020 +0530

    DS-search-Amazon_PrimeNow-US (#224)
    
    * saving changes
    
    * updated code as per zipcode template
    
    * fixed linting
    
    * saving changes
    
    * saving changes
    
    * saving changes
    
    * saving changes
    
    * updated selector
    
    * changed zipcode to string
    
    * undid changes to file
    
    * removed tsignore
    
    * updated goto
    
    * reformated code
    
    * fixed parameter issue
    
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
    Co-authored-by: Manoj <manoj.d@osmosys.asia>

[33mcommit 1fcc4234c28c078ca02c5a78fc32a00a0601b780[m
Author: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>
Date:   Thu Jul 2 20:57:16 2020 +0530

    [Osmosys] Lowes 1360 US Search (#280)
    
    * lowes-us-core
    
    * added inputs
    
    * updated schema fields
    
    * lint fixes
    
    * lowes_search
    
    * updated schema
    
    * lint fixes
    
    * added new field
    
    * added new fields
    
    * lowes-1360-seach
    
    * Added dependencies in the execute.js
    
    * added zipcode
    
    * xpath fixes
    
    * Added check to click on shop store button
    
    * Increased the timeout for search URL
    
    * Added context click & navigate support
    
    * updated code
    
    * added store
    
    * fixed navigation
    
    * fix linting error
    
    * added zipcode implementation in navigation
    
    * resolved comments
    
    * updated store name
    
    * removing details lowes
    
    * resolving comments
    
    * updated code
    
    * resolved comments and updated selectors
    
    * updated pagination
    
    * updated code
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 6db0f2335de0dabd3ab66ce0b2d2b4773435689f[m
Author: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>
Date:   Thu Jul 2 20:44:19 2020 +0530

    [Osmosys] Lowes us search (#266)
    
    * lowes_search
    
    * lint fixes
    
    * added zipcode
    
    * Added check to click on shop store button
    
    * Increased the timeout for search URL
    
    * Added context click & navigate support
    
    * updated code
    
    * added store
    
    * fixed navigation
    
    * fix linting error
    
    * added zipcode implementation in navigation
    
    * updated store name
    
    * resolving comments
    
    * resolved comments and updated selectors
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 55b46c4f075b8adf66cf9e94fee94fe074fd593e[m
Author: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
Date:   Thu Jul 2 20:38:53 2020 +0530

    Osm costco 98188 us details (#251)
    
    * Added costco files
    
    * Adding test files
    
    * Updated availability column xpath
    
    * Updated zip code implementation
    
    * Updated zipcode implementation
    
    * Removed all null attributes
    
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 0964ee60b825557437e4083efc9e589adbc5185c[m
Author: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
Date:   Thu Jul 2 20:36:06 2020 +0530

    Osm amazonprimenow98005 us details (#215)
    
    * Added details file
    
    * Updated navigation file
    
    * Added files for amazonprimenow 98005 zipcode core domain
    
    * Upadted yaml file
    
    * Updated yaml fle
    
    * Updated extract.yaml file
    
    * Upadted regex for rating
    
    * Fixed the issue with space
    
    * Updated wit latest schema
    
    * Updated secondary image total xpath
    
    * Updated zip code implementation
    
    * Updated one test file
    
    * Updated code in setZipcode functionality
    
    * Added productUrl xpath
    
    * Deleted shared file
    
    * Update setZipCode.primenow.amazon.com.js
    
    * Removed ts ignore statements
    
    * resolved comments
    
    * Removed prefix attribute
    
    * Updated yaml file
    
    * Reformated code
    
    * Fixed lint issue
    
    * Removed commented code
    
    * Updated parameter values
    
    Co-authored-by: Manoj <manoj.d@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 62d386cdbda77f1d989a2fce96171a160275f292[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Jul 2 20:33:36 2020 +0530

    [Osmoys] Douglas de search (#169)
    
    * adding code
    
    * updated goto and paginate
    
    * douglas_de_Search
    
    * build extractor
    
    * Douglas_de
    
    * resolved comments
    
    * fixed linting error
    
    * added inputs
    
    * resolved comments
    
    * updated navigation
    
    * fixed linting error
    
    * resolved comments
    
    Co-authored-by: Sai Manohar <saimanohar.p@osmosys.asia>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Shreyam Gupta <shreyam.g@osmosys.asia>
    Co-authored-by: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>

[33mcommit d0c7a994b3ab19367896df8286673ad0f8dcd62b[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Wed Jul 1 15:04:37 2020 -0700

    Scott kroger search (#233)
    
    * update xpaths
    
    * pending work on searchUrl
    
    * add search url manually
    
    * updated xpaths
    
    * add aggregateRating2 field
    
    * increased zip code timeouts
    
    * new files
    
    * deleted unneeded files
    
    * edit paginate to avoid dups
    
    * fix zip on search
    
    * removed zip for search
    
    * fixed paginate errors
    
    * updated upc xpath
    
    * new paginate xpaths
    
    * fix search dedups
    
    * resolve module dependency error
    
    * fix zip input
    
    * adding zip code
    
    * updated setzipcode
    
    * final zipcode fixes for search
    
    * add zip to extractor.yaml
    
    * added new transform
    
    * better syntax per PR
    
    * refactor zip code logic
    
    * moved import
    
    Co-authored-by: Bindu Datla <bindu.datla@import.io>

[33mcommit ffe14bd59461489621682d2b462f5447072a7d1d[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jul 1 09:43:15 2020 -0700

    Update issue templates

[33mcommit 0916eefdb1a1724de0527dd8be2adf72f96371ba[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jul 1 09:42:31 2020 -0700

    Update issue templates

[33mcommit a04fcfb7acc9c45f659d5ae62534748059565b32[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jul 1 09:40:17 2020 -0700

    Update issue templates

[33mcommit bb1f8d1ca430e2d7397d17bdf453a4435253e820[m[33m ([m[1;31morigin/cvs-search[m[33m)[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Mon Jun 29 20:42:35 2020 +0530

    Ds core amazon pharmapacks us (#248)
    
    * saving changes
    
    * Updated the extract and xpath file
    
    * updated schema
    
    * Updated the xpaths
    
    * Updated the xpaths
    
    * Updated the xpaths
    
    * Updated the xpaths
    
    * Updated the code
    
    * Updated the xpaths
    
    * Fixed the linting issues
    
    * Updated the name field
    
    * Updated code
    
    * Updated the xpaths
    
    * Added the other fields
    
    * Updated code
    
    * Added the xpath and updated the code
    
    * Updated the code
    
    * Changedd the shared file
    
    * Updated the xpaths
    
    * updated other seller shipping
    
    * added asin column
    
    * saving changes
    
    * renamed to Image360Present
    
    * updated videos and removed sku
    
    * fixed regex
    
    * fixed wrong xpath
    
    * saving changes
    
    * updated largeImageCount
    
    * undid changes
    
    * removed test files
    
    * moved changes from base amazon US to pharmapacks
    
    * updated schema
    
    * removed empty columns
    
    * updated code
    
    * undid changes to tesco
    
    * undid changes to tesco
    
    Co-authored-by: Lakshmi-Korlapati <lakshmi.k@osmosys.asia>
    Co-authored-by: nagajyothi.cp <nagajyothi.cp@osmosys.asia>

[33mcommit 4770610d72979c1ad7d373f94d60811bf5f61f6e[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Sat Jun 27 18:42:49 2020 -0400

    Template zipcode (#259)
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * Added new action to setzipcode
    
    * applying zipcode changes to search
    
    * updated robot.yaml
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 1ab70d8018abdc6bca3d8d56131919c47bcabcf9[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Sat Jun 27 11:55:27 2020 -0400

    Template zipcode (#258)
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * Added new action to setzipcode
    
    * applying zipcode changes to search
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit b1e566d9f686deed298e61ba0dccc57be60bc7ba[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Jun 26 21:36:40 2020 -0400

    Added new action to setzipcode (#257)

[33mcommit 942e78560fb7abe65ba6e9d48a06732c247dcbf5[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Fri Jun 26 18:53:41 2020 +0530

    [OSMOSYS] Elcorteingles ES core extractor (#52)
    
    * Added the details extractor for elcorteingles
    
    * Added the details extractor
    
    * Updated the folder names and country parameter name
    
    * Updated the extractor to get the data as per the new website structure
    
    * Updated the code and resolved the comments
    
    * Updated the code
    
    * Updated the code
    
    * Updated the code fixed the issue
    
    * Updated the brandLink
    
    * Reverted the config.yaml file
    
    * Updated the code added the try catch blocks
    
    * Updated the extract.yaml file
    
    * Removed the change in other file
    
    * Added the sample files
    
    * Updated the code for extractor, navigation file
    
    * Updated the textContent function in extract.yaml
    
    * Updated the extract.yaml file by changing the regExp
    
    * Fixed the linting issues
    
    * Updated the extract.js file
    
    * Updated the extract.js file
    
    * Updated the extract.js file
    
    * Resolved linting issues
    
    * Updated the createUrl file
    
    * Updated the file with latest schema
    
    Co-authored-by: Lakshmi-Korlapati <lakshmi.k@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit bec041bc7a8f183034c0808a6319cfaaf68e7d2c[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Thu Jun 25 20:26:31 2020 +0530

    [Osmosys] Amazon_Apparel us search (#242)
    
    * Created extractor.
    
    * Deployed extractor
    
    * Added inputs.
    
    * Fixed all the issue.
    
    * Updated input file.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>

[33mcommit 87a325489005e17893dde5884a1b6060c04cc20a[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jun 24 21:41:52 2020 -0400

    DS search Walmart us (#234)
    
    * transform and variants update
    
    * fixed typo
    
    * updated extract code to include tranform for all pages
    
    * lint fixes
    
    * xpath updates
    
    * xpaths and variantid
    
    * more fixes
    
    * updates on some fields
    
    * updates
    
    * tried iframe elements
    
    * Updates based on customer feedback
    
    * lint fixes
    
    * iframe elements
    
    * fixed issues reported and added searchUrl
    
    * product code regex update
    
    * updated xpath
    
    * updated to new schema element
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    * Updated paginate to include the noResultsXPath
    
    * removed walmart details changes
    
    * fixed eol
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 9c10f09ea343cd7fa3275db9287a50a4befd4180[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Jun 24 14:29:08 2020 -0700

    Walmart og search (#200)
    
    * Add field
    
    * Add new field and modify thumbnail value
    
    * Fix issue
    
    * Remove '%20'
    
    * D
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit 202262a85323d391158176e060662a13ffefe5ad[m
Author: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
Date:   Thu Jun 25 02:51:29 2020 +0530

    Updated with latest schema (#231)

[33mcommit 3cf7ecbd34cee164ceedd62b225fce31dbb8ece3[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jun 24 15:02:20 2020 -0400

    Shared transform (#232)
    
    * git ignore updated
    
    * merge with master
    
    * shared transform updates
    
    * shared file
    
    * updated extract.js
    
    * updated shared.js
    
    * remove invalid file
    
    * added the file back
    
    * removed data.json
    
    * eslint fixes
    
    * npm lint fixes
    
    * more lint fixes
    
    * updated shared transform on text only and also added to search
    
    * lint fixes
    
    * updated walmart transform
    
    * regex updates
    
    * fixed so that only characters 0-31 are removed
    
    * updated to remove 4byte characters
    
    * [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>
    
    Co-authored-by: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 52db97c48b3502068b3ab1a6c2c8b6efc0293076[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Tue Jun 23 22:16:57 2020 +0530

    [Osmosys] Carrefour es search (#163)
    
    * created to extractor.
    
    * Added pagination logic in the extract.js
    
    * Updated pagination code.
    
    * Updated country in  capital letter
    
    * Completed development.
    
    * Added row, rowOrganic column.
    
    * Fixed issue.
    
    * Fixed issue.
    
    * Added sponsored column.
    
    * Added scroll logic & removed next page navigation
    
    * Fixed sponsored issue.
    
    * Used different approach for pagination.
    
    * Capitalize country.
    
    * Resolved comments.
    
    * Removed custom implementation & passed timeout as parameter
    
    Co-authored-by: Nilesh <nilesh.b@osmosys.asia>
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit 050d8bb434641fa3e587f8a4f4fdae2c55168f41[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Tue Jun 23 18:21:53 2020 +0530

    [Osmosys] Carrefour es core (#221)
    
    * Migration completed.
    
    * Added missed columns
    
    * Fixed issue.
    
    * Fixed all the issue.
    
    * Updated, price per unit, price per unit uom, allergy advice and schema. Updated tests.
    
    * Fixed all the issue.
    
    * Fixed lint issue.
    
    * Fixed all the issue.
    
    * Fixed issue.
    
    * Resolved comments.
    
    * Resolved issue.
    
    * Resolved all the issue.
    
    * Resolved comments.
    
    * reduced code.
    
    * Added transform function
    
    * updated config file.
    
    * Resolved all the comments
    
    * Resolved comments.
    
    * added ts-ignore
    
    * Fixed category issue.
    
    * Removed unwanted columns.
    
    * Fixed new line issue.
    
    * Fixed all issue.
    
    * Fixed all the issue.
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit fcbd5e8418a77e53dd83a89c580546fad8835f8c[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Tue Jun 23 18:20:47 2020 +0530

    Ds search amazon pharmapacks us (#206)
    
    * Created extractor for amazon-pharma-daily
    
    * added extra keywords
    
    * pushing changes to github
    
    * saving changes
    
    * saving changes
    
    * fixed linting issues
    
    * syncyed file with master
    
    Co-authored-by: richa.t@osmosys.asia <richa.t@osmosys.asia>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 7ab13169951581efb1cb29296609131ddb764dc6[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Mon Jun 22 16:13:33 2020 -0700

    Mangalapally amazon fresh search (#223)
    
    * Manually add implementation JS to add waitforxpath
    
    * Add new field for review rating
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit 8cb66d5b695b2fee868be2d29829d3c11d01c8ae[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Tue Jun 23 01:23:39 2020 +0530

    [Osmosys] ASDA uk core (#196)
    
    * Updated asda details extractor
    
    * removed files
    
    * Updated inputs yaml file
    
    * Removed unwanted files
    
    * Removed unwanted domain files
    
    * Updated extract.yaml file
    
    * Updated yaml file
    
    * Added xpath to extrat.yaml file
    
    * Removed unwanted code
    
    * Updated extractor.yaml file
    
    Co-authored-by: Mamatha Gundapaneni <mamatha.g@osmosys.asia>
    Co-authored-by: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 5ea386dbc1169a7179865eb87a969f460058baa1[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Mon Jun 22 11:24:46 2020 -0700

    Scott kroger (#185)
    
    * add transform for product details
    
    * remove Perspective text from imageAlt
    
    * lint fix
    
    * transform fix and update item selector
    
    * update inputs to RPC
    
    * increased timeout on zip logic
    
    * lint fix
    
    * remove comments
    
    * drop to 100 inputs
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 203083383dd61c0ec46871318a9691ec9e7f1cb0[m
Author: radhakrishna-osm <66716612+radhakrishna-osm@users.noreply.github.com>
Date:   Mon Jun 22 23:27:52 2020 +0530

    [Osmosys] dm de core  (#173)
    
    * added details extractor for dm.de
    
    * deploying dm.de
    
    * added sample urls
    
    * added sample urls
    
    * updated new schema to the fields and fixed issues with many fields
    
    * Added missing fields in the extraction
    
    * fixed issues with product name extended quantity
    
    * fixed issues with total serving size uom
    
    * added test cases to the extractor
    
    * fixed issues with the extractor
    
    * fixed issues with the extractor
    
    * fixed extractor fields
    
    * fixed issue with availability test
    
    * fixed issues with ingrediants list
    
    * resolved pr comments
    
    * removed script to fetch uom's and moved to regex
    
    * resolved pr comments
    
    * reverted packagelocl.json
    
    * Resolved PR issues, Updated folder structure from de to DE
    
    * Added sku based navigation to the extractor
    
    * removed excess inputs
    
    Co-authored-by: ajayradhakrishna <ajayradhakrishna.t@osmosys.asia>
    Co-authored-by: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>

[33mcommit ca6136debdd1173a5b8568a2514a8676165567f8[m
Author: osmnilesh <49181438+osmnilesh@users.noreply.github.com>
Date:   Mon Jun 22 22:54:42 2020 +0530

    [Osmosys] Amazon runa us search (#202)
    
    * Deployed extractor.
    
    * Updated inputs.
    
    * Added inputs.
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 586039cfa1c3228e0b1fa00dd74f9e93f9882d89[m
Author: Sindhusha Balla <50326674+SindhuBalla@users.noreply.github.com>
Date:   Mon Jun 22 20:42:50 2020 +0530

    [Osmosys] Douglas de core: Updated brand & size schema names as per new data dictionary schema (#192)
    
    * Added schema, extract code support, inputs & samples
    
    * Added brandlink property
    
    * Created extractor from scratch.
    
    * Updated availability schema property name
    
    * Deployed extractor.
    
    * Removed code & added xpath
    
    * Added missing column.
    
    * Fixed all the issue.
    
    * Fixed all the issue.
    
    * Fixed lint issues
    
    * Deleted Douglas ES files
    
    * Reverted config.yaml change
    
    * Removed default implementation function & passed timeout as parameter
    
    * Updated brand & size schema names as per new data dictionary
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Nilesh <nilesh.b@osmosys.asia>
    Co-authored-by: Manas Ranjan <manas.n@osmosys.asia>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit b62415f0642946f6ddfecf8e1aae8b04e7648980[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Mon Jun 22 08:11:25 2020 -0700

    Scott kroger search (#186)
    
    * update xpaths
    
    * pending work on searchUrl
    
    * add search url manually
    
    * updated xpaths
    
    * add aggregateRating2 field
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit a98e82405f0dd242fb087edefa877a380d673463[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Mon Jun 22 08:07:57 2020 -0700

    Mangalapally walgreens search (#184)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    * Add missing fields
    
    * Fix lint issue
    
    * Remove extra line
    
    * Remove comments
    
    * Add functionality  when results is one page
    
    * Modify if statement
    
    * Modify rating
    
    * Remove ts-ignore comments
    
    * Fix ts errors
    
    * Make sure productInfo exists and also change price data
    
    * Make changes
    
    * Modify if statement
    
    * Modify obj key
    
    * added searchUrl with %20 filter
    
    * lint fix
    
    * searchUrl regex fix
    
    * add aggregateRating2 field
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 5b2a9cf3c64bff007825d80e7d657c09283d09f1[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Mon Jun 22 20:28:18 2020 +0530

    [Osmosys] Booker UK core extractor (#50)
    
    * Craeted the extractor
    
    * Updated the code
    
    * Added additional fields
    
    * updated code
    
    * Updated column names
    
    * Resolved comments
    
    * resolved the comments
    
    * Fixed the issues
    
    * Fixed issues
    
    * Fixed the issue
    
    * undid changes to config file
    
    * resolved the comments
    
    * Resolved the comments
    
    * Resolved comments
    
    * updated code
    
    * Updated test cases
    
    * Resolved the comments
    
    * updated the code
    
    Co-authored-by: nagajyothi.cp <nagajyothi.cp@osmosys.asia>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>
    Co-authored-by: Nagajyothi CP <45190178+CPNagaJyothi@users.noreply.github.com>

[33mcommit cd66bf935c14d62736a90bf26ead3b44514fcfb2[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Jun 19 14:31:57 2020 -0400

    Shared transform (#195)
    
    * git ignore updated
    
    * merge with master
    
    * shared transform updates
    
    * shared file
    
    * updated extract.js
    
    * updated shared.js
    
    * remove invalid file
    
    * added the file back
    
    * removed data.json
    
    * eslint fixes
    
    * npm lint fixes
    
    * more lint fixes
    
    * updated shared transform on text only and also added to search
    
    * lint fixes
    
    * updated walmart transform
    
    * regex updates
    
    * fixed so that only characters 0-31 are removed

[33mcommit 8f8b5856ed0225379e0eb53dc3c0ccc8aaf53480[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Jun 18 19:25:44 2020 +0530

    [Osmosys] Bestwaywholesale co uk Search (#162)
    
    * Added schema, paginate selectors, inputs & samples
    
    * Added transorm function to normalize product url & image url
    
    * Added rank in the custom transform function
    
    * Added execute implementation function
    
    * Added latest samples
    
    * Added comments
    
    * Removed code & added regExp
    
    * Removed custom implementation & used default timeout
    
    * Added trailing comma
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit e7dc23f2ffdc04f10f7f5eaa68b5b82a64dd3634[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Jun 18 19:24:42 2020 +0530

    [Osmosys] Elcorteingles deportes es core (#166)
    
    * added domain elcortiengle/deportes
    
    * Added wait and proxy for the source
    
    * finished building the extractor
    
    * updated urls
    
    * added test cases
    
    * fixed issues regarding the extractor
    
    * fixed issues with availability text
    
    * fixed issues with the extractor name and image fields
    
    Co-authored-by: ajayradhakrishna <ajayradhakrishna.t@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 950eea83f29cbb4953784f837368d8405085d553[m
Author: Sindhusha Balla <50326674+SindhuBalla@users.noreply.github.com>
Date:   Thu Jun 18 19:22:49 2020 +0530

    [Osmosys] Douglas de core (#181)
    
    * Added schema, extract code support, inputs & samples
    
    * Added brandlink property
    
    * Created extractor from scratch.
    
    * Updated availability schema property name
    
    * Deployed extractor.
    
    * Removed code & added xpath
    
    * Added missing column.
    
    * Fixed all the issue.
    
    * Fixed all the issue.
    
    * Fixed lint issues
    
    * Deleted Douglas ES files
    
    * Reverted config.yaml change
    
    * Removed default implementation function & passed timeout as parameter
    
    Co-authored-by: Sindhusha balla <sindhusha.b@osmosys.asia>
    Co-authored-by: Nilesh <nilesh.b@osmosys.asia>
    Co-authored-by: Manas Ranjan <manas.n@osmosys.asia>

[33mcommit 96517694d9ba051d43cea4a9f57fbc524cc2768a[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Jun 17 22:55:31 2020 -0700

    Mangalapally walgreens search (#112)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    * Add missing fields
    
    * Fix lint issue
    
    * Remove extra line
    
    * Remove comments
    
    * Add functionality  when results is one page
    
    * Modify if statement
    
    * Modify rating
    
    * Remove ts-ignore comments
    
    * Fix ts errors
    
    * Make sure productInfo exists and also change price data
    
    * Make changes
    
    * Modify if statement
    
    * Modify obj key
    
    * Update issue templates
    
    * added searchUrl with %20 filter
    
    * lint fix
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: David Skoglund <david.skoglund@import.io>
    Co-authored-by: alscotty <alawrencescott@gmail.com>

[33mcommit dadd07ab7948b831b34c38b002a1d3063f493fa0[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Jun 18 11:10:31 2020 +0530

    [Osmosys] Superdrug uk search (#167)
    
    * Created search extractor for superdrug
    
    * Removed and updated previous legacy id
    
    * Updated rank column and added sponsored column
    
    * updated schema and tests
    
    * saving changes
    
    * updated tests
    
    * Updated rank column
    
    * Fixed the images issue
    
    * Upadted no xpaths selector
    
    * Update superdrug.com.js
    
    * Update superdrug.com.js
    
    * Update superdrug.com.js
    
    * Fixed linting issues
    
    Co-authored-by: Mamatha Gundapaneni <mamatha.g@osmosys.asia>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>

[33mcommit 0552d228d0ba9e4ec69c5e04c6f56e80ded9fd44[m
Author: Shreyam Gupta <57482541+shreyamgupta@users.noreply.github.com>
Date:   Thu Jun 18 11:05:46 2020 +0530

    [Osmosys] Amazon apparel DE Search  (#176)
    
    * amazon_apparel_de_search
    
    * added inputs

[33mcommit a9aebb5e48363a9fb366895df714bcb24b1f0392[m
Author: manoj-dey <66370612+manoj-dey@users.noreply.github.com>
Date:   Thu Jun 18 11:05:11 2020 +0530

    created extractor for amazon prime now 75204 (#177)

[33mcommit 77b000fecfb21f0c3b4831aee3d6ca0a372f6bd5[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Wed Jun 17 22:34:36 2020 -0700

    Scott kroger (#179)
    
    * add transform for product details
    
    * remove Perspective text from imageAlt
    
    * lint fix

[33mcommit f84fcc8f52e722c3e7e1b3e2f0877ccafa0bb2cc[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Wed Jun 17 22:34:10 2020 -0700

    Scott kroger search (#180)
    
    * update xpaths
    
    * pending work on searchUrl
    
    * add search url manually

[33mcommit 4efaf920c334225077872ecef14698c36a823038[m
Author: NikitaNaredi18 <64261967+NikitaNaredi18@users.noreply.github.com>
Date:   Thu Jun 18 10:59:13 2020 +0530

    Synerzip lookfantastic uk search (#39)
    
    * Looksearch search variant
    
    * Lookfantastic search
    
    * Test push
    
    * Test cases
    
    * New Test cases
    
    * Revert config changes
    
    * ES-Lint changes
    
    * revert config changes
    
    * Revert config changes
    
    * Lookfantastic Core
    
    * Minor Fixes
    
    * Delete createUrl.js
    
    * Delete details.js
    
    * Delete execute.js
    
    * Delete extract.yaml
    
    * Delete extract.js
    
    * Delete extractor.yaml
    
    * Delete inputs.yaml
    
    * Resolved conflict
    
    Co-authored-by: Nick Leach <nickleach22@gmail.com>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit c97b9e8eb4fb214435b4931648b62f68d8f0c722[m
Author: akanshawajge-synerzip <61266736+akanshawajge-synerzip@users.noreply.github.com>
Date:   Thu Jun 18 10:55:44 2020 +0530

    initial commit (#20)
    
    * initial commit
    
    * The country param capitalized to: 'DE'.
    
    * folder name changed to capitaize country code
    
    * Code formatted for readability , proper spaces added and { } added for conditionals
    
    * formatting done
    
    * linting errors fixed
    
    * spacing error fixed
    
    * productUrl, price and rank related changes
    
    Co-authored-by: Akansha <akanshad.wajge@gmail.com>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit 30d9bd59974e85fd6a839f88a2eb156b2f52491b[m
Author: akanshawajge-synerzip <61266736+akanshawajge-synerzip@users.noreply.github.com>
Date:   Thu Jun 18 10:52:44 2020 +0530

    Synerzip medpex de core (#16)
    
    * initial commit
    
    * domains file comitted
    
    * extract.yaml's comments removed
    
    * data.json and config.yaml removed
    
    * config.yaml
    
    * The country param is capitalised to: 'DE'.
    
    * folder name changed to capitaize country code
    
    * Input changed to RPC after discussion in standup
    
    * Restored previous legacyid for mjgp2
    
    * Removed : custom implementation for url & comment from extract.js file
    
    * prefix added in url instead of string
    
    * url changed to customised implementation
    
    * url added in parameterValues
    
    * linting error fixed
    
    Co-authored-by: Akansha <akanshad.wajge@gmail.com>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit 7d42e7fcf266baf54ebb261b79929e1c0fdd3682[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 17 07:03:37 2020 -0700

    Update issue templates

[33mcommit d1a6b8c999e8011bd033f25371a887e568009274[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Wed Jun 17 02:06:21 2020 +0530

    [Osmosys] Waitrose uk core (#168)
    
    * added basic structure
    
    * updated the schema
    
    * updated
    
    * updated the brand and price_per_unit selectors
    
    * changing uk to UK
    
    * fixed all issues
    
    * updated filed names
    
    * reverted unwanted changes
    
    * updated the names in schema
    
    * resolved the issues
    
    * updated extractor
    
    * Fixed JS code.
    
    * fixed the issue with adding category and availabikty
    
    * fixed the issue unit_per_price
    
    * resolved all other issues
    
    * fixed all issues
    
    * wrote a code to remove \n
    
    * fixed lint issues
    
    * added sample url
    
    * updated
    
    * resolved the comment
    
    Co-authored-by: bhavani.a <bhavani.a@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit e5016e608364200f27b1e4f8d7933307bb91518c[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Wed Jun 17 02:05:01 2020 +0530

    [Osmosys] Booker uk search (#170)
    
    * Craeted the Seach extractor
    
    * Updated the testcases
    
    * updated config file
    
    * Updated the extractor
    
    * Updated code
    
    * updated status
    
    * Updated test cases
    
    * Resolved the comments
    
    Co-authored-by: nagajyothi.cp <nagajyothi.cp@osmosys.asia>
    Co-authored-by: Mamatha-Gundapaneni <46914469+Mamatha-Gundapaneni@users.noreply.github.com>

[33mcommit 85070f871c1f2c0b6b4739a62e1224ab7fdf70ab[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Tue Jun 16 13:45:53 2020 -0400

    Shared transform (#174)
    
    * git ignore updated
    
    * merge with master
    
    * shared transform updates
    
    * shared file
    
    * updated extract.js
    
    * updated shared.js
    
    * remove invalid file
    
    * added the file back
    
    * removed data.json
    
    * eslint fixes
    
    * npm lint fixes
    
    * more lint fixes
    
    * updated shared transform on text only and also added to search
    
    * lint fixes
    
    * updated walmart transform
    
    * regex updates
    
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 3aa72267e20a3c14f0e0eb2da9bed981822ed1bf[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Tue Jun 16 09:10:55 2020 -0700

    Mangalapally foodservice (#108)
    
    * Compelete core extraction
    
    * Clean up xpaths and add more fields for Core Extended
    
    * Clean up code
    
    * Remove comments and lines
    
    * Remove comment
    
    * Update to work with the last changes
    
    * Change field for 360
    
    * Add loaded selector and no results xpath
    
    * Modify extract file if product link does not exist anymore
    
    * Remove unnecessary lines
    
    * Edit field name and trim description for now
    
    * Add missing nutrition info
    
    * Edit gtin field for accuracy
    
    * Fix mispelling
    
    * Remove custom trim
    
    * Change to correct field
    
    * Add more fields
    
    * Comment out with custom JS functionality and add new field for sec image count
    
    * Change back to fields after confirmation
    
    * Add serving size UOM
    
    * Remove ts-ignore comments and fix ts issues
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 7b2c279887199f53bd9000a3bd6570baa1314bf7[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Tue Jun 16 21:10:25 2020 +0530

    Superdrug uk details (#25)
    
    * migrated domain, updated schema and generated tests
    
    * changed country to UK
    
    * updated schema and tests accordingly
    
    * changed schema column names
    
    * changed ingredients_list to ingredientsList
    
    * updated error in schema and generated tests
    
    * undid changes in config file, changed id value to number
    
    * updated tests with two inputs
    
    * changed country to UK
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 9150414316da17344ec20fbcac00ce3fb4fd5074[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Tue Jun 16 08:36:26 2020 -0700

    Scott kroger (#113)
    
    * migrate changes and fix pricing issue on kroger product/details
    
    * fix undefined if not found bug
    
    * edit and deploy to workbench
    
    * add inputs
    
    * fix timing delay
    
    * xpath and input updates
    
    * fix input
    
    * fix some input names
    
    * extract.yaml naming fixes and update xpaths
    
    * format fix and remove raw.json
    
    * add zip code logic for core
    
    * lint fixes
    
    * add new test branch workbench
    
    * fix zip code bug
    
    * npm lint fixes
    
    * other merge fix
    
    * consolidated zip code logic to goto implementation
    
    * final lint fixes
    
    * syntax fixes
    
    * fix linting errors
    
    * url fix
    
    * updated url
    
    * xpath improvements
    
    * update nutrition xpaths
    
    * removed unneeded undefined check
    
    * update fibre typo
    
    * xpath adjustments
    
    * lint fixes
    
    * ratings/reviews xpaths
    
    * xpath update for brand and secondaryImageCount
    
    * fix default values xpaths
    
    * improved xpaths
    
    * additional updates for xpaths
    
    * edit xpaths per ascential review
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: Bindu Datla <bindu.datla@import.io>

[33mcommit b15b12e498fd3279bce363e26af0723e8c3995e3[m
Author: vikas kyatannawar <49167922+vikas-kyatannawar@users.noreply.github.com>
Date:   Sat Jun 13 06:20:56 2020 +0530

    removed unused code (#158)

[33mcommit 6d78a2fca73cd08211f8abdb94e7ea9184058c24[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Fri Jun 12 17:50:27 2020 -0700

    Scott kroger search (#160)
    
    * starting migration
    
    * working paginate
    
    * add more fields to yaml
    
    * new xpaths
    
    * test inputs
    
    * input fix
    
    * add 500 inputs for search
    
    * add sponsored rank
    
    * added zip code
    
    * search zip fix
    
    * fix productUrl xpath
    
    * consolidated shared zip code logic, lint fix
    
    * add noresults xpath, id fields
    
    * id regex fix

[33mcommit d4fd9065c53ed2dcd7b89d29c87430bc2965bd2d[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Jun 12 20:48:29 2020 -0400

    Cvs transform (#110)
    
    * transform updates
    
    * transform changes
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit a286ff76a7ca77ab0c4ebb1eee0a305063911f9d[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Fri Jun 12 11:51:16 2020 -0400

    Walmart og search (#114)
    
    * initial setup
    
    * changed yaml
    
    * training issue for id and productUrl
    
    * fixed extraction issues
    
    * merged
    
    * added transform
    
    * changes from review
    
    * Fixed Issue with navigation implementation
    
    * modified xpath for noResultsXPath
    
    * Merge branch 'master' into walmartOG-search
    
    * Fixed pagination
    
    * Fixed timeout Issues for next page , with no results

[33mcommit c19755d216c37105c54a5d63dba439fd418837a2[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Thu Jun 11 11:45:47 2020 -0700

    Scott kroger (#107)
    
    * migrate changes and fix pricing issue on kroger product/details
    
    * fix undefined if not found bug
    
    * edit and deploy to workbench
    
    * add inputs
    
    * fix timing delay
    
    * xpath and input updates
    
    * fix input
    
    * fix some input names
    
    * extract.yaml naming fixes and update xpaths
    
    * format fix and remove raw.json
    
    * add zip code logic for core
    
    * lint fixes
    
    * add new test branch workbench
    
    * fix zip code bug
    
    * npm lint fixes
    
    * other merge fix
    
    * consolidated zip code logic to goto implementation
    
    * final lint fixes
    
    * syntax fixes
    
    * fix linting errors
    
    * url fix
    
    * updated url
    
    * xpath improvements
    
    * update nutrition xpaths
    
    * removed unneeded undefined check
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 9111b6cbb3bfdd601cc567c5cc4856e5cc521ffb[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Thu Jun 11 14:36:07 2020 -0400

    Walmart transform (#109)
    
    * transform updates
    
    * lint fixes

[33mcommit 9b78b47b6f39736f69d816fb843d071e15a1faf2[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Thu Jun 11 10:28:09 2020 -0700

    Scott kroger search (#43)
    
    * starting migration
    
    * working paginate
    
    * add more fields to yaml
    
    * new xpaths
    
    * test inputs
    
    * input fix
    
    * add 500 inputs for search
    
    * add sponsored rank
    
    * added zip code
    
    * search zip fix
    
    * fix productUrl xpath
    
    * consolidated shared zip code logic, lint fix

[33mcommit 48cfeefc0de1831aaa60b201ed9724277276c26d[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Thu Jun 11 11:03:15 2020 -0400

    Walmart product/search (#106)
    
    * Initial setup for walmart
    
    * git ignore updated
    
    * merges and deploy changes
    
    * updated xpaths for search
    
    * extractor deployed
    
    * added sponsored column
    
    * added a shared transform
    
    * transform action added
    
    * Updated for handling keywords and Keywords and other minor updates
    
    * handling when second page has no results handling
    
    * update schema elements
    
    * updated timeout

[33mcommit f81e14435ad0c1b2113f707cc6ef99554e901fd2[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Thu Jun 11 12:14:55 2020 +0530

    [Osmosys] Tesco UK search extractor (#54)
    
    * saving changes
    
    * adding test data
    
    * uppercase UK
    
    * capitalized coutnry
    
    * updated tests
    
    * added interaction function to paginate action
    
    * updated schema file
    
    * Added interaction function to execute
    
    * saving changes
    
    * Updated schema for rank as per suggestion in call
    
    * updated tests
    
    * added transform
    
    * updated tests
    
    * updated tests
    
    * fixed lint issue
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 605b1b6c31f710d09dffb6621f9a4e664c9f07ba[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Jun 10 18:30:08 2020 -0700

    Mangalapally walgreens search (#105)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    * Add missing fields
    
    * Fix lint issue
    
    * Remove extra line
    
    * Remove comments
    
    * Add functionality  when results is one page
    
    * Modify if statement
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit c72274009daaf75749365818068cbc41c8598ea3[m
Author: Satyam Rathod <satyam.rathod@synerzip.com>
Date:   Thu Jun 11 05:34:46 2020 +0530

    Synerzip medikamente per klick de search (#81)
    
    * Initial commit for mediakamente-per-klick Search variant
    
    * xpath added to yaml file
    
    * Inputs updated and test cases added
    
    * config restored
    
    * domain attached to the image url
    
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit f28315bf4cc5053967adb4a132ceb03d83b83643[m
Author: irfanshaikh138 <45287410+irfanshaikh138@users.noreply.github.com>
Date:   Thu Jun 11 05:33:59 2020 +0530

    Initial commit for shop-apotheke search extractor (#21)
    
    * Initial commit for shop-apotheke search extractor
    
    * Uppercase de
    
    * added navigation/goto shop-apotheke file
    
    Co-authored-by: Cori Fowler <cori.fowler@import.io>

[33mcommit 62ee61f811b29a2bcfeb382d22b6080905738978[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jun 10 19:59:54 2020 -0400

    extractor ids (#102)

[33mcommit 9874bc08a9f1fdd9653f538bf00d2c30b0ffa147[m
Author: Jonathan Campbell <45703069+jon-campbell1@users.noreply.github.com>
Date:   Wed Jun 10 16:59:32 2020 -0700

    Additional xpath finetuning (#103)
    
    * Initial Commit
    
    * Target Search
    
    * US Fix
    
    * Target Search Inputs
    
    * Fixes
    
    * uppercase country code
    
    * Update extract.js
    
    * Rename src/library/product/details/stores/t/target/us/createUrl.js to src/library/product/details/stores/t/target/US/createUrl.js
    
    * Fixes
    
    * Folder rename
    
    * folder rename
    
    * folder rename
    
    * Folder rename'
    
    * Modified search thumbnail xpath
    
    * Removed Unecessary Stall
    
    * Added Endorsement Text xPath
    
    * Video and Variation xPaths
    
    * Code Cleanup
    
    * Changed thumbnail xpath
    
    * Videos xPath
    
    * VariantCount
    
    * Lint Fixes
    
    * Removed Kroger File
    
    * Removed else block
    
    * template string
    
    * Return extract
    
    * Merged Conflicts Resolved
    
    * Check if user has landed on category page
    
    * Inputs
    
    * Category to searchpage redirection
    
    * Reverting some changes
    
    * Reverting some changes
    
    * Update execute.js
    
    * Remove console
    
    * Finetuning extraction
    
    * Keywords
    
    * lint fix
    
    * Lint Fixes
    
    * Lint Fixes
    
    * More lint fixes
    
    * lint fixes
    
    * Removed comments
    
    * Fixes
    
    * lint fix
    
    * Lint Fix
    
    * xPath finetuning
    
    * availibility check
    
    * Id field
    
    * Keywords Check
    
    * additional xpaths/fixes
    
    * Lint fixes
    
    * MR fix
    
    Co-authored-by: Jjon Campbell <jon.campbell@BOTNUSJONATHAN.local>

[33mcommit 2e70db262cd2c68922095e73c9f71ba7f47797b3[m
Author: dkirkpatrick-importIo <65569612+dkirkpatrick-importIo@users.noreply.github.com>
Date:   Wed Jun 10 16:58:48 2020 -0700

    Cvs kirkpatrick (#104)
    
    * cvs-us
    
    * finishing CVS
    
    * changes to core schema
    
    * changes to search
    
    * search schema
    
    * cvs extractor'
    
    * core schema
    
    * core search updates
    
    * CVS core and search updates
    
    * updates for pull request
    
    * fixed formatting errors
    
    * var fix
    
    * back ticks
    
    * removed $
    
    * added transforms to format.js
    
    * fixed extract.js
    
    * fixed trailing space

[33mcommit 7dbb1d160fb909b7249835d31797acb047735e6f[m
Author: dkirkpatrick-importIo <65569612+dkirkpatrick-importIo@users.noreply.github.com>
Date:   Wed Jun 10 14:47:56 2020 -0700

    Cvs kirkpatrick (#100)
    
    * cvs-us
    
    * finishing CVS
    
    * changes to core schema
    
    * changes to search
    
    * search schema
    
    * cvs extractor'
    
    * core schema
    
    * core search updates
    
    * CVS core and search updates
    
    * updates for pull request
    
    * fixed formatting errors
    
    * var fix
    
    * back ticks
    
    * removed $
    
    * added transforms to format.js

[33mcommit 74554e8778444225c496ab9598db14fd6ca04f8c[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Wed Jun 10 16:53:28 2020 -0400

    Walmart og details (#98)
    
    * initial setup
    
    * updated price and listprice
    
    * Run Remote throws Error: Service worker registration failed
    
    * updated price and listprice
    
    * test
    
    * Reverted to API Call
    
    * Fixed missing price/online_price
    
    * fixed lazy load issues
    
    * schema changes
    
    * fixed waitTimeout errors and size schema
    
    * updated details schema
    
    * updated with details.execute for loadedselector
    
    * updated with prod extractor
    
    * changes to schema.yaml
    
    * Fixed training issues
    
    * deleted details s chema.yaml
    
    * Adding details.schema.yaml
    
    * fixed lint errors
    
    * added transform
    
    * fixed availabilityText
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit f42978557c76abda93f59d8c4f1c5358d3c32e41[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Wed Jun 10 13:52:58 2020 -0700

    Scott kroger (#26)
    
    * migrate changes and fix pricing issue on kroger product/details
    
    * fix undefined if not found bug
    
    * edit and deploy to workbench
    
    * add inputs
    
    * fix timing delay
    
    * xpath and input updates
    
    * fix input
    
    * fix some input names
    
    * extract.yaml naming fixes and update xpaths
    
    * format fix and remove raw.json
    
    * add zip code logic for core
    
    * lint fixes
    
    * add new test branch workbench
    
    * fix zip code bug
    
    * npm lint fixes
    
    * other merge fix
    
    * consolidated zip code logic to goto implementation
    
    * final lint fixes
    
    * syntax fixes
    
    * fix linting errors
    
    * url fix
    
    * updated url
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 6ccb7dd2a00814f09cf877c4ec4442435d3d86c8[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Wed Jun 10 16:35:58 2020 -0400

    Walmart og details (#93)
    
    * initial setup
    
    * updated price and listprice
    
    * Run Remote throws Error: Service worker registration failed
    
    * updated price and listprice
    
    * test
    
    * Reverted to API Call
    
    * Fixed missing price/online_price
    
    * fixed lazy load issues
    
    * schema changes
    
    * fixed waitTimeout errors and size schema
    
    * updated details schema
    
    * updated with details.execute for loadedselector
    
    * updated with prod extractor
    
    * changes to schema.yaml
    
    * Fixed training issues
    
    * deleted details s chema.yaml
    
    * Adding details.schema.yaml
    
    * fixed lint errors
    
    * added transform
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit 7bb79c75bf6c22a50e0e16ac04e38814a3704fa1[m
Author: dkirkpatrick-importIo <65569612+dkirkpatrick-importIo@users.noreply.github.com>
Date:   Wed Jun 10 13:33:57 2020 -0700

    Cvs kirkpatrick (#94)
    
    * cvs-us
    
    * finishing CVS
    
    * changes to core schema
    
    * changes to search
    
    * search schema
    
    * cvs extractor'
    
    * core schema
    
    * core search updates
    
    * CVS core and search updates
    
    * updates for pull request
    
    * fixed formatting errors
    
    * var fix
    
    * back ticks
    
    * removed $

[33mcommit 59202e9e5237524a6785b1d360c94d6ce63ab967[m
Author: Jonathan Campbell <45703069+jon-campbell1@users.noreply.github.com>
Date:   Wed Jun 10 13:26:45 2020 -0700

    Target Search Fixes (#65)
    
    * Initial Commit
    
    * Target Search
    
    * US Fix
    
    * Target Search Inputs
    
    * Fixes
    
    * uppercase country code
    
    * Update extract.js
    
    * Rename src/library/product/details/stores/t/target/us/createUrl.js to src/library/product/details/stores/t/target/US/createUrl.js
    
    * Fixes
    
    * Folder rename
    
    * folder rename
    
    * folder rename
    
    * Folder rename'
    
    * Modified search thumbnail xpath
    
    * Removed Unecessary Stall
    
    * Added Endorsement Text xPath
    
    * Video and Variation xPaths
    
    * Code Cleanup
    
    * Changed thumbnail xpath
    
    * Videos xPath
    
    * VariantCount
    
    * Lint Fixes
    
    * Removed Kroger File
    
    * Removed else block
    
    * template string
    
    * Return extract
    
    * Merged Conflicts Resolved
    
    * Check if user has landed on category page
    
    * Inputs
    
    * Category to searchpage redirection
    
    * Reverting some changes
    
    * Reverting some changes
    
    * Update execute.js
    
    * Remove console
    
    * Finetuning extraction
    
    * Keywords
    
    * lint fix
    
    * Lint Fixes
    
    * Lint Fixes
    
    * More lint fixes
    
    * lint fixes
    
    * Removed comments
    
    * Fixes
    
    * lint fix
    
    * Lint Fix
    
    Co-authored-by: Jjon Campbell <jon.campbell@BOTNUSJONATHAN.local>

[33mcommit b9c5d6561eefcef68a3bcdd786d9ca6302c4e8f6[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Jun 10 13:13:41 2020 -0700

    Mangalapally foodservice (#27)
    
    * Compelete core extraction
    
    * Clean up xpaths and add more fields for Core Extended
    
    * Clean up code
    
    * Remove comments and lines
    
    * Remove comment
    
    * Update to work with the last changes
    
    * Change field for 360
    
    * Add loaded selector and no results xpath
    
    * Modify extract file if product link does not exist anymore
    
    * Remove unnecessary lines
    
    * Edit field name and trim description for now
    
    * Add missing nutrition info
    
    * Edit gtin field for accuracy
    
    * Fix mispelling
    
    * Remove custom trim
    
    * Change to correct field
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>
    Co-authored-by: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>

[33mcommit c4fe054031a774b0c5e691b1783027bd43d4e4bd[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Wed Jun 10 13:08:13 2020 -0700

    Mangalapally walgreens search (#92)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    * Add missing fields
    
    * Fix lint issue
    
    * Remove extra line
    
    * Remove comments
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit 0eefda3aba5bd4c3398932e0afab18909544e3a7[m
Author: dkirkpatrick-importIo <65569612+dkirkpatrick-importIo@users.noreply.github.com>
Date:   Wed Jun 10 12:59:47 2020 -0700

    Cvs kirkpatrick (#90)
    
    * cvs-us
    
    * finishing CVS
    
    * changes to core schema
    
    * changes to search
    
    * search schema
    
    * cvs extractor'
    
    * core schema
    
    * core search updates
    
    * CVS core and search updates
    
    * updates for pull request
    
    * fixed formatting errors
    
    * var fix

[33mcommit 9603b9ca28ce61b95c4cfcf5ae031a4edfda6672[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Wed Jun 10 15:40:39 2020 -0400

    Walmart og details (#32)
    
    * initial setup
    
    * updated price and listprice
    
    * Run Remote throws Error: Service worker registration failed
    
    * updated price and listprice
    
    * test
    
    * Reverted to API Call
    
    * Fixed missing price/online_price
    
    * fixed lazy load issues
    
    * schema changes
    
    * fixed waitTimeout errors and size schema
    
    * updated details schema
    
    * updated with details.execute for loadedselector
    
    * updated with prod extractor
    
    * changes to schema.yaml
    
    * Fixed training issues
    
    * deleted details s chema.yaml
    
    * Adding details.schema.yaml
    
    * fixed lint errors

[33mcommit ef6846e41ef2de16fecf50313853db2892e475e0[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jun 10 15:14:38 2020 -0400

    Shared transform (#88)
    
    * git ignore updated
    
    * merge with master
    
    * shared transform updates
    
    * shared file
    
    * updated extract.js
    
    * updated shared.js
    
    * remove invalid file
    
    * added the file back
    
    * removed data.json
    
    * eslint fixes
    
    * npm lint fixes
    
    * more lint fixes
    
    * disabling failed linting lines
    
    Co-authored-by: Maren Woodruff <marenwoodruff@gmail.com>

[33mcommit ac9379d145ad19ea07ac8fde7f1dc4ba20c9e6a5[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 11:59:00 2020 -0700

    Update issue templates naming conventions

[33mcommit 7d5642a379a900e25d4151e19a081114396ff626[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 11:53:36 2020 -0700

    Update issue templates removing unwanted text from

[33mcommit b8160bbfda74ee9a8e2b38a3d5437760e613bc05[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 11:02:06 2020 -0700

    Update issue templates final additions

[33mcommit a6e8565b12a3b60d318093267fcd864bdd6d1a55[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 10:51:18 2020 -0700

    Update issue template `Digital Shelf Build Template` project promotion steps

[33mcommit 913300cf9688dd66755c0e56bb515d4a807fba57[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 10:32:01 2020 -0700

    Update issue template `Digital Shelf Build Template` - no more PLEASE

[33mcommit 1c41e84b3f2698b0d39478c0778ba4fac838ce32[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 10:25:06 2020 -0700

    Update issue templates

[33mcommit 226b3ce0eb730f969f06b5253f2fa221005b2adc[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 10:16:34 2020 -0700

    Update issue template `Digital Shelf Build Template` with minor changes to template

[33mcommit 9a1e554367e4ed86e577edf1884db2dc9abeaf78[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 09:48:56 2020 -0700

    Update issue template `Digital Shelf Build Template` with minor changes to build directions

[33mcommit 771911654fd5b817de6ce5f1d0b9363347d5ddbe[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 09:34:56 2020 -0700

    Update issue template `Digital Shelf Build Template` with minor changes to github directions

[33mcommit eab1935b4d42ce1bda172beca2cff9a3bb1ba18f[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Wed Jun 10 09:26:32 2020 -0700

    Update issue templates with new `Digital Shelf Build Template`

[33mcommit 692664ce3133858aa87e957d1b5c7923e32ab55f[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Wed Jun 10 07:32:14 2020 -0700

    Create node.js.yml

[33mcommit faeeef80ebd14f8d0aaabf34525788fe6ce190ab[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Tue Jun 9 16:03:03 2020 -0700

    Mangalapally walgreens search (#49)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    * Add correct price - current or sale
    
    * Fix price format
    
    * Add space
    
    * Change extractor number
    
    * Add back the correct extractor
    
    * Add https for picture url
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit b2df5dab5b3fab74900f0dcfd664ea46ff3ffe37[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Wed Jun 10 04:24:34 2020 +0530

    Added search extractor files (#56)
    
    Co-authored-by: Mamatha Gundapaneni <mamatha.g@osmosys.asia>

[33mcommit 7d31d8ded243efaacf3a1558adb8d39d05748130[m
Author: Jonathan Campbell <45703069+jon-campbell1@users.noreply.github.com>
Date:   Tue Jun 9 15:50:03 2020 -0700

    Video & Variations xpaths (#55)
    
    * Initial Commit
    
    * Target Search
    
    * US Fix
    
    * Target Search Inputs
    
    * Fixes
    
    * uppercase country code
    
    * Update extract.js
    
    * Rename src/library/product/details/stores/t/target/us/createUrl.js to src/library/product/details/stores/t/target/US/createUrl.js
    
    * Fixes
    
    * Folder rename
    
    * folder rename
    
    * folder rename
    
    * Folder rename'
    
    * Modified search thumbnail xpath
    
    * Removed Unecessary Stall
    
    * Added Endorsement Text xPath
    
    * Video and Variation xPaths
    
    * Code Cleanup
    
    * Changed thumbnail xpath
    
    * Videos xPath
    
    * VariantCount
    
    * Lint Fixes
    
    * Removed Kroger File
    
    * Removed else block
    
    * template string
    
    Co-authored-by: Jjon Campbell <jon.campbell@BOTNUSJONATHAN.local>

[33mcommit f1191dc775cee84e13dff89fd127a50d127fd60d[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Wed Jun 10 03:52:50 2020 +0530

    [Osmosys] Elcorteingles ES search extractor (#51)
    
    * Added elcorteingles.es search extractor
    
    * Updated the code
    
    * saving changes
    
    * Updated the code to get the rank
    
    * Updated the thumbnail issue
    
    * Reverted the config file
    
    * Updated the regExp
    
    * Updated the code
    
    Co-authored-by: Lakshmi-Korlapati <lakshmi.k@osmosys.asia>
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>

[33mcommit 0ee98a88a5d7ac129e865f31dd746c5703cd1da8[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Tue Jun 9 16:51:46 2020 -0400

    Walmart.com product/details (#57)
    
    * Initial setup for walmart
    
    * git ignore updated
    
    * merges and deploy changes
    
    * updated to take RPC or SKU as inputs
    
    * updating gitignore
    
    * added missing fields
    
    * xpaths update
    
    * added transform for nutrition info
    
    * handling edge cases
    
    * updated asin and also added configuration for xpath
    
    * videos xpath

[33mcommit 3bc338356287652da6b3a2964a37a6c457a8d791[m
Author: Jonathan Campbell <45703069+jon-campbell1@users.noreply.github.com>
Date:   Tue Jun 9 09:03:22 2020 -0700

    Modified thumbnail & Endorsement Text xpath for search (#34)
    
    * Initial Commit
    
    * Target Search
    
    * US Fix
    
    * Target Search Inputs
    
    * Fixes
    
    * uppercase country code
    
    * Update extract.js
    
    * Rename src/library/product/details/stores/t/target/us/createUrl.js to src/library/product/details/stores/t/target/US/createUrl.js
    
    * Fixes
    
    * Folder rename
    
    * folder rename
    
    * folder rename
    
    * Folder rename'
    
    * Modified search thumbnail xpath
    
    * Removed Unecessary Stall
    
    * Added Endorsement Text xPath
    
    Co-authored-by: Jjon Campbell <jon.campbell@BOTNUSJONATHAN.local>

[33mcommit 5f66742132d757f431a2d0410f360488ce1fd95a[m
Author: Manas Ranjan <38726977+manasnilaroutOSM@users.noreply.github.com>
Date:   Tue Jun 9 21:29:07 2020 +0530

    [Osmosys] Tesco UK core extractor (#36)
    
    * saving changes
    
    * added tests
    
    * uppercase UK
    
    * capitalizing folder
    
    * capitalized test folder
    
    * updated schema
    
    * deployed and added updated scehema tests
    
    * updated schema to avoid any potential issue with regex
    
    * updated schema and tests
    
    * updated schema and tsts
    
    * updated tests after QA pass and undid config.yaml changes
    
    Co-authored-by: Vikas Kyatannawar <vikas.k@osmosys.asia>

[33mcommit f8a7bf2295789e70c810c1717e2383d1e060a21a[m
Author: Neha Shende <neha.shende@synerzip.com>
Date:   Tue Jun 9 21:24:05 2020 +0530

    Core extractor for source Samsclub (#17)
    
    * Core extractor for source Samsclub
    
    * Capitalized the country us to US

[33mcommit 3c8541073973620ae64001ad0a0a7c7adeb91d52[m
Author: irfanshaikh138 <45287410+irfanshaikh138@users.noreply.github.com>
Date:   Tue Jun 9 20:38:33 2020 +0530

    Synerzip shop apotheke core (#38)
    
    * Initial commit for shop-apotheke-details
    
    * shop-apotheke core extractor

[33mcommit 691a4b1a9aeb929c10b412418f140a3aacd70f13[m
Author: nishatb <61678681+nishatb@users.noreply.github.com>
Date:   Tue Jun 9 20:35:27 2020 +0530

    Initial commit for flaconi DE core source (#40)
    
    * Initial commit for flaconi DE core source
    
    * changing function name to camelCase
    
    Co-authored-by: Nishat Bagwan <nishatb@synerzipune.local>

[33mcommit 48498e951c7110ba69ef3e00c5e0188bd50fa738[m
Author: Satyam Rathod <satyam.rathod@synerzip.com>
Date:   Tue Jun 9 20:32:10 2020 +0530

    Synerzip medikamente per klick de core (#42)
    
    * Initial commit for medikamente-per-klick - core
    
    * test cases added by updating xpath yaml file for medikante-per-klick
    
    * config file restored for legacy account ID
    
    * The country code Capitalized: DE

[33mcommit aa56e07e2c3f33aa55fae1935b7fcec4ffd0674a[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Tue Jun 9 07:48:29 2020 -0700

    Amazon goto implementation updated (#44)
    
    * Updated navigation/domains to handle goto logic, removed goto  logic from  incorrect location.
    
    * Ran npm lint

[33mcommit 232bf94b329896d3d98800d49033f52cea701aed[m
Author: nishatb <61678681+nishatb@users.noreply.github.com>
Date:   Tue Jun 9 20:17:48 2020 +0530

    Initial commit for flaconi de search source (#45)
    
    Co-authored-by: Nishat Bagwan <nishatb@synerzipune.local>

[33mcommit 6a3c11602c81845ebbfd97a28d47f35738727670[m
Author: NikitaNaredi18 <64261967+NikitaNaredi18@users.noreply.github.com>
Date:   Tue Jun 9 20:17:10 2020 +0530

    Synerzip lookfantastic uk core (#46)
    
    * Lookfantastic Core extractor
    
    * Test cases

[33mcommit c4b6719855e883a28dd256623d222b049e135488[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Tue Jun 9 10:46:29 2020 -0400

    Walmart og search (#47)
    
    * initial setup
    
    * changed yaml
    
    * training issue for id and productUrl
    
    * fixed extraction issues
    
    * merged
    
    * added transform
    
    * changes from review
    
    * Fixed Issue with navigation implementation
    
    * modified xpath for noResultsXPath

[33mcommit 1a9849668c64e2c7c5d2dff583ce02b15bffca45[m
Author: Sourabh Karmarkar <sourabh.karmarkar@synerzip.com>
Date:   Tue Jun 9 20:16:10 2020 +0530

    Synerzip santediscount fr search (#48)
    
    * Added basic code for extraction of fields for SanteDiscount search only
    
    * Added more inputs and generated and ran unit test for SanteDiscount Search only
    
    * Added correction rank_organic calculation and added ts ignore for innerText
    
    * Generated and ran unit tests after new changes

[33mcommit b20189ca8756c57e1e442e389eebd44cc9428c0a[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Sun Jun 7 23:59:13 2020 -0400

    Walmart og search (#33)
    
    * initial setup
    
    * changed yaml
    
    * training issue for id and productUrl
    
    * fixed extraction issues
    
    * merged
    
    * added transform
    
    * changes from review
    
    * Fixed Issue with navigation implementation

[33mcommit 4ee7e44008c07dd363e1b9ccad17ac1d07812b84[m
Author: Jonathan Campbell <45703069+jon-campbell1@users.noreply.github.com>
Date:   Sat Jun 6 22:20:17 2020 -0700

    Target Extended Core (#11)
    
    * Initial Commit
    
    * Target Search
    
    * US Fix
    
    * Target Search Inputs
    
    * Fixes
    
    * uppercase country code
    
    * Update extract.js
    
    * Rename src/library/product/details/stores/t/target/us/createUrl.js to src/library/product/details/stores/t/target/US/createUrl.js
    
    * Fixes
    
    * Folder rename
    
    * folder rename
    
    * folder rename
    
    * Folder rename'
    
    Co-authored-by: Jjon Campbell <jon.campbell@BOTNUSJONATHAN.local>

[33mcommit 7a332f1212d158a381e086927d768b9964fcbbe6[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Sat Jun 6 22:19:33 2020 -0700

    Amazon Core Schema update (#30)
    
    * Amazon dave skoglunds commit.
    
    * Amazon extractors.
    
    * .DS_Store banished!, thanks Nick
    
    * copied from master to allow PR.
    
    * updating schema to merge to master without issue.
    
    * amazon latest
    
    * Revert paths
    
    * Create url
    
    * Switch to default implemenation
    
    * Deployed extractor
    
    * deployed amazonFresh Extractors, still need to update schema
    
    * amazon search schema updates
    
    * updated amazon and amazonFresh core schema
    
    * amazon sample inputs
    
    Co-authored-by: dave skoglund <daveskoglund@daves-MacBook-Pro-2.local>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit fde8c124db68785ec2f7627462d14269632ca9e0[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Sun Jun 7 01:18:42 2020 -0400

    Walmart og details (#31)
    
    * initial setup
    
    * updated price and listprice
    
    * Run Remote throws Error: Service worker registration failed
    
    * updated price and listprice
    
    * test
    
    * Reverted to API Call
    
    * Fixed missing price/online_price
    
    * fixed lazy load issues
    
    * schema changes
    
    * fixed waitTimeout errors and size schema

[33mcommit 242acec42bfef1e7c98e522ee1bb2b39249e71c2[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Sat Jun 6 01:00:46 2020 -0400

    Walmart og search (#22)
    
    * initial setup
    
    * changed yaml
    
    * training issue for id and productUrl
    
    * fixed extraction issues
    
    * merged
    
    * added transform
    
    * changes from review
    
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit 829878499aa918c1dee13593bb5bdb73de2a783c[m
Author: David Skoglund <david.skoglund@import.io>
Date:   Fri Jun 5 21:51:06 2020 -0700

    Dave skoglund amazon schema (#14)
    
    * Amazon dave skoglunds commit.
    
    * Amazon extractors.
    
    * .DS_Store banished!, thanks Nick
    
    * copied from master to allow PR.
    
    * updating schema to merge to master without issue.
    
    * amazon latest
    
    * Revert paths
    
    * Create url
    
    * Switch to default implemenation
    
    * Deployed extractor
    
    * deployed amazonFresh Extractors, still need to update schema
    
    * amazon search schema updates
    
    Co-authored-by: dave skoglund <daveskoglund@daves-MacBook-Pro-2.local>
    Co-authored-by: Nick Leach <nickleach22@gmail.com>

[33mcommit b57c2cbbd0fe9c99e7519535e10dbfae49b501dc[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Fri Jun 5 21:44:29 2020 -0700

    Scott kroger search (#29)
    
    * starting migration
    
    * working paginate
    
    * add more fields to yaml
    
    * new xpaths
    
    * test inputs
    
    * input fix
    
    * add 500 inputs for search
    
    * add sponsored rank

[33mcommit 0397f117637a430e97514b32dd6f265152443823[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Fri Jun 5 21:42:54 2020 -0700

    Mangalapally walgreens search (#28)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    * Add correct id for sold out products
    
    * Modify to add rankings
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit a23b4c40997eef47d95075a56d67c9719da63dff[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Fri Jun 5 14:56:02 2020 -0700

    Mangalapally foodservice (#24)
    
    * Compelete core extraction
    
    * Clean up xpaths and add more fields for Core Extended
    
    * Clean up code
    
    * Remove comments and lines
    
    * Remove comment
    
    * Update to work with the last changes
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit 909a230a670888b27b43b0314f6b35a777bc1d0a[m
Author: Neha Shende <neha.shende@synerzip.com>
Date:   Sat Jun 6 03:18:01 2020 +0530

    Initial commit for Samsclub search extractor (#18)

[33mcommit f79045af88eefed8b9e63b7cf5192ab036e046e5[m
Author: sashidatla <57485741+sashidatla@users.noreply.github.com>
Date:   Fri Jun 5 17:46:01 2020 -0400

    Walmart og details (#13)
    
    * initial setup
    
    * updated price and listprice
    
    * Run Remote throws Error: Service worker registration failed
    
    * updated price and listprice
    
    * test
    
    * Reverted to API Call
    
    * Fixed missing price/online_price
    
    * fixed lazy load issues

[33mcommit 774915be10285cfeacc12a3b3e1551a711b7393c[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Fri Jun 5 13:54:38 2020 -0400

    Walmart product/search (#23)
    
    * Initial setup for walmart
    
    * git ignore updated
    
    * merges and deploy changes
    
    * updated xpaths for search
    
    * extractor deployed
    
    * added sponsored column
    
    * added a shared transform
    
    * transform action added
    
    * Updated for handling keywords and Keywords and other minor updates

[33mcommit 18edc211a71ce85cae788a0aaf46adbd66a7fc86[m
Author: sushma-mangalapally <65569027+sushma-mangalapally@users.noreply.github.com>
Date:   Thu Jun 4 23:27:23 2020 -0700

    Mangalapally walgreens search (#12)
    
    * Complete search extractor without deploying due to issue
    
    * Edit inputs
    
    * Add line for no results for input
    
    * Fix data attributes in extract js due to data error
    
    * Fix data attributes in extract js due to data error
    
    * Add thumbnails link to extractor
    
    Co-authored-by: SushmaM <sushmam@sushmas-mbp.lan>

[33mcommit 187651f93d447fea640e3d20d8c3737a9c8165a9[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Thu Jun 4 23:22:43 2020 -0700

    Scott kroger (#8)
    
    * migrate changes and fix pricing issue on kroger product/details
    
    * fix undefined if not found bug
    
    * edit and deploy to workbench
    
    * add inputs
    
    * fix timing delay
    
    * xpath and input updates
    
    * fix input
    
    * fix some input names

[33mcommit 0142f6891406e95c73da9595b42863d3570e9f4e[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Thu Jun 4 18:16:30 2020 -0700

    Add replace for id in createUrl

[33mcommit 5e3054a0fec18dcf7ba3ed2429c559084b951467[m
Author: Adam Scott <alawrencescott@gmail.com>
Date:   Thu Jun 4 14:47:12 2020 -0700

    Scott kroger search (#9)
    
    * starting migration
    
    * working paginate
    
    * add more fields to yaml
    
    * new xpaths
    
    * test inputs
    
    * input fix
    
    * add 500 inputs for search

[33mcommit 27f00d42d46f3df151e1d6e8fe13644fda95306d[m
Author: bindudatla9 <47576613+bindudatla9@users.noreply.github.com>
Date:   Wed Jun 3 19:27:54 2020 -0400

    Walmart.com product/details (#5)
    
    * Initial setup for walmart
    
    * git ignore updated
    
    * merges and deploy changes
    
    * updated to take RPC or SKU as inputs
    
    * updating gitignore

[33mcommit 58e1c7dcb665518f858e9ca7dc54673ccb125985[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Wed Jun 3 12:29:32 2020 -0700

    update typings

[33mcommit 2c7abeb2cb9d4f701836b1ba0cd4413f51b77a45[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Tue Jun 2 17:30:17 2020 -0700

    Uppercase uk

[33mcommit 736feea1a3d0395f39b5d0885217148db14fcd1f[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Tue Jun 2 12:28:07 2020 -0700

    Missing parameters

[33mcommit 2fb66078c122db47f5f5967f63899ee7a92d69a6[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Mon Jun 1 15:40:07 2020 -0700

    config.yaml for ascential

[33mcommit 7dd401621a9e54c4616690e570c1c7b8b80edc13[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Mon Jun 1 09:43:43 2020 -0700

    Added npm i to readme

[33mcommit 953b2bc202a3d1b8896e9872dc76d764529c20c1[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Mon Jun 1 09:33:05 2020 -0700

    Readme update

[33mcommit 5a5974299f57e823d3ad09c756d0167720073d86[m
Author: Nick Leach <nickleach22@gmail.com>
Date:   Mon Jun 1 09:13:54 2020 -0700

    Product Details robot (#4)
    
    * Initial details scaffolding
    
    * Initial readme
    
    * Readme updates
    
    * createUrl function
    
    * Fixed template, made exampke
    
    * Fix symlink
    
    * Update readme

[33mcommit 1b8d390443ac7c58504aeb887c37673808f44334[m
Author: Matthew Painter <mjgp2@users.noreply.github.com>
Date:   Tue May 26 18:33:57 2020 +0100

    Update README.md

[33mcommit 771ae770cfbbdb7a035542afa1747a6b8a62d0fb[m
Merge: 471ef3b385 ede21b5253
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 18:32:23 2020 +0100

    Merge branch 'master' of github.com:import-io/library

[33mcommit 471ef3b385cdb3556fc7bed0675bfcd8b280a511[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 18:31:48 2020 +0100

    Move next link selector check

[33mcommit ede21b5253dab9e72986c89a275cb6a18756ca74[m
Author: Matthew Painter <mjgp2@users.noreply.github.com>
Date:   Tue May 26 18:29:04 2020 +0100

    Update README.md

[33mcommit b35751f0ad53447cf156b0d092903427909f371c[m
Author: Matthew Painter <mjgp2@users.noreply.github.com>
Date:   Tue May 26 18:28:42 2020 +0100

    Update README.md

[33mcommit e51b842361d78a23a2cc2a21d2f10d0debb96e5c[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 18:27:37 2020 +0100

    Fix wrong property

[33mcommit 40cd3416763fc869694dd98429cb9b1175350944[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 18:23:16 2020 +0100

    Update doc

[33mcommit 45fa53a3fe433437e6a6c7a4a816cad46a78b0c6[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 18:08:00 2020 +0100

    Couple of minor updates

[33mcommit 7026c8369874d98576594e14d8da333cd627e1af[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 00:40:07 2020 +0100

    Walgreens playback

[33mcommit c2fb9428913680c2b6732f7be573c6089ddff9c2[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue May 26 00:26:32 2020 +0100

    More tests and examples (without full mappings)

[33mcommit 52408880a2fe47a3d731647db7ceb1c356f373f5[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 23:16:28 2020 +0100

    Add missing dependencies

[33mcommit ecb84e625bd5ff5dc2bb6f4ce5aad39acb94fd1b[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 23:03:24 2020 +0100

    Add URL pattern option

[33mcommit bd5ca6a8308edb10345644fbab621a1d0634c881[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 22:18:49 2020 +0100

    Initial target implementation

[33mcommit 80a8406174710f04f8fcac7f4ba42198e8830894[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 21:07:55 2020 +0100

    Add the goto impls

[33mcommit e2643bd868568708d16df2735113f77422c38fde[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 21:07:29 2020 +0100

    Create a search default impl

[33mcommit 150e3c99d3d9d412ad0dcc1ffaaa81d0f724785e[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 18:28:23 2020 +0100

    Fix path resolution

[33mcommit 60b627ea690b7d4c441703c21cfbd57fc368621d[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon May 25 18:12:39 2020 +0100

    Add mocha

[33mcommit 0f600b0879e9b644a5531cf6929cad22217a7bbf[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sun May 24 01:15:56 2020 +0100

    Fix another path

[33mcommit a22d80a3737fa11bd1306e6fbb592b35dbd9b974[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sun May 24 01:14:21 2020 +0100

    Fix bad path

[33mcommit 4de803b43bc1fed33a5a687b3a165dbc230b511d[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sun May 24 01:10:12 2020 +0100

    Fix paths

[33mcommit ee3c6a83b8ca158be7fe985c0c6b6c20516a2de1[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sun May 24 00:30:27 2020 +0100

    Add missing files

[33mcommit a87977c4d7026ef5870b63eda69246ec06ec754f[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sun May 24 00:00:24 2020 +0100

    Refactor paths

[33mcommit 8f4b0b88b27c3922f294155e368c32d8d6388293[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sat May 23 22:59:51 2020 +0100

    Add example transform

[33mcommit 929058b6ce4354e14ce3695e4f0a931269573807[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sat May 23 02:32:02 2020 +0100

    Update typing

[33mcommit c3407ae47e6ae81e909cf9846248c9bc69bfd0fc[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Sat May 23 02:03:03 2020 +0100

    Add typing

[33mcommit aec55202c9f613ab9e7ea723bc34078c7fb8f33f[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 23:54:03 2020 +0100

    Add spinner selector

[33mcommit 160c42731fe9570b1efc132e0c36f8d132c3a20b[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 23:29:51 2020 +0100

    UK => GB

[33mcommit 39fb673afdcd06fa7fe88df75cf2ddc02cd61caa[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 23:05:27 2020 +0100

    Need JS on at the moment

[33mcommit 7727f0d83c3c8ec00d01cf6979f9634b2ee1c2e8[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 00:51:29 2020 +0100

    Try to fix md

[33mcommit 678d4201a9a3b42b5a54b3b4f74192782dfc8d99[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 00:50:55 2020 +0100

    Update docs

[33mcommit cd3b0bf8d1d7aa7d021b8dbc4b20523be23f3456[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Thu May 21 00:29:38 2020 +0100

    More refactoring

[33mcommit 06852ce34576fce433611942bea2ceb5a69fe62b[m
Author: Matthew Painter <mjgp2@users.noreply.github.com>
Date:   Wed May 20 20:33:12 2020 +0100

    Search implementation (#1)
    
    * Search implementation
    
    * Add robot
    
    * Change path
    
    * Add example (no pagination)
    
    * Fix record selector
    
    * Pagination v1
    
    * Refactor
    
    * More refactoring
    
    * Add linting
    
    * Add domain

[33mcommit 315ac96850c23ebacbe8682b43cbfaacd051484f[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Mon Apr 27 15:51:34 2020 +0100

    Add tests

[33mcommit 8eb3f7f45a7f1a503b43d530f4890612bac38535[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue Apr 14 00:47:18 2020 +0100

    Add amazon.co.uk, need to think about reuse across different domains (amamzon.co.uk/amazon.com)

[33mcommit 991079fd92bbb9250b862a0d30257212957f74b4[m
Author: mjgp2 <matthew.painter@import.io>
Date:   Tue Apr 14 00:24:49 2020 +0100

    Initial commit
