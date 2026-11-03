# 象昇办公室 · 手机与电脑网页演示

这是 GitHub Pages 可直接发布的静态网站，首次进入位于电梯出口。

## 发布

1. 将本目录内的全部文件上传到目标 GitHub 仓库根目录，保留 vendor、assets 等文件夹。
2. 在仓库 Settings → Pages 中选择 Deploy from a branch，发布分支选择 main，目录选择 / (root)。
3. 等待 GitHub 给出实际部署网址，再在手机浏览器打开该网址。公开网页访问者无需 GPT 账号。

## 操作

手机：左下方向键行走，单指拖动场景转向，点选产品查看介绍；右上角平面导览可以快速切换房间。
电脑：WASD / 方向键行走，按住鼠标左键拖动转向，点击产品或按 E 查看，M 打开导览。

## 文件

入口 index.html；空间逻辑 app.js；展示陈列 exhibition-room.js；可修改参数 space-config.js。
全部脚本、模型和材质在仓库内，无需安装依赖、数据库、GPT API 或运行后端。

GitHub Pages 的实际可达性取决于访客网络，需要用目标手机的移动数据和 Wi-Fi 分别验证。它不能保证解决所有网络环境下的访问问题。

## 许可

Three.js：MIT，见 vendor/THREE-LICENSE.txt。
地毯材质：Poly Haven / Dirty Carpet，CC0，见 assets/ATTRIBUTION.md。
当前产品和卫生间洁具为演示内容。