/**
 * 此脚本用来重新设置
 */
const config = require('./config');

const fs = require('fs');
const path = require('path');
const BASICEPATH = path.join(__dirname,'../course');
let course_list = require('../course/index_log.json');
course_list.forEach(course => {
    // 对每一门课程进行循环
    let {full_name,} = course;
    let cou_info_path = path.join(BASICEPATH,full_name,'info.json');
    fs.writeFileSync(cou_info_path,JSON.stringify(config.default_info ));
});