/*
 * @Author: mai05009
 * @Date: 2020-12-10 10:29:08
 * @LastEditTime: 2020-12-12 11:04:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \alipingxuan_pc\gulp.env.js
 */

const config={
    dev:{
        filePath:"test",
    },
    build:{
        filePath:"dist",
    },
    srcPath:{
        filePath:"src",
        scss:"src/css/*.scss",
        script:"src/js/*.js",
        image:"src/img/*"
    }
}

module.exports = config