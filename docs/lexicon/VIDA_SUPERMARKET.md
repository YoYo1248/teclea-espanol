# Vida 超市采购词库 V1

核对日期：2026-08-21。该模块面向在西班牙生活的中文使用者，目标是完成真实采购任务，不是食品安全、营养或消费建议。

## 当前结果

当前模块共 356 个 canonical 输入目标：

- 第一批新增 88 项、第二批新增 105 项、第三批新增 53 项、第四批新增 32 项；另复用 78 项其他批次 canonical 卡，没有生成重复卡；
- 新增内容累计 278 项：180 个单词、90 个不超过 3 词的短语、8 个动词原形；
- 完整 `life` 超市路线中免费体验 50 项、付费内容 306 项；
- 310 项同时进入 `exam` 编辑路线，46 项华人厨房或西班牙本地专门词暂时只进入 `life`；
- 新增内容分成 34 个内部短单元，每单元 6–12 项，不改变应用的短轮次抽取原则。

300 项已经达到超市词库 V1 的首个内容规模目标；之后的目录审计先定向复用了 `dinero`、大小、尺码、颜色等 10 张既有 A1 购物卡，又由明确的 B1 考试路线缺口触发，复用 12 张退换、价格与付款表达。第四批不是为了凑总数：用户明确要求覆盖华人更可能购买的食材、调料和日用品，现场缺口审计据此新增 32 项，并把既有的 `dónde está`、`cuánto cuesta` 复用到超市 L1，使模块达到 356 项。基础账户和取款操作仍归 Vida 安顿。本模块覆盖商品、标签、柜台、结账、售后、配送、清洁护理、亚洲食品和进阶零售沟通，但仍不是“完整西班牙超市词典”；后续优先级应转向具名语言复核、真实用户采购验证和任务式产品体验，而不是继续堆积低频商品名。

## 第二批新增范围

- 西红柿、土豆、洋葱、生菜、常见水果等基础果蔬；
- 面食、豆类、酸奶、黄油、火腿、金枪鱼和三文鱼；
- `cantidad neta`、`consumo preferente`、`país de origen`、营养成分和无乳糖等标签表达；
- 自助收银、条形码、购物小票、会员卡、自提、退货和退款；
- 洗衣、地面清洁、经期用品、婴儿纸尿裤和个人洗护；
- 米粉、香菇、海苔、糯米、绿豆、米粉类、淀粉和不同质地的豆腐。

## 第三批新增范围

- 肉铺、鱼鲜、熟食、烘焙、果蔬、冷藏和冷冻区域；
- 添加剂、防腐剂、过敏风险、易腐食品和沥干净重；
- 会员积分、补货、缺货替代、自提、配送时段和订单异常；
- 去鳞、去内脏、切片切块和人数份量；
- 非接触支付、价格错误、重复扣款、退货期限和送货缺件。

## 第四批缺口补充

- 醋、黑胡椒、孜然、欧芹、香叶、蜂蜜、酵母和高汤等基础调味与烹饪辅料；
- 花椰菜、芹菜、南瓜、红薯、牛皮菜、香肠、果汁和饼干等常买食品；
- 小麦面、黑醋、烹饪米酒、鱼露、花生油、豆酱、芝麻酱和辣椒油等华人厨房补缺；
- 烘焙纸、冷冻保鲜袋、洗碗机胶囊、护发素、漱口水、棉签、剃须刀和身体乳等厨房耗材与个人护理；
- `dónde está`、`cuánto cuesta` 已存在于统一目录，只增加超市 placement，不复制卡片或学习证据。

## 内容范围

1. 超市区域、购物工具和千克／克／升；
2. 罐、盒、托盘、把、片等包装与数量单位；
3. 配料、过敏原、批次、保质期、冷藏和冷冻；
4. 家庭烹饪常用蔬菜、肉类、鱼鲜和清洁用品；
5. `medio kilo`、`a granel`、`sin espinas` 等可直接使用的柜台表达；
6. 酱油、米醋、香油、蚝油、花椒、八角等华人厨房高概率候选。

“华人高概率”目前是产品假设，不是人口统计事实。专门词先进入生活路线，后续需要用匿名购物小票、最近三次采购访谈和实际搜索／练习数据验证。不能因为创作者熟悉某种饮食习惯，就声称所有中国用户都会购买。

## 免费与付费边界

免费 50 项覆盖找到商品、基础食品、计量、价格、付款、常见包装和柜台基本要求，让用户可以完成一次最小采购任务。其余 306 项先标记为付费内容，覆盖商品大小、尺码与颜色、标签、果蔬肉类、鱼鲜、清洁护理、售后配送、进阶交易表达和华人／亚洲厨房。

`access: paid` 目前只是目录元数据，不代表已经上线付费、订阅或永久购买。真正商业化前仍需验证用户是否愿意为“完成采购任务”付费，而不只是愿意浏览一份词表。

## 用语核对来源

- [AESAN：食品标签必须提供的信息](https://eletiquetadocuentamucho.aesan.gob.es/obligatoria.html)：配料、过敏原、净含量、保存条件、消费期限和保质期等标签语言。
- [AESAN：阅读和遵守食品标签（2025）](https://www.aesan.gob.es/AECOSAN/docs/documentos/publicaciones/seguridad_alimentaria/Lee_y_respeta_lo_que_dice_la_etiqueta.pdf)：超市冷藏／冷冻区、包装、保存和日期术语。
- [AESAN：2026–2030 食品标签监管方案](https://www.aesan.gob.es/AECOSAN/docs/documentos/seguridad_alimentaria/pncoca/2026/Programa_2.4_Etiquetado.pdf)：核对净含量、原产地、营养信息、保存条件和包装／散装商品字段。
- [Alcampo：Pollo al estilo oriental](https://www.compraonline.alcampo.es/recipes/pollo-al-estilo-oriental/3Y5inVVOmLoFE6Tb9nbzfl)：零售语境中使用 `jengibre`、`salsa de soja`、`vinagre de arroz`、`cilantro` 和 `sésamo` 等商品名。
- [Carrefour：香料与调味品](https://www.carrefour.es/supermercado/la-despensa/alimentacion/especias-y-sazonadores-laurel/cat20069/c)：核对 `pimienta negra`、`perejil`、`comino` 和 `laurel` 等当前货架名称。
- [Carrefour：食品收纳用品](https://www.carrefour.es/supermercado/limpieza-y-hogar-conservacion-de-alimentos-marca-carrefour/F-10gcZ11z0Z12cng/c)、[洗碗机用品](https://www.carrefour.es/supermercado/limpieza-y-hogar/productos-para-cocina/lavavajillas-a-maquina-y-aditivos/cat20296/c)与[个人护理](https://www.carrefour.es/supermercado/perfumeria-e-higiene/boca-y-sonrisa/enjuagues-bucales/cat20217/c)：核对烘焙纸、冷冻袋、洗碗机胶囊、漱口水等西班牙零售名称。
- [Carrefour：小麦面商品标签](https://www.carrefour.es/supermercado/fideos-yakisoba-con-pollo-carrefour-sensations-300-g/R-VC4AECOMM-398913/p)、[El Corte Inglés：鱼露](https://www.elcorteingles.es/supermarkt/B001018089303038-blue-dragon-fish-fischsauce-flasche-150-ml/)和[EcoAsiaShop：烹饪米酒](https://ecoasiashop.com/producto/vino-de-arroz-para-cocinar-750ml/)：核对亚洲食品的西语货架名称。
- [Oriental Market：亚洲油醋](https://www.orientalmarket.es/shop/aceites-y-vinagres/)、[酱油](https://www.orientalmarket.es/shop/salsas-de-soja/)和[其他酱料](https://www.orientalmarket.es/shop/otras-salsas/)：核对黑醋、花生油、豆酱、芝麻酱和辣椒油等西班牙亚洲食品零售用语。
- [RAE / ASALE：tique](https://dle.rae.es/tique) 与 [datáfono](https://dle.rae.es/dat%C3%A1fono)：核对购物小票的西语规范词形和西班牙常见刷卡终端名称。
- [Instituto Cervantes PCIC A1–A2 具体概念清单](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm)：只用于等级和饮食／购物概念领域映射，不批量复制词条。
- [Instituto Cervantes PCIC B1–B2 具体概念清单](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm)：只用于第三轮交易、支付与金融服务能力域映射，不把清单当作官方逐词认证。

## 语言和发布限制

- `pak choi` 也可能写作 `bok choy`；`panceta` 的具体切法与中文“五花肉”并非在所有柜台一一对应，卡片已保留提示。
- `Maicena` 是常见品牌名，因此 canonical 目标使用通用名称 `almidón de maíz`。
- 地区叫法、商品标签和货架分类会变化；目前以西班牙可理解的用语为主，不宣称覆盖所有西语国家。
- 本批有来源、例句和内部编辑记录，但尚无具名西语教师逐条复核，专业复核覆盖仍为 0。
