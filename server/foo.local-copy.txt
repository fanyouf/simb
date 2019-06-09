
<?php header("Access-Control-Allow-Origin:*");//此处使网站可以进行跨域访问
header("Content-Type:application/json;charset=UTF-8");//此处声明返回的是json类型及字符集为utf-8
$servername = "bdm289537170.my3w.com"; 
$username = "bdm289537170"; 
$password = "fanyf123."; 
$dbname = "bdm289537170_db"; 
$link=mysql_connect($servername,$username,$password);
$url = 'SELECT content,title,name as author FROM poetries,poets WHERE name in ("李白","杜甫") and poets.id  = poetries.poet_id and char_length(content)=24 limit 0, 100';
//$url = "SELECT * FROM poets limit 0,10";

// parse_str($_SERVER['QUERY_STRING']);
// echo $pageIndex;
// echo $pageSize;
// echo $author;
// , 远程连接可以使用$link=mysql_connect('115.159.200.13:3306','root','root');可能需要修改下mysql的配置，可以参考http://blog.csdn.net/qq_32357509/article/details/53048053
if(!$link){
echo "fail";
}else{
    mysql_select_db($dbname);
    mysql_query("set names utf8"); 
    $result=mysql_query($url);
    $json ="";
    $data =array(); //定义好一个数组.PHP中array相当于一个数据字典.
    //定义一个类,用到存放从数据库中取出的数据
    while ($row= mysql_fetch_array($result,MYSQL_ASSOC))
    {
        //var_dump ($row);
    $data[]=$row;
    }
    echo json_encode($data);//把数据转换为JSON数据.
}
?>