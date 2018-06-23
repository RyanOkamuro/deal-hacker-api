'use strict';
exports.DATABASE_URL = 
    process.env.DATABASE_URL || 
    global.DATABASE_URL || 
    'mongodb://localhost/deal-hacker-db';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-deal-hacker-db';
exports.PORT = process.env.PORT || 8080;