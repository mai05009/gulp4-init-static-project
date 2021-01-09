# gulp4-init-static-project  
使用gulp4初始化静态项目  
目录结构：  
--项目名  
&nbsp;&nbsp;--dist    //编译后目录  
&nbsp;&nbsp;--lib     //插件、框架像JQ，bootstrap  
&nbsp;&nbsp;+--src    //静态文件目录  
&nbsp;&nbsp;&nbsp;&nbsp;--css    //scss  
&nbsp;&nbsp;&nbsp;&nbsp;--img  
&nbsp;&nbsp;&nbsp;&nbsp;--js  
&nbsp;&nbsp;--test    //本地运行文件，用于实时预览  
&nbsp;&nbsp;--view   //存放静态.html  
  
项目使用gulp4，  
完成热加载，代理，gulp-file-include，  
cnpm i初始化后，运行npm run dev即可预览效果,

添加lib文件后需要重新运行npm run dev


