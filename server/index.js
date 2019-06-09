// 遍历目录
// 2019/5/27
// const mdPath = path.parse("../md");
const BASICEPATH = '../md',
  OUTPUTPATH = '../dist';
const fs = require('fs');
const util = require('./util/fileInfo');
const fsutil = require('./util/fsutil');
const markdown = require('markdown-js');
const cateList = {},
  dir = fs.readdirSync(BASICEPATH),
  path = require('path'),
  postList = [];

dir.forEach(category => {
  cateList[category] = [];

  let files = fs.readdirSync(path.join(BASICEPATH, category));

  files.forEach(file => {
    let currentPath = path.join(BASICEPATH, category, file),
      status = fs.lstatSync(currentPath);

    if (status.isDirectory()) {
      fsutil.copyDir(currentPath, path.join(OUTPUTPATH, category, file));
    } else if (file.includes('.md')) {
      let arr = file.replace('.md', '').split('_');
      let f = {};
      let mdstr = fs.readFileSync(currentPath).toString();

      f.content = markdown.makeHtml(mdstr);
      f.substr = mdstr.substr(0, 100).replace(/#/g, '');

      f.dateTime = arr[0].replace(/(\d{4})(\d{2})(\d{2})/, (r, r1, r2, r3) =>
        [r1, r2, r3].join('-')
      );
      f.title = arr[1];
      f.fileName = arr[2]; // 文件对应的英文名称
      f.linkName = `${category}/${f.fileName}.html`;
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
