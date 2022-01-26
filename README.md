# getfarmcredit

> getfarmcredit.com app written in VueJS

## Required

[Get a Google API Key](https://developers.google.com/maps/documentation/javascript/get-api-key) then follow instructions inside `/config/default.googleMapsApiKey.js`

## Filtered Build Options

~~Instructions inside `/config/app.filterConfig.js`.~~
Edit `/static/agf_config.js` and load in html:

```html
  <script src="YOUR_PATH/js/agf_config.js"></script>
```

## Integrating in other systems

You'll need to reference the following:

``` html
<!-- place in <HEAD> -->
<!-- You can reference your own typekit that whitelists your domain -->
<link rel="stylesheet" href="https://use.typekit.net/aqh0bgp.css" />
<link href="YOUR_PATH/css/app.css" rel="stylesheet">
<script src="YOUR_PATH/js/agf_config.js"></script>
```

``` html
  <!-- Have this somewhere in <body> -->
  <div id="app"></div>

  <!-- These can be near </body> -->
  <script type="text/javascript" src="/YOUR_PATH/js/manifest.js"></script>
  <script type="text/javascript" src="/YOUR_PATH/js/vendor.js"></script>
  <script type="text/javascript" src="/YOUR_PATH/js/app.js"></script>
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## Updating GetFarmCredit.com (v0.3.5+)
1. before starting, delete contents of the following directories
    * `/web/modules/custom/getfarmcreditmap/js`
    * `/web/modules/custom/getfarmcreditmap/css`
2. run `npm run build`
3. Copy `dist/getfarmcreditmap.js` into `/web/modules/custom/getfarmcreditmap/js`
4. Copy `dist/getfarmcreditmap.libraries.yml` into `/web/modules/custom/getfarmcreditmap/`
5. Copy contents of `dist/static/js` into `web/modules/custom/getfarmcreditmap/js`
6. Copy contents of `dist/static/css` into `web/modules/custom/getfarmcreditmap/css`

## Changelog

### v0.3.13
- `fix` - fix app loading strategy. there was a change from `window.onLoad` to `addEventListener('DOMContentLoad', function(){})` that cause the app to load sporadically, as it only waited for the DOM to be ready, not waiting on external assets. This update reverts back to original `window.onLoad` which does wait for everything to load, including external assets.

### v0.3.12
- `new` - add check for "Fax 2".

### v0.3.11
- `refactor`: a11y scan revisions

### v0.3.10
- `polish`: overlapping 'x' inside input in ie11

### v0.3.9
- `fix` - fix IE bug (updated dependency)
- `chore` - update dependencies: `vue`, `vue-instant`, `vue-select`.

### v0.3.8
- `fix` - partial county check for zip code search
- `feat` - commit # `025d73cdbc4afa1f0df6cd198b142e13d40b863a`: text county override.

### v0.3.7
- `revision` Info Window shows branch detail url if it exists

### v0.3.6
- `feature` - Info Window now has website link
- `bugfix` - Info Window triple click issue
- `chore` - Removed `vue2-google-maps-fixed`. Fixed issue pulled into `vue2-google-maps`.

### v0.3.5
- dev tooling upgrade. `npm run build` now outputs `getfarmcreditmap.js` and `getfarmcreditmap.libraries.yml` files to streamline updates to GetFarmCredit.com.

### v0.3.4
- allowed HTML in custom intro text (window.AGF_CONFIG.customIntro.text)

### v0.3.3
- check for `AGF_CONFIG_LOCAL` before `AGF_CONFIG`. Plumming for plans to serve configuration from theme level in future, to mitigate against possible file conflicts from upstream.

### v0.3.2
- if the map config is set to filter by association, then websites won't display on locations (only detail page URLs)

### v0.3.1
- better error handling when fetching branch data
- better handling of `null` values in branch data
- branch detail links are pulled from `window.location_lookup` if it exists on the page
- county matching is exact (`===` instead of `indexOf`)

### v0.3.0
- added Zip Code field and zip code search
- county field becomes active when zip code search returns multiple branches so that search can be refined
- branch data now comes from https://www.getfarmcredit.com/locations_feed
- branch data url requires valid `key` parameter to display app (ex: https://www.getfarmcredit.com/locations_feed?key=1234)
- switched back to `vue2-google-maps-fixed` because fix isn't working on master

### v0.2.2
- added drupal_detail_url content to AgSouth branches in appData.json
- removed `vue2-google-maps-fixed` since fix was added to main

### v0.2.1
- `customization` - Added logic for drupal url
- temporaily using fork `vue2-google-maps-fixed` for ie11 compatibility [See GitHub Issue](https://github.com/xkjyeah/vue-google-maps/issues/401). We'll switch back to main next release.