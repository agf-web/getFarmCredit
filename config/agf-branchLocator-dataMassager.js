// AG FIRST BRANCH LOCATOR: DATA MASSAGER

/*

  WARNING!!! USE WITH CAUTION AND ONLY IF YOU KNOW WHAT YOU'RE DOING!!!

*/

// dependencies
var jsonfile = require('jsonfile');
var axios    = require('axios');
var sortObj = require('sort-object');

////////////////////////////////////////////////////////////////////////////////

mergeJSON()

////////////////////////////////////////////////////////////////////////////////

function mergeJSON() {
  var fullData = jsonfile.readFileSync('./data_after/dataMassaged.json', function(err, obj) {console.dir(obj)});
  var partialData = jsonfile.readFileSync('./data_after/partialCounties-full.json', function(err, obj) {console.dir(obj)});

  var partialDataSorted = partialData.map(data => {
    var sorted = sortObj(data, {
      sortBy: function (obj) {
        var arr = [];
        Object.keys(obj).filter(function(key) {
          if (
            key !== 'formatted_address' &&
            key !== 'location' &&
            key !== 'website'
          ) arr.push(key);
        });
        arr.sort()
        arr.push('formatted_address', 'location', 'website')
        return arr
      }
    })
    return sorted
  })

  var finalData = Object.assign(fullData, partialDataSorted)
  jsonfile.writeFileSync('./data_after/finalData.json', finalData, {spaces: 2});
}

async function partialCountyDataMassage () {
  // load original data
  var originalData = jsonfile.readFileSync('./data_before/partialCounties.json', function(err, obj) {console.dir(obj)});

  // create new data object
  var newData = originalData.map((branch,index) => {
    let branchAddress = branch.Address.split(' ').join('+') + ',+' + branch.State.split(' ').join('+') + '+' + branch.Zip;
    let api_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + branchAddress + '&key=AIzaSyBDuu0tFj8Wu-BBZ0RBDEZOIyzHIGxtXmI';

    axios.get(api_url)
      .then(function(res) {
        if (res.data.results[0]) {
          console.log(res.data.results[0]["formatted_address"]);
          branch.Location = res.data.results[0].geometry.location;
          branch.formatted_address = res.data.results[0]["formatted_address"];
        } else {
          throw Error(res)
        }

        var counties = branch.County.split(',').map(county => county.trim());
        var countiesWithState = counties.map((county) => {
          if (county !== '') {
            return county + ` County (${branch.State})`;
          }
        });

        branch.County = countiesWithState.join(',');
        branch.CountyPartial = ''

        // console.log(branch)
        jsonfile.writeFileSync('./data_after/partialCounties-full.json', branch, {flag: 'a', spaces: 2});
        return branch;
      })
      .catch(function(err) {
        console.log(err);
      });
  });

  // jsonfile.writeFileSync('./data_after/partialCounties-full.json', await newData);
}








// const address = '2308 S. MacArthur Dr, Alexandria, 71315'
// getLocationData(address)


function getLocationData (stringAddress) {
  let branchAddress = stringAddress.split(' ').join('+');
  let api_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + branchAddress + '&key=AIzaSyBDuu0tFj8Wu-BBZ0RBDEZOIyzHIGxtXmI';

  axios.get(api_url)
    .then(function(res) {
      // console.log(res.data.results);

      if (res.data.results[0]) {
        console.log({
          location: res.data.results[0].geometry.location,
          formatted_address: res.data.results[0]["formatted_address"]
        })
        // jsonfile.writeFileSync('./tmp/tmp-branch_locations.json',
        //   {
        //     location: res.data.results[0].geometry.location,
        //     formatted_address: res.data.results[0]["formatted_address"]
        //   },
        //   {flag: 'a', spaces: 2});
      } else {
        console.log('ERROR! No Results...')
        // jsonfile.writeFileSync('./tmp/errors.json', ()=> {
        //   res.wtf = branchAddress;
        //   return res;
        // }, {flag: 'a'});
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function newData() {
  // get existing data
  var branches = jsonfile.readFileSync('./data_before/branches_full_with_websites.json', function(err, obj) {console.dir(obj)});

  // create new data object
  var newData = branches.map((branch,index) => {
    // var counties = branch.County.split(',').map(county => county.trim());
    // var countiesWithState = counties.map((county) => {
    //   if (county !== '') {
    //     return county + ` (${branch.State})`;
    //   }
    // });
    // branch.County = countiesWithState.join(',');
    branch.CountyPartial = ''

    return branch;
  });

  // write new data object to JSON
  jsonfile.writeFileSync('./data_after/dataMassaged.json', newData);

  // confirm
  console.dir(newData);
}