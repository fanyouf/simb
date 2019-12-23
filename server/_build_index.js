const config = require('./config');

const util = require('./util/fileInfo');

let course_list = require('../course/index_log.json');
util.buildIndex({config,course_list});