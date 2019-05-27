// 遍历目录
// 2019/5/27
const fs = require('fs');
const util = require('./util/fileInfo');
const fsutil = require('./util/fsutil');
var markdown = require('markdown-js');
// const mdPath = path.parse("../md");
const dir = fs.readdirSync('../md');
const cateList = {};
const postList = [];
dir.forEach(category => {
  cateList[category] = [];

  let files = fs.readdirSync('../md/' + category);
  files.forEach(file => {
    let currentPath = '../md/' + category + '/' + file;
    let status = fs.lstatSync(currentPath);
    if (status.isDirectory()) {
      fsutil.copyDir(currentPath, '../dist/' + category + '/' + file);
    } else {
      let f = {};
      // 分隔摘要
      let mdstr = fs.readFileSync(currentPath).toString();
      f.content = markdown.makeHtml(mdstr);
      f.substr = mdstr.substr(0, 100).replace(/#/g, '');

      file = file.replace('.md', '');

      f.dateTime = file.substr(0, 10);
      file = file.replace(f.dateTime, '');

      let t = file.split('_');
      f.fileName = t[0];
      f.title = t[0];
      f.linkName = `${category}/${f.fileName}.html`;
      if (t[1]) {
        f.tags = t[1].split('-');
      }
      f.category = category;

      util.buildPost(f);
      cateList[category].push(f);
      postList.push({
        title: f.title,
        linkName: f.linkName,
        fileName: f.fileName,
        dateTime: f.dateTime,
        substr: f.substr,
        tags: f.tags,
        category: category
      });
    }
  });
});
util.buildAbout();
console.info('更新关于页.....');
util.buildArchive(postList);
util.buildIndex(postList, Object.keys(cateList));
// 更新主页
let cateList1 = Object.keys(cateList).map(key => {
  return {
    cateName: key,
    list: cateList[key]
  };
});
util.buildCate(cateList1);
