// 遍历目录
const fs = require("fs");
const path = require("path");
const util = require("./util/fileInfo");
var markdown = require("markdown-js");
// const mdPath = path.parse("../md");
const dir = fs.readdirSync("../md");
const cateList = {};
const postList = [];
let regDateTime = /\d{4}-\d{2}-\d{2}/;
dir.forEach(path => {
  cateList[path] = [];

  let files = fs.readdirSync("../md/" + path);
  files.forEach(file => {
    let f = {};
    let mdstr = fs.readFileSync("../md/" + path + "/" + file).toString();
    f.content = markdown.makeHtml(mdstr);
    f.substr = mdstr.substr(0, 100).replace(/#/g, "");
    file = file.replace(".md", "");

    f.dateTime = file.substr(0, 10);
    file = file.replace(f.dateTime, "");

    let t = file.split("_");
    f.fileName = t[0];
    f.title = t[0];
    f.linkName = `${path}/${f.fileName}.html`;
    if (t[1]) {
      f.tags = t[1].split("-");
    }
    f.category = path;
    util.buildPost(f);

    cateList[path].push(f);
    postList.push({
      title: f.title,
      linkName: f.linkName,
      fileName: f.fileName,
      dateTime: f.dateTime,
      substr: f.substr,
      tags: f.tags,
      category: path
    });
  });
});
util.buildAbout();
util.buildArchive(postList);
util.buildIndex(postList, Object.keys(cateList));
let cateList1 = Object.keys(cateList).map(key => {
  return {
    cateName: key,
    list: cateList[key]
  };
});
util.buildCate(cateList1);
