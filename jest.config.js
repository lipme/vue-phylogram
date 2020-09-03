module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/components/*.{js,vue}',
    '!src/components/index.js'
  ],
  coverageReporters: ['html', 'text-summary']
}
