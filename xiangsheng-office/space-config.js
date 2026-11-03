// 灯光、展厅局部陈列和产品资料配置。长度单位：米。修改后刷新页面。房间边界和门窗沿用 app.js 中的原平面图。
export const SPACE_CONFIG={
 lighting:{exposure:1.10,environment:.48,hemisphere:1.05,ambient:.18,sun:2.0},
 exhibition:{origin:[20.8,0,15.19],cabinet:{left:-1.96,width:6,count:5,height:2.2,depth:.3,layers:4,itemsPerShelf:4,z:-2.98},islands:{x:[0,2.4],z:-1.34,scale:.52}},
 conference:{x:19.7,z:16.28,length:4.2,depth:1.2,height:.77},
 products:[
 {name:'青禾 · 生长原液',en:'GROWTH ESSENCE',series:'01 / 植物营养系列',kind:'bottle',color:'#efeee5',cap:'#eff0e7',ink:'#3a653c',accent:'#93aa54',size:'500 mL',no:'XS-001',subtitle:'清透的绿色语言，承载生长的想象。',intro:'青禾是为本展厅设计的植物营养概念系列。米白瓶身搭配深绿标签，以叶片与田野图形传递自然、简洁的视觉印象。',detail:'这里展示的是包装与陈列设计示例。正式版本可以替换为产品配方、使用说明、检测资料和品牌故事。',tags:['米白瓶身','植物图形','营养概念']},
 {name:'沃土 · 微生态',en:'SOIL MICRO ECOLOGY',series:'02 / 土壤探索系列',kind:'bottle',color:'#181b12',cap:'#11150e',ink:'#ece0a8',accent:'#b49845',size:'1 L',no:'XS-002',subtitle:'深色瓶身与金色细节，表达土地的厚度。',intro:'沃土采用深色瓶身与金绿色标签，作为土壤探索系列的概念包装。圆润肩部、细密瓶盖纹路和弧面标签，让近距离查看更有细节。',detail:'当前名称和规格仅用于演示，未包含真实商品信息或功效承诺。后续可关联正式产品介绍和相关资料。',tags:['深色包装','金色细节','土壤概念']},
 {name:'原野 · 复合颗粒',en:'FIELD COMPOUND',series:'03 / 田野概念系列',kind:'pouch',color:'#456a2e',cap:'#2e4922',ink:'#f3efd6',accent:'#a8b85b',size:'2 kg',no:'XS-003',subtitle:'以层叠田野为灵感的立式包装。',intro:'原野以绿色立式袋装呈现，正面用抽象田野纹理与留白组织信息。封口压纹、侧边折线和底部折角共同构成包装轮廓。',detail:'它用来展示袋装产品在展柜和圆形展台上的陈列方式。规格与文案均为概念示例，可随正式产品资料调整。',tags:['立式袋装','田野纹理','颗粒概念']},
 {name:'蓝澜 · 水溶营养',en:'WATER SOLUBLE',series:'01 / 植物营养系列',kind:'jug',color:'#176b8b',cap:'#b1d5dc',ink:'#edf0dc',accent:'#5babb0',size:'5 L',no:'XS-004',subtitle:'蓝色容器，以流动曲线表达轻盈。',intro:'蓝澜是带提手容器的概念展品。蓝色瓶身、偏置瓶口和曲线图形构成独立的系列识别，展示更大规格包装的比例与细节。',detail:'此模型用于体验大容量产品的三维展示。正式内容可以补充包装规格、使用场景及相应文档。',tags:['提手容器','蓝色系列','容量示例']},
 {name:'森源 · 土壤养护',en:'SOIL CARE',series:'02 / 土壤探索系列',kind:'jug',color:'#ecece0',cap:'#eff0e7',ink:'#3e613b',accent:'#92a868',size:'5 L',no:'XS-005',subtitle:'自然留白，让产品信息清晰呈现。',intro:'森源采用米白提手容器与绿色标签。包装上的枝叶图案、品名与系列编号形成清晰层次，适合与小规格瓶装产品组合陈列。',detail:'这是一件演示样品，展示如何在统一空间中组织不同包装形式和规格。后续可替换真实包装文件。',tags:['米白容器','枝叶设计','系列陈列']},
 {name:'金穗 · 田野精粹',en:'HARVEST COLLECTION',series:'03 / 田野概念系列',kind:'bottle',color:'#5c3d11',cap:'#171a12',ink:'#e8dba8',accent:'#c4a442',size:'500 mL',no:'XS-006',subtitle:'温暖的琥珀色，呼应收获的季节。',intro:'金穗以琥珀色瓶身和麦穗图形完成田野系列的包装概念。它与绿色、米白和蓝色产品形成色彩节奏，让展柜的陈列更丰富。',detail:'包装颜色、规格和文字仅用于视觉与交互演示，并不代表真实产品。',tags:['琥珀瓶身','麦穗图形','暖色包装']}
]
};
