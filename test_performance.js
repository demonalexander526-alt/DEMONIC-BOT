const { applyPerformanceMode, getPerformanceSettings, stopAllMonitors } = require('./index');

console.log('Initial settings:', getPerformanceSettings());

console.log('\nApplying low-end...');
applyPerformanceMode('low');
console.log('Low settings:', getPerformanceSettings());

console.log('\nApplying high-end...');
applyPerformanceMode('high');
console.log('High settings:', getPerformanceSettings());

console.log('\nCleaning up monitors...');
stopAllMonitors();

console.log('Done.');
