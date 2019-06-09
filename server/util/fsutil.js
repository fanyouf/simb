const fs = require('fs'),
  stat = fs.stat,
  exists = function(src, dst, callback) {
    //测试某个路径下文件是否存在
    fs.exists(dst, function(exist) {
      if (exist) {
        //不存在
        callback(src, dst);
      } else {
        //存在
        fs.mkdir(dst, function() {
          //创建目录
          callback(src, dst);
        });
      }
    });
  },
  copy = function(src, dst) {
    //读取目录
    fs.readdir(src, function(err, paths) {
      if (err) {
        throw err;
      }
      paths.forEach(function(path) {
        var _src = `${src}/${path}`,
          _dst = `${dst}/${path}`,
          readable,
          writable;

        stat(_src, function(err1, st) {
          if (err1) {
            throw err1;
          }

          if (st.isFile()) {
            readable = fs.createReadStream(_src); //创建读取流
            writable = fs.createWriteStream(_dst); //创建写入流
            readable.pipe(writable);
          } else if (st.isDirectory()) {
            exists(_src, _dst, copy);
          }
        });
      });
    });
  };

module.exports.copyDir = function(src, dst) {
  exists(src, dst, copy);
};
