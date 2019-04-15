const fs = require("fs");
module.exports.buildPost = post => {
  console.dir(post);
  let blogTemplate = fs.readFileSync("../template/article.html").toString();

  blogTemplate = blogTemplate.replace(/#%title%#/g, post.title);
  blogTemplate = blogTemplate.replace("#%dateTime%#", post.dateTime);
  blogTemplate = blogTemplate.replace("#%tags%#", post.tags);
  blogTemplate = blogTemplate.replace("#%content%#", post.content);
  blogTemplate = blogTemplate.replace("#%category%#", post.category);

  fs.writeFileSync("../dist/" + post.linkName, blogTemplate);
  console.info("../dist/" + post.linkName + "....done");
};

module.exports.buildIndex = postList => {
  let blogTemplate = fs.readFileSync("../template/index.html").toString();
  let str = postList.map(post => {
    return `<li>
      <h3><a href="${post.linkName}">${post.title}</a></h3>
    </li>`;
  });

  blogTemplate = blogTemplate.replace("#%lastTopPost%#", str);

  fs.writeFileSync("../dist/index.html", blogTemplate);
};
