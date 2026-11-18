export const sources = {
  fsn: ['TYPE-MOON｜《Fate/stay night REMASTERED》导读', 'https://typemoon.com/products/f-sn/introduction/fate/'],
  hf: ['TYPE-MOON｜Heaven’s Feel 导读', 'https://typemoon.com/products/f-sn/introduction/hf/'],
  ubw: ['TYPE-MOON｜Unlimited Blade Works 导读', 'https://typemoon.com/products/f-sn/introduction/ubw/'],
  zero: ['TYPE-MOON｜《Fate/Zero》原著导读', 'https://typemoon.com/contents/9ncnes/ds0pbh'],
  zguide: ['《Fate/Zero》官网｜圣杯战争术语及人物关系', 'https://www.fate-zero.jp/news/index.html?p=56'],
  zstory: ['《Fate/Zero》官网｜分集记录（第11、16、24、25话）', 'https://www.fate-zero.jp/story/index.html'],
  apo: ['TYPE-MOON｜《Fate/Apocrypha》第1卷试阅', 'https://www.typemoon.com/products/tmbooks/apocrypha/Fap01_trial.pdf'],
  apoworld: ['《Fate/Apocrypha》官网｜世界设定', 'https://fate-apocrypha.com/world/column/'],
  fake: ['TYPE-MOON｜《Fate/strange Fake》第1卷介绍', 'https://www.typemoon.com/information/info.html'],
  extra: ['《Fate/EXTRA Last Encore》官网｜设定词条', 'https://fate-extra-lastencore.com/keyword/'],
  proto: ['KADOKAWA｜《苍银的碎片》第1卷', 'https://www.kadokawa.co.jp/product/321405000240/'],
  labyrinth: ['TYPE-MOON｜《Fate/Labyrinth》', 'https://typemoon.com/contents/fate-prototype/fate-labyrinth'],
  samurai: ['光荣特库摩｜《Fate/Samurai Remnant》', 'https://www.gamecity.ne.jp/fate-sr/'],
  hollow: ['TYPE-MOON｜《Fate/hollow ataraxia》', 'https://www.typemoon.com/products/hollow/main.html'],
  fgo: ['《Fate/Grand Order》官网｜序章', 'https://www.fate-go.jp/story/'],
  redline: ['KADOKAWA｜帝都圣杯奇谭 type Redline', 'https://comic-walker.com/detail/KC_000523_S'],
  fakeworld: ['Aniplex｜《Fate/strange Fake》世界设定', 'https://fatesf-anime.com/world/'],
  heian: ['《Fate/Grand Order》官网｜地狱界曼荼罗', 'https://news.fate-go.jp/2020/heiankyo/'],
  sealref: ['第五战令咒形制对照（民间重绘）', 'https://booth.pm/ja/items/6130223'],
  material: ['TYPE-MOON Wiki｜《Fate/side material》词条索引（英译）', 'https://typemoon.fandom.com/wiki/Encyclopedia/Fsm'],
  cm: ['TYPE-MOON｜《Fate/complete material III》设定集介绍', 'https://typemoon.com/contents/9ncnes/fate-complete-material'],
  fuyuki: ['TYPE-MOON Wiki｜冬木圣杯战争与解体记载', 'https://typemoon.fandom.com/wiki/Fuyuki_Holy_Grail_War'],
  wars: ['维基学院｜历代圣杯战争（含同人条目）', 'https://zh.wikiversity.org/zh-hans/歷代聖杯戰爭'],
  wiki: ['中文维基百科｜《Fate/stay night》', 'https://zh.wikipedia.org/wiki/Fate/stay_night'],
  mug: ['萌娘百科｜圣杯战争', 'https://zh.moegirl.org.cn/圣杯战争'],
  universe: ['萌娘百科｜型月世界', 'https://zh.moegirl.org.cn/型月世界'],
  typemoon: ['TYPE-MOON Wiki｜设定索引', 'https://typemoon.fandom.com/wiki/TYPE-MOON_Wiki'],
  vessel: ['TYPE-MOON Wiki｜冬木小圣杯（附《Fate/Zero material》出处）', 'https://typemoon.fandom.com/wiki/Lesser_Holy_Grail_of_Fuyuki'],
  video2: ['星穹徐布斯｜第二期：圣杯战争的起源', 'https://www.bilibili.com/video/BV1Ct411b7XV/'],
  video3: ['星穹徐布斯｜第三期：型月世界观与圣杯战争', 'https://www.bilibili.com/video/av42466143/'],
  video4: ['星穹徐布斯｜第四期：时间线与世界线', 'https://www.bilibili.com/video/BV1Qb41127AS/']
};

export const wars = [
  {id:'first', no:'I', period:'1800年代', name:'第一次圣杯战争', title:'御三家建立仪式', mark:'创设', intro:'爱因兹贝伦、远坂与玛奇里在冬木联手，建立了后来称为圣杯战争的仪式。设定集将筹备与第一次争夺分列：1790年代是三家在冬木着手准备的时期，第一次战争列于1800年代。', facts:[['地点','日本·冬木'],['参与者','爱因兹贝伦、远坂、玛奇里'],['资料状况','原作回溯；完整名单未公开']], prose:['爱因兹贝伦提供仪式的核心，远坂提供冬木灵地，玛奇里（后来改姓间桐）参与建立御主约束从者的体系。冬之圣女羽斯缇萨与大圣杯的成立密切相关。','早期仪式缺少后来的成文规则。参加者没有就如何分享成果达成一致，合作很快演变成争夺。站内不强行为这一战指定公历年份，也不把后续定型的规则逐条倒推到此时。'], secret:'仪式未达到创设者的目的。留在冬木地下的系统得以继续积蓄魔力，下一次争夺仍以同一基础举行。', refs:['fsn','apo','material','wiki']},
  {id:'second', no:'II', period:'1860年代', name:'第二次圣杯战争', title:'争夺再次失控', mark:'规则形成', intro:'在大圣杯重新蓄积魔力后，冬木再度举行仪式。第二战的留存记载很少，后续档案也没有给出可核的七组名单。', facts:[['地点','日本·冬木'],['核心问题','参战者争斗缺乏有效约束'],['资料状况','设定集回溯；具体过程不详']], prose:['冬木仪式常被描述为约六十年一轮。这个周期取决于大圣杯的魔力积蓄，属于通常条件，第五战的间隔就是例外。','此时的争夺强化了统一规则和监督的需要。此后冬木圣杯战争逐渐采用更稳定的参战形式，并由圣堂教会派出监督者。'], secret:'这一战依然没有产生获得圣杯的胜者。精确年份、完整御主名录和各方退场顺序均不作为定论。', refs:['fsn','zguide','material']},
  {id:'third', no:'III', period:'1930年代', name:'第三次圣杯战争', title:'冬木与外典的分岔', mark:'世界线分歧', intro:'第三战是理解后续多条世界线的关键。第三次仪式之后，冬木主线与《Fate/Apocrypha》记录的大圣杯去向不同。', facts:[['地点','日本·冬木'],['主要变数','爱因兹贝伦的非常规召唤'],['资料状况','原作回溯与外典对照']], prose:['从者以职阶容器现身，冬木通常设置七个职阶。非常规召唤可以改写一个席位；第三战的两条记录展示了不同选择带来的后果。','后两次冬木战争承接《Fate/stay night》一侧的结果。《Fate/Apocrypha》中，大圣杯在这一代仪式后脱离御三家掌控，这条冬木序列没有照常延续。'], secret:'本传一侧召唤了复仇者安哥拉曼纽；他退场后被圣杯收纳，污染了大圣杯。外典一侧，爱因兹贝伦召唤的是裁定者天草四郎时贞；达尼克夺走大圣杯并将它移往罗马尼亚。二者是两条记录，不是同一场仪式中的先后事件。', refs:['hf','apo','apoworld','material']},
  {id:'fourth', no:'IV', period:'约1994年', name:'第四次圣杯战争', title:'第四战与冬木大火', mark:'Fate/Zero', intro:'在第五战约十年前，七组参战者于冬木争夺圣杯。爱因兹贝伦委托卫宫切嗣以御主身份参战，爱丽丝菲尔则承担了与小圣杯有关的职责。', facts:[['地点','日本·冬木'],['监督','言峰璃正'],['代表记录','《Fate/Zero》']], prose:['正式席位仍以七骑组织。起始契约包括卫宫切嗣与Saber、远坂时臣与Archer、肯尼斯与Lancer、韦伯与Rider等，实际供魔者和契约变动需要单独记录。','这一战把冬木规则的两条边界推向前台：令咒可以直接迫使从者执行命令，而摧毁小圣杯只能中断这一次仪式。'], secret:'切嗣察觉圣杯实现其愿望的方式不可接受，以令咒命Saber破坏小圣杯。大圣杯仍在，泄出的黑泥酿成冬木大火；切嗣在灾后救出卫宫士郎。', refs:['zero','zguide','zstory','wiki']},
  {id:'fifth', no:'V', period:'2004年', name:'第五次圣杯战争', title:'同一场战争，三条记录', mark:'Fate/stay night', intro:'距离上次仅约十年，冬木再次举办仪式。卫宫士郎意外与Saber建立契约，远坂凛召唤Archer，七骑争夺重新开始。', facts:[['地点','日本·冬木'],['监督','言峰绮礼'],['代表记录','《Fate/stay night》']], prose:['第四战在仪式完成前中断，留下的魔力缩短了下次启动所需的间隔。这使第五战远早于通常的约六十年周期。','Fate、Unlimited Blade Works、Heaven’s Feel是第五战的三条叙事分支。它们有共同的开局，随后在契约、交战与圣杯处置上出现分歧，不能排成三届战争。'], secret:'Fate与Unlimited Blade Works都出现对当届圣杯显现的破坏，具体人物行动与后日谈不同；Heaven’s Feel把冲突推进到大圣杯本体，樱与伊莉雅的容器身份成为关键。档案不将这些互斥结局合并为一次事件。', refs:['fsn','hf','wiki','material']}
];

export const variants = [
  ['罗马尼亚圣杯大战','分歧与复制','图利法斯 · 第三战数十年后','第三战后被夺走的冬木大圣杯在罗马尼亚重现。红黑两阵营各召七骑，另有Ruler执行裁定。','同一大圣杯的异地运用；七组争夺改为七对七。','apo','apoworld'],
  ['外典世界的亚种战争','分歧与复制','全球多地 · 外典世界线','冬木仪式的仿制品在多地流传；小说所述的常见亚种规模较小，难以复制原仪式的完整能力。','仿造部分机制。不能因此推定每一种变体都属于同一系统。','apo'],
  ['雪原市圣杯战争','分歧与复制','美国 · 雪原市','当地有人仿制冬木仪式。缺损的「伪」仪式与其后展开的「真」仪式重叠，不宜用冬木的七组公式直接计算双方。','复制、错位与并行启动。','fake','fakeworld'],
  ['月之圣杯战争','独立系统','月球 · SE.RA.PH','月之圣杯是Moon Cell。参与者进入灵子虚拟世界，按月面系统的淘汰规则争取抵达中枢。','程序主持的淘汰赛；冬木地点和大圣杯都不适用。','extra'],
  ['东京两次圣杯战争','独立系统','东京 · 1991年／1999年','《苍银的碎片》记录1991年的战事，《Fate/Prototype》对应八年后的另一场仪式。','Prototype体系内部的两届战争，不接在冬木五战之后。','proto'],
  ['迷宫中的亚种圣杯','独立系统','平行世界 · 地下迷宫','在1991年东京圣杯战争期间，沙条爱歌的意识受亚种圣杯引导，进入另一世界的迷宫。','亚种圣杯成为跨世界遭遇的起点；不另编为东京第三届。','labyrinth'],
  ['盈月之仪','独立系统','江户 · 庆安四年（1651）','七名参与者与七骑从者围绕能实现愿望的盈月展开争夺。','江户的仿制仪式；独立建档，与冬木的届次无关。','samurai'],
  ['帝都圣杯奇谭','独立系统','日本帝都 · 二战末期','《Fate/type Redline》记录发生在二战末期帝都的圣杯争夺。它与冬木第三战年代接近，仪式档案独立。','地理、阵营与叙事版本均与冬木不同。','redline'],
  ['四日循环','特殊记录','冬木 · 第五战约半年后','《Fate/hollow ataraxia》把一场再开的争夺放进反复经历的四日。','循环复演；不编入冬木第六次。','hollow'],
  ['迦勒底世界的冬木与特异点F','特殊记录','冬木 · 2004年','《Fate/Grand Order》序章调查燃烧的冬木。迦勒底世界所记述的圣杯战争，与主角进入的异常时空需要分开理解。','特异点是异常历史记录，不能当成《stay night》第五战的结局。','fgo'],
  ['天览圣杯战争','特殊记录','平安京 · 1008年','七组参与者与平安京的召唤仪式构成《地狱界曼荼罗》的核心。','特异点内部的仪式；英灵召唤的安排与冬木有别。','heian'],
  ['美游世界的圣杯战争','特殊记录','平行冬木 · 美游一侧','《魔法少女伊莉雅》的美游世界采用职阶卡，争夺围绕可实现愿望的容器展开。','职阶卡提供另一种借用英灵力量的方式，不按冬木五战编号。','wars']
];

export const classes = [
  ['Saber','剑士','以剑为主要武装的职阶，通常重视近身作战所需的综合能力。','M12 20V5m0 0 2 3-2-6-2 6 2-3M7 14h10m-7 6h4'],
  ['Archer','弓兵','擅长远距离攻击；判断依据包括投射能力，并不要求外观上一定持弓。','M6 4c13 1 13 15 0 16l4-8-4-8m1 8h14m-3-3 3 3-3 3'],
  ['Lancer','枪兵','以长枪或类似武装见长，常在速度、间距和攻击范围上占优。','M5 19 17 7m-4 1 7-4-4 7M4 20l3-1'],
  ['Rider','骑兵','以坐骑、载具或驾驭能力闻名，相关传说可以成为这一职阶的宝具。','M4 17h16m-13 0V9l5-5 6 4v5h-5l-2-2-2 4'],
  ['Caster','魔术师','善于施展术式，往往凭借阵地、道具和预先准备建立优势。','M12 8v13m-3-2h6m-3-17 4 4-4 4-4-4 4-4'],
  ['Assassin','暗杀者','侧重隐匿、侦察与突袭。冬木召唤与哈桑之名相关，也存在违规召唤的例外。','M4 18 18 4l2 2L6 20m1-9 6 6m4-12 2 2'],
  ['Berserker','狂战士','借由狂化强化能力，通常要付出理性、控制难度或魔力负担的代价。','M12 3v18M5 5l14 14M19 5 5 19M4 10v4m16-4v4']
];

export const masters = {
  IV:[['卫宫切嗣','Saber','与爱因兹贝伦合作','爱丽丝菲尔作为对外同伴活动，切嗣才是契约御主。','阿尔托莉雅·潘德拉贡'],['远坂时臣','Archer','冬木御三家·远坂','以家族传承的目的参战。','吉尔伽美什；后改与言峰绮礼缔约。'],['肯尼斯·埃尔梅罗伊·阿其波卢德','Lancer','时钟塔','索拉承担供魔，契约与供魔被分开。','迪尔姆德·奥迪那'],['韦伯·维尔维特','Rider','时钟塔学生','携带召唤触媒前往冬木。','伊斯坎达尔'],['雨生龙之介','Caster','非传统魔术师','意外召唤Caster，成为异常的参战者。','吉尔·德·雷'],['言峰绮礼','Assassin','圣堂教会出身','起初与远坂时臣保持隐秘合作。','百貌哈桑；其退场后与Archer缔约。'],['间桐雁夜','Berserker','冬木御三家·间桐','以自身为代价获得参战资格。','兰斯洛特']],
  V:[['卫宫士郎','Saber','意外参战','在仓库召唤Saber后进入战争。','阿尔托莉雅·潘德拉贡'],['远坂凛','Archer','冬木御三家·远坂','继承远坂家的参战使命。','卫宫（EMIYA）'],['Lancer阵营','Lancer','契约变更','开局的行动者与最初召唤者应分开。','库·丘林；最初为巴泽特所召唤，后由言峰绮礼夺去。'],['Rider阵营','Rider','代理控制','召唤者与对外行使命令者有别。','美杜莎；间桐樱为御主，间桐慎二通过伪臣之书代理控制。'],['Caster阵营','Caster','契约变更','开局时与柳洞寺有关，其经历涉及先后两名御主。','美狄亚；原御主为阿特拉姆·加里阿斯塔，后与葛木宗一郎缔约。'],['Assassin阵营','Assassin','非常规召唤','召唤者身份超出通常的御主框架。','Caster以柳洞寺山门为依托召唤「佐佐木小次郎」；HF分支另有真正的Assassin。'],['伊莉雅丝菲尔·冯·爱因兹贝伦','Berserker','冬木御三家·爱因兹贝伦','代表爱因兹贝伦参加第五战。','赫拉克勒斯']]
};

export const ritual = [
  ['01','储存魔力','冬木的灵脉供养大圣杯。大圣杯是设在地下的仪式基础，平常不会以一只金杯呈现。'],
  ['02','召唤与缔约','御主与从者建立契约，从者以职阶显现。触媒常用于建立与某位英灵的联系，但并非只有一种召唤方式。'],
  ['03','收纳退场从者','小圣杯暂时截留退场的从者之魂。它是容器，也是启动大圣杯后续仪式的关键。'],
  ['04','开启通路','冬木创设者试图借英灵之魂返回英灵之座时打开的通路抵达根源。许愿与抵达根源的条件并不相同。']
];
