/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
 testPathIgnorePatterns: ['/node_modules/', '/ts-compiled/'],
 preset: 'ts-jest',
 testEnvironment: 'jsdom',
};
