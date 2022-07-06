"use strict";

let backend_settings = require('./backend_settings.json');
const response_summary = require('./response_summary.json');
const response_pools = require('./response_pools.json');
let _merge = require('lodash/merge');
const deepmerge = require('deepmerge');

let tmp = {};
let minerips = backend_settings.minerips;

let response_summary_raw = JSON.stringify(response_summary,null,2).replace(/[\[\]]/g, '');
let response_summary_filtered = JSON.parse(response_summary_raw);

console.log('minerips:');
console.log(minerips);

console.log('response_summary_filtered dump:');
console.log(response_summary_filtered);

/* minerips.summary = {response_summary};
console.log('dump new minerips with new summary:');
console.log(minerips);


console.log('reformat strings');
let response_summary_raw = JSON.stringify(response_summary);

//delete minerips.summary;
minerips.summary = JSON.parse(response_summary_raw);

console.log('dump new minerips with new summary:');
console.log(minerips); */

/* tmp.summary = response_summary_filtered;
let tmp2 = {
    ...minerips[0], 
    ...tmp};
minerips.splice(0,1, {...tmp2});
//minerips.push({...tmp2});
//minerips[0].summary = response_summary_filtered; */
delete minerips[0].summary;
delete minerips[1].pools;
minerips[0].summary=response_summary;
minerips[1].pools = response_pools;
console.log('dump newly merged objects:');
console.log(JSON.stringify(minerips));


