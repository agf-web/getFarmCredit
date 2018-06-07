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

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Changelog


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