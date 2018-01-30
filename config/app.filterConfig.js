////////////////////////////////////////////////////////////////////////////////
//
// NOTE: THIS FILE IS NO LONGER USED. PLEASE SEE `/static/agf_config.js`.
//
////////////////////////////////////////////////////////////////////////////////

/*
  associationFilter.js
  --------------------
  ### INTRODUCTION #############################################################
  You can configure a custom build of this app that filters by branch 
  Association, State, or a combination of both.


  ### INSTRUCTIONS FOR ASSOCIATION FILTER ######################################
  1.) look for your association in the `associations` array. note the # (index)
  2.) under `export default`, change the property value of `associationName` to
      use the index of your chosen association. for example, if you wanted to
      filter by `Colonial Farm Credit`, the value should look like this:
      
      `associationName: association[9]`

  3.) change `byAssociation` to `true`.
  4.) run `npm run build`. the `dist` folder should contain the app, prefiltered
      by association. 


  ### INSTRUCTIONS FOR STATE FILTER ############################################
  1.) set `byState` to `true`.
  2.) replace `sC` with the 2-character state abbreviation.
  3.) run `npm run build`. the `dist` folder should contain the app, prefiltered
      by association.

  ### REMINDER #################################################################
  Set `byAssociation` and `byState` to `false` to get the full list of branches.
*/

const associations = [
  "AgCarolina Farm Credit, ACA",              // 0
  "AgChoice Farm Credit, ACA",                // 1
  "AgCredit, ACA",                            // 2
  "AgGeorgia Farm Credit, ACA",               // 3
  "AgSouth Farm Credit, ACA",                 // 4
  "ArborOne Farm Credit, ACA",                // 5
  "Cape Fear Farm Credit, ACA",               // 6
  "Carolina Farm Credit, ACA",                // 7
  "Central Kentucky ACA",                     // 8
  "Colonial Farm Credit",                     // 9
  "Farm Credit of Central Florida, ACA",      // 10
  "Farm Credit of Florida, ACA",              // 11
  "Farm Credit of Northwest Florida, ACA",    // 12
  "Farm Credit of the Virginias, ACA",        // 13
  "First South ACA",                          // 14
  "MidAtlantic Farm Credit, ACA",             // 15
  "River Valley AgCredit",                    // 16
  "Southwest Georgia Farm Credit, ACA",       // 17
  "Yankee Farm Credit ACA"                    // 18
]

export default {
  byAssociation: false,               // to filter by association
  associationName: associations[0],   // must be index from `association` array
  byState: false,                     // to filter by state
  stateName: 'sC'                     // must be string. can be upper/lower/mixed case.
}
