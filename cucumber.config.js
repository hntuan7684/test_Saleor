module.exports = {
  default: {
    requireModule: ['@babel/register'],
    require: ['features/step-definitions/**/*.js'],
    format: [
      'progress',
      'html:results/cucumber-report.html',
      'json:results/cucumber-report.json',
      'summary'
    ],
    formatOptions: {
      snippetInterface: 'async-await',
      colors: true
    },
    parallel: 1,
    publishQuiet: false,
    timeout: 30000,
    tags: 'not @skip'
  }
}; 