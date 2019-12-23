const config = require('./config');
const path = require('path');
const pinyin = require('pinyin');

const getPinYin = str =>{
  let arr = pinyin(str , {style: pinyin.STYLE_NORMAL});
  return arr.map(item=>item[0]).join('-');
};

// 遍历目录
// 2019/5/27
// const mdPath = path.parse("../md");
const BASICEPATH = path.join(__dirname,'../course');
const OUTPUTPATH = path.join(__dirname,'../dist');
const fs = require('fs');
const util = require('./util/fileInfo');
const fsutil = require('./util/fsutil');
const markdown = require('markdown-js');

const dir = fs.readdirSync(BASICEPATH);
const SPLITER = '_';
// 读出course目录下的全部文件夹
const course_list = dir.filter(item=>!item.endsWith('.json')).map(item => {
  let [cou_id, name] = item.split(SPLITER);
  let slug_name = getPinYin(name);
  return {
    cou_id,name,full_name:item,slug_name,article_list:[],target:'',
    index_path:`${cou_id}${slug_name}/index.html`
  };
});


course_list.forEach(course => {
  // 对每一门课程进行循环
  let {full_name,slug_name,name:course_name} = course;
  let cou_info_path = path.join(BASICEPATH,full_name,'info.json');
  if( fs.existsSync(cou_info_path) ) {

    let info = fs.readFileSync(cou_info_path,'utf8');
    if(info){
      Object.assign(course, JSON.parse(info));
    }else {
      console.error(`没有找到${full_name}的课程说明，重新创建`);
      Object.assign(course, config.default_info);
      fs.writeFileSync(cou_info_path,JSON.stringify(config.default_info ));
    }
  } else {
    Object.assign(course, config.default_info);
    fs.writeFileSync(cou_info_path,JSON.stringify(config.default_info ));
    
  }
  let files = fs.readdirSync(path.join(BASICEPATH, full_name));
  // 读出对应目录下的文件
  files.forEach(file_path => {
    let currentPath = path.join(BASICEPATH, full_name, file_path);


    if (fs.lstatSync(currentPath).isDirectory()) {
      // 把资源文件夹拷出去
      fsutil.copyDir(currentPath, path.join(OUTPUTPATH, `${course.cou_id}${slug_name}`, file_path));
    } else if (file_path.endsWith('.md')) {

      let arr = file_path.replace('.md', '').split('_');
      let fileObj = {};
      // 读出当前md的内容 
      let mdstr = fs.readFileSync(currentPath).toString();
      // 生成摘要
      fileObj.substr = mdstr.substr(0, 100).replace(/#/g, ' ');

      // 把md转成html
      fileObj.content = markdown.makeHtml(mdstr);

      fileObj.date_time = arr[arr.length-1].replace(/(\d{4})(\d{2})(\d{2})/, (r, r1, r2, r3) =>
        [r1, r2, r3].join('-')
      );
      fileObj.id = arr[0];                    // 编号
      fileObj.name = arr[1];                  // 中文名
      fileObj.slug_name = getPinYin(arr[1]);  // 文件对应的拼音名称

      fileObj.link_name = `${course.cou_id}${slug_name}/${fileObj.id}${fileObj.slug_name}.html`;
      fileObj.course_name = course_name;

      course.article_list.push(fileObj);
    }
  });
  util.buildCourse({config,course});

  course.article_list.forEach(fileObj => {
    util.buildPost({config,fileObj,article_list:course.article_list});
  });

});

fs.writeFileSync(path.join(__dirname,'../course','index_log.json'),JSON.stringify(course_list));
// util.buildAbout();
// console.info('更新关于页.....')
// // util.buildArchive(postList);

util.buildIndex({config,course_list});

