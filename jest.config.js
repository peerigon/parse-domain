"use strict";

module.exports = {
    collectCoverage: true,
    coverageThreshold: {
        "./src/**/*.js": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};
