const fs = require('fs');
const tpl = require('./tpl');
module.exports.buildPost = post => {
  let blogTemplate = fs.readFileSync('../template/article.html').toString();

  let html = tpl(blogTemplate, post);

  // blogTemplate = blogTemplate.replace(/<%title%>/g, post.title);
  // blogTemplate = blogTemplate.replace("<%dateTime%>", post.dateTime);
  // blogTemplate = blogTemplate.replace("<%tags%>", post.tags);
  // blogTemplate = blogTemplate.replace("<%content%>", post.content);
  // blogTemplate = blogTemplate.replace("<%category%>", post.category);
  let path = post.linkName.split('/');
  path = path[0];
  if (!fs.existsSync('../dist/' + path)) {
    fs.mkdirSync('../dist/' + path);
  }
  fs.writeFileSync('../dist/' + post.linkName, html);
  console.info(post.linkName + '....done');
};

module.exports.buildIndex = (postList, cateList) => {
  let blogTemplate = fs.readFileSync('../template/index.html').toString();

  let html = tpl(blogTemplate, { postList, cateList });
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
  let blogTemplate = fs.readFileSync('../template/category.html').toString();

  let html = tpl(blogTemplate, cateList);
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
  let blogTemplate = fs.readFileSync('../template/about.html').toString();
  let me = {
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
        company: { name: '北京每学教育科技有限公司', vatorImage: '', url: '' },
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
  };
  let html = tpl(blogTemplate, me);

  fs.writeFileSync('../dist/about.html', html);
};

module.exports.buildArchive = postList => {
  let postArr = postList
    .map(item => {
      return {
        dateTime: item.dateTime,
        year: item.dateTime.substr(0, 4),
        month: item.dateTime.substr(5, 2),
        day: item.dateTime.substr(8, 2),
        title: item.title,
        link: item.linkName
      };
    })
    .sort((a, b) => {
      return (
        a.year * 1000 + a.month * 30 + a.day >
        b.year * 1000 + b.month * 30 + b.day
      );
    });

  let blogTemplate = fs.readFileSync('../template/archive.html').toString();
  let post = [];
  debugger;
  postArr.forEach(ele => {
    let rs = post.find(item => item.year == ele.year);
    if (rs) {
      let m = rs.monthList.find(item => item.month == ele.month);
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

  let html = tpl(blogTemplate, post);

  fs.writeFileSync('../dist/archive.html', html);
};
