const fs = require('fs');
const tpl = require('./tpl');
const path = require('path');
const markdown = require('markdown-js');

module.exports.buildPostByFile = file => {
  let dirName = path.dirname(file);
  let idx = dirName.lastIndexOf('md');

  dirName = dirName.slice(idx + 2);

  let arr = path
    .basename(file)
    .replace('.md', '')
    .split('_');
  let post = {};
  let mdstr = fs.readFileSync(file).toString();

  post.content = markdown.makeHtml(mdstr);
  post.substr = mdstr.substr(0, 100).replace(/#/g, '');

  post.dateTime = arr[0].replace(/(\d{4})(\d{2})(\d{2})/, (r, r1, r2, r3) =>
    [r1, r2, r3].join('-')
  );
  post.title = arr[1]; // 中文名
  post.fileName = arr[2]; // 文件对应的英文名称
  post.linkName = `${dirName}/${post.fileName}.html`;
  post.category = dirName;

  console.info(process.execPath, __dirname);
  let p = path.join(__dirname, '../template/article.html');
  let blogTemplate = fs.readFileSync(p).toString(),
    html = tpl(blogTemplate, post),
    paths = post.linkName.split('/');

  paths = paths[0];
  if (!fs.existsSync(path.join(__dirname, '../../dist/', paths))) {
    fs.mkdirSync(path.join(__dirname, '../../dist/' + paths));
  }
  fs.writeFileSync(path.join(__dirname, '../../dist/' + post.linkName), html);
  console.info(post.linkName + '....done');
};

module.exports.buildPost = post => {
  console.info(process.execPath, __dirname);
  let p = path.join(__dirname, '../template/article.html');
  let blogTemplate = fs.readFileSync(p).toString(),
    html = tpl(blogTemplate, post),
    paths = post.linkName.split('/');

  paths = paths[0];
  if (!fs.existsSync(path.join(__dirname, '../../dist/', paths))) {
    fs.mkdirSync(path.join(__dirname, '../../dist/' + paths));
  }
  let finallyFileName = path.join(__dirname, '../../dist/' + post.linkName);

  console.info('finallyFileName', finallyFileName);

  fs.writeFileSync(finallyFileName, html);
  console.info(post.linkName + '....done');
};

module.exports.buildIndex = (postList, cateList) => {
  let blogTemplate = fs.readFileSync('./template/index.html').toString(),
    html = tpl(blogTemplate, { postList, cateList });
  // let str = postList.map(post => {
  //   return `<li>
  //     <h3><a href="${post.linkName}">${post.title}</a></h3>
  //   </li>`;
  // });

  // blogTemplate = blogTemplate.replace("<%lastTopPost%>", str);

  // fs.writeFileSync("../dist/index.html", blogTemplate);
  fs.writeFileSync('../dist/index.html', html);
};

module.exports.buildCate = cateList => {
  let blogTemplate = fs.readFileSync('./template/category.html').toString(),
    html = tpl(blogTemplate, cateList);
  // let str = postList.map(post => {
  //   return `<li>
  //     <h3><a href="${post.linkName}">${post.title}</a></h3>
  //   </li>`;
  // });

  // blogTemplate = blogTemplate.replace("<%lastTopPost%>", str);

  // fs.writeFileSync("../dist/index.html", blogTemplate);
  fs.writeFileSync('../dist/category.html', html);
};

module.exports.buildAbout = () => {
  let blogTemplate = fs.readFileSync('./template/about.html').toString(),
    me = {
      basic: {
        name: '凡友福',
        nativePlace: '湖北潜江',
        age: '40',
        gender: '男',
        tel: '17346566471',
        email: 'gxbmy2015@qq.com',
        location: '北京顺义',
        degree: '硕士',
        hobbies: [],
        nation: '汉族'
      },
      jobObjective: {
        objName: '前端工程师',
        salary: '30K',
        loaction: '北京',
        availableTime: '1个月'
      },
      skills: ['理解html5,css3', '原生js能力'],
      honors: [{}],
      education: [
        {
          date: ['2010-09', '2011-09'],
          school: '武汉理工大学',
          major: '信息与计算科学',
          degree: '本科',
          url: 'http://www.whut.edu.cn/images/whutlogo.png'
        },
        {
          date: ['2010-09', '2011-09'],
          school: '武汉理工大学',
          major: '应用数学',
          degree: '研究生',
          url: 'http://www.whut.edu.cn/images/whutlogo.png'
        }
      ],
      workingExperence: [
        {
          title: '教师/专业负责人',
          company: { name: '江汉艺术职业学院', vatorImage: '', url: '' },
          date: ['2009-09', '2016-06'],
          description: ['专业课程教学工作', '专业建设']
        },
        {
          title: '前端讲师',
          company: {
            name: '北京每学教育科技有限公司',
            vatorImage: '',
            url: ''
          },
          date: ['2016-06', '2017-11'],
          description: ['sdfsdfs', 'asdfsdfsd']
        },
        {
          title: '前端工程师',
          company: { name: '京东', vatorImage: '', url: '' },
          date: ['2017-12', '2019-05-08'],
          description: ['开发项目', '规则制定']
        }
      ]
    },
    html = tpl(blogTemplate, me);

  fs.writeFileSync('../dist/about.html', html);
};

module.exports.buildArchive = postList => {
  let html = '',
    postArr = postList
      .map(item => {
        let dateTimeArr = item.dateTime.split('-');

        return {
          dateTime: item.dateTime,
          year: dateTimeArr[0],
          month: dateTimeArr[1],
          day: dateTimeArr[2],
          title: item.title,
          link: item.linkName
        };
      })
      .sort((a, b) => {
        return (
          a.year * 1000 + a.month * 30 + a.day >
          b.year * 1000 + b.month * 30 + b.day
        );
      }),
    blogTemplate = fs.readFileSync('./template/archive.html').toString(),
    post = [];

  postArr.forEach(ele => {
    let rs = post.find(item => item.year === ele.year);

    if (rs) {
      let m = rs.monthList.find(item => item.month === ele.month);

      if (m) {
        m.dayList.push({
          day: ele.day,
          title: ele.title,
          link: ele.link
        });
      } else {
        rs.monthList.push({
          month: ele.month,
          dayList: [
            {
              day: ele.day,
              title: ele.title,
              link: ele.link
            }
          ]
        });
      }
    } else {
      post.push({
        year: ele.year,
        monthList: [
          {
            month: ele.month,
            dayList: [
              {
                day: ele.day,
                title: ele.title,
                link: ele.link
              }
            ]
          }
        ]
      });
    }
  });

  html = tpl(blogTemplate, post);

  fs.writeFileSync('../dist/archive.html', html);
};
