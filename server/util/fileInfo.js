const fs = require("fs");
const tpl = require("./tpl");
module.exports.buildPost = post => {
  let blogTemplate = fs.readFileSync("../template/article.html").toString();

  let html = tpl(blogTemplate, post);

  // blogTemplate = blogTemplate.replace(/<%title%>/g, post.title);
  // blogTemplate = blogTemplate.replace("<%dateTime%>", post.dateTime);
  // blogTemplate = blogTemplate.replace("<%tags%>", post.tags);
  // blogTemplate = blogTemplate.replace("<%content%>", post.content);
  // blogTemplate = blogTemplate.replace("<%category%>", post.category);

  // fs.writeFileSync("../dist/" + post.linkName, blogTemplate);
  fs.writeFileSync("../dist/" + post.linkName, html);
  console.info("../dist/" + post.linkName + "....done");
};

module.exports.buildIndex = (postList, cateList) => {
  let blogTemplate = fs.readFileSync("../template/index.html").toString();

  let html = tpl(blogTemplate, { postList, cateList });
  // let str = postList.map(post => {
  //   return `<li>
  //     <h3><a href="${post.linkName}">${post.title}</a></h3>
  //   </li>`;
  // });

  // blogTemplate = blogTemplate.replace("<%lastTopPost%>", str);

  // fs.writeFileSync("../dist/index.html", blogTemplate);
  fs.writeFileSync("../dist/index.html", html);
};

module.exports.buildCate = cateList => {
  let blogTemplate = fs.readFileSync("../template/category.html").toString();

  let html = tpl(blogTemplate, cateList);
  // let str = postList.map(post => {
  //   return `<li>
  //     <h3><a href="${post.linkName}">${post.title}</a></h3>
  //   </li>`;
  // });

  // blogTemplate = blogTemplate.replace("<%lastTopPost%>", str);

  // fs.writeFileSync("../dist/index.html", blogTemplate);
  fs.writeFileSync("../dist/category.html", html);
};
