export type LexiconRoute = 'life' | 'exam'
export type LifeModule = 'supermarket' | 'mobility' | 'settling' | 'daily'
export type LifeTier = 'L1' | 'L2' | 'L3'
export type ContentAccess = 'free' | 'paid'
export type LifePlacement = { module: LifeModule; tier: LifeTier; access: ContentAccess }
type LessonLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
type LessonScene = '基础' | '日常' | '餐厅' | '旅行' | '购物' | '住宿' | '时间' | '家庭' | '城市' | '健康' | '学习' | '工作' | '社会' | '科技' | '环境' | '行政' | '情绪'
type PartOfSpeech = 'noun' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction' | 'verb'

export type VidaWord = {
  spanish: string
  chinese: string
  lemma: string
  partOfSpeech?: PartOfSpeech
  article?: string
  example: string
  exampleChinese: string
  note?: string
  routes: LexiconRoute[]
}

export type VidaDeck = {
  id: string
  level: LessonLevel
  scene: LessonScene
  kind: '单词' | '短语' | '动词原形'
  title: string
  description: string
  lifeModule: LifeModule
  lifeTier: LifeTier
  access: ContentAccess
  reviewKey?: string
  frameworkReference: string
  source: { name: string; url: string; license: string; checkedAt: string }
  words: VidaWord[]
}

const A1_A2_PCIC = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm'
const B1_B2_PCIC = 'https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm'
const checkedAt = '2026-08-21'
const source = {
  name: 'Vida 超市任务词库 · 西班牙官方、零售与 PCIC 用语核对',
  url: 'https://github.com/YoYo1248/holadone/blob/main/docs/lexicon/VIDA_SUPERMARKET.md',
  license: '官方与零售页面仅用于真实任务用语核对；中文释义、例句与教学编组 GPL-3.0',
  checkedAt,
}

const dual: LexiconRoute[] = ['life', 'exam']
const life: LexiconRoute[] = ['life']
const w = (
  spanish: string,
  chinese: string,
  example: string,
  exampleChinese: string,
  partOfSpeech: VidaWord['partOfSpeech'],
  routes: LexiconRoute[] = dual,
  note?: string,
): VidaWord => ({ spanish, chinese, lemma: spanish.toLocaleLowerCase('es-ES').normalize('NFC'), partOfSpeech, example, exampleChinese, routes, note })

const n = (
  spanish: string,
  chinese: string,
  article: 'el' | 'la' | 'los' | 'las',
  example: string,
  exampleChinese: string,
  routes: LexiconRoute[] = dual,
  note?: string,
): VidaWord => ({ ...w(spanish, chinese, example, exampleChinese, 'noun', routes, note), article })

export type VidaExistingTarget = {
  spanish: string
  lifeTier: LifeTier
  access: ContentAccess
  example?: string
  exampleChinese?: string
}

const existing = (
  spanish: string,
  lifeTier: LifeTier,
  access: ContentAccess,
  example?: string,
  exampleChinese?: string,
): VidaExistingTarget => ({ spanish, lifeTier, access, example, exampleChinese })

// Existing canonical cards that already solve part of the supermarket task.
// The overlay adds the life route without changing lesson/card IDs, so prior
// evidence remains reusable. Examples are supplied only where the older card
// did not already carry a bilingual example.
export const vidaSupermarketExistingTargets: VidaExistingTarget[] = [
  existing('agua', 'L1', 'free', 'Necesito una botella de agua.', '我需要一瓶水。'),
  existing('leche', 'L1', 'free', 'La leche está en la zona refrigerada.', '牛奶在冷藏区。'),
  existing('pan', 'L1', 'free', 'Busco pan para el desayuno.', '我在找早餐吃的面包。'),
  existing('arroz', 'L1', 'free', 'Compramos una bolsa de arroz.', '我们买了一袋大米。'),
  existing('carne', 'L1', 'free', 'La carne está en el mostrador del fondo.', '肉在最里面的柜台。'),
  existing('pescado', 'L1', 'free', 'Quiero pescado para la cena.', '我想买晚餐吃的鱼。'),
  existing('pollo', 'L1', 'free', 'Necesito un pollo entero.', '我需要一只整鸡。'),
  existing('huevo', 'L1', 'free', 'Los huevos vienen en una caja de doce.', '鸡蛋一盒十二个。'),
  existing('fruta', 'L1', 'free', 'La fruta se pesa aquí.', '水果在这里称重。'),
  existing('verdura', 'L1', 'free', 'La verdura fresca está junto a la fruta.', '新鲜蔬菜在水果旁边。'),
  existing('precio', 'L1', 'free', 'Mira el precio por kilo.', '看一下每公斤价格。'),
  existing('tarjeta', 'L1', 'free', 'Voy a pagar con tarjeta.', '我要刷卡付款。'),
  existing('efectivo', 'L1', 'free', 'Esta caja también acepta efectivo.', '这个收银台也接受现金。'),
  existing('recibo', 'L1', 'free', 'Guarda el recibo de la compra.', '保留购物收据。'),
  existing('bolsa', 'L1', 'free', '¿Necesita una bolsa?', '您需要袋子吗？'),
  existing('barato', 'L1', 'free', 'Este paquete es más barato.', '这包更便宜。'),
  existing('caro', 'L1', 'free', 'El aceite está demasiado caro.', '这瓶油太贵了。'),
  existing('comprar', 'L1', 'free', 'Voy a comprar fruta y leche.', '我要买水果和牛奶。'),
  existing('pagar', 'L1', 'free', 'Puede pagar en la caja automática.', '您可以在自助收银台付款。'),
  existing('buscar', 'L1', 'free', 'Busco salsa de soja.', '我在找酱油。'),
  existing('encontrar', 'L1', 'free', 'No encuentro el arroz integral.', '我找不到糙米。'),
  existing('necesitar', 'L1', 'free', 'Necesito medio kilo de tomates.', '我需要半公斤西红柿。'),
  existing('producto', 'L1', 'free'),
  existing('oferta', 'L1', 'free'),
  existing('azúcar', 'L1', 'free'),
  existing('sal', 'L1', 'free'),
  existing('cerveza', 'L2', 'paid'),
  existing('aceite', 'L1', 'paid'),
  existing('dinero', 'L1', 'paid'),
  existing('grande', 'L1', 'paid'),
  existing('pequeño', 'L1', 'paid'),
  existing('talla', 'L1', 'paid'),
  existing('color', 'L1', 'paid'),
  existing('rojo', 'L1', 'paid'),
  existing('azul', 'L1', 'paid'),
  existing('blanco', 'L1', 'paid'),
  existing('negro', 'L1', 'paid'),
  existing('nuevo', 'L1', 'paid'),
  existing('queso', 'L1', 'paid'),
  existing('naranja', 'L1', 'paid'),
  existing('vino', 'L2', 'paid'),
  existing('chocolate', 'L1', 'paid'),
  existing('hielo', 'L2', 'paid'),
  existing('botella', 'L1', 'paid'),
  existing('manzana', 'L1', 'paid'),
  existing('sopa', 'L1', 'paid'),
  existing('cuchillo', 'L2', 'paid'),
  existing('limón', 'L1', 'paid'),
  existing('plástico', 'L2', 'paid'),
  existing('horno', 'L2', 'paid'),
  existing('alimento', 'L2', 'paid'),
  existing('bebida', 'L1', 'paid'),
  existing('harina', 'L2', 'paid'),
  existing('pieza', 'L2', 'paid'),
  existing('promoción', 'L2', 'paid'),
  existing('entero', 'L2', 'paid'),
  existing('peso', 'L2', 'paid'),
  existing('pedido', 'L2', 'paid'),
  existing('compra', 'L2', 'paid'),
  existing('basura', 'L2', 'paid'),
  existing('café', 'L1', 'paid', 'El café está junto al té.', '咖啡在茶旁边。'),
  existing('té', 'L1', 'paid', 'Quiero una caja de té verde.', '我想要一盒绿茶。'),
  existing('limpio', 'L2', 'paid', 'Necesito un paño limpio.', '我需要一块干净的布。'),
  existing('sucio', 'L2', 'paid', 'Cambia el estropajo cuando esté sucio.', '百洁布脏了就更换。'),
  existing('hacer una devolución', 'L3', 'paid'),
  existing('hacer un cambio', 'L3', 'paid'),
  existing('hacer un descuento', 'L3', 'paid'),
  existing('subir el precio', 'L3', 'paid'),
  existing('bajar el precio', 'L3', 'paid'),
  existing('estar de oferta', 'L3', 'paid'),
  existing('tener garantía', 'L3', 'paid'),
  existing('ir de rebajas', 'L3', 'paid'),
  existing('pasar por caja', 'L3', 'paid'),
  existing('pago con tarjeta', 'L3', 'paid'),
  existing('comprar por internet', 'L3', 'paid'),
  existing('precios especiales', 'L3', 'paid'),
  existing('dónde está', 'L1', 'paid'),
  existing('cuánto cuesta', 'L1', 'paid'),
]

// Vida production batches: canonical targets for completing a supermarket
// trip in Spain. General items also feed the CEFR/PCIC editorial route; highly
// specific Chinese-kitchen items stay life-only unless later exam evidence is
// recorded. A route tag is an editorial inclusion rule, not official approval.
export const vidaSupermarketDecks: VidaDeck[] = [
  {
    id: 'vida-supermarket-navigation-a1', level: 'A1', scene: '购物', kind: '单词',
    title: '找到商品与确认数量', description: '认识超市区域、购物工具和最基础的计量单位',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'free', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('supermercado', '超市', 'El supermercado abre a las nueve.', '超市九点开门。', 'noun'),
      w('pasillo', '过道；货架通道', 'El arroz está en el tercer pasillo.', '大米在第三条货架通道。', 'noun'),
      w('carrito', '购物车；小推车', 'Necesitamos un carrito para la compra.', '我们购物需要一辆购物车。', 'noun'),
      w('cesta', '购物篮；篮子', 'Puse la fruta en la cesta.', '我把水果放进了购物篮。', 'noun'),
      w('estantería', '货架；搁板', 'La leche está en esa estantería.', '牛奶在那个货架上。', 'noun'),
      w('kilo', '千克；公斤', 'Quiero un kilo de tomates.', '我想要一公斤西红柿。', 'noun'),
      w('gramo', '克', 'Este paquete contiene quinientos gramos.', '这包有五百克。', 'noun'),
      w('litro', '升', 'Compré un litro de leche.', '我买了一升牛奶。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-packaging-a1', level: 'A1', scene: '购物', kind: '单词',
    title: '包装与柜台数量', description: '看懂常见容器以及肉类、蔬菜的计数方式',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'free', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('docena', '一打；十二个', 'Compramos una docena de huevos.', '我们买了一打鸡蛋。', 'noun'),
      w('lata', '罐头；金属罐', 'Añade una lata de tomate.', '加入一罐西红柿。', 'noun'),
      w('tarro', '玻璃罐；广口瓶', 'Necesito un tarro de miel.', '我需要一罐蜂蜜。', 'noun'),
      w('bandeja', '托盘；盒装托盘', 'La carne viene en una bandeja.', '这肉装在一个托盘盒里。', 'noun'),
      w('manojo', '一把；一捆', 'Deme un manojo de cebolletas.', '请给我一把小葱。', 'noun'),
      w('loncha', '薄片', 'Quiero cuatro lonchas de jamón.', '我想要四片火腿。', 'noun'),
      w('rodaja', '圆片；切片', 'Corta el limón en rodajas.', '把柠檬切成片。', 'noun'),
      w('envase', '包装；容器', 'El envase está dañado.', '这个包装破损了。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-labels-a2', level: 'A2', scene: '购物', kind: '单词',
    title: '食品标签与保存方式', description: '核对配料、过敏原、日期和冷藏冷冻状态',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('etiqueta', '标签', 'Lee la etiqueta antes de comprarlo.', '购买前请阅读标签。', 'noun'),
      w('ingrediente', '配料；成分', 'El primer ingrediente es arroz.', '第一项配料是大米。', 'noun'),
      w('alérgeno', '过敏原', 'La etiqueta destaca cada alérgeno.', '标签突出标明了每种过敏原。', 'noun'),
      w('caducidad', '失效；保质期限', 'Comprueba la fecha de caducidad.', '请检查保质期。', 'noun'),
      w('lote', '批次；批号', 'El número de lote aparece junto a la fecha.', '批号显示在日期旁边。', 'noun'),
      w('congelado', '冷冻的', 'El pescado congelado está al fondo.', '冷冻鱼在最里面。', 'adjective'),
      w('refrigerado', '冷藏的', 'Mantenga el producto refrigerado.', '请将产品冷藏保存。', 'adjective'),
      w('fresco', '新鲜的', 'Busco pescado fresco para la cena.', '我在找晚餐用的新鲜鱼。', 'adjective'),
    ],
  },
  {
    id: 'vida-supermarket-produce-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '蔬菜与味道基础', description: '挑选家庭做饭常用的蔬菜、香料和食品属性',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('ecológico', '有机的；生态的', 'Estos huevos llevan el sello ecológico.', '这些鸡蛋带有有机认证标志。', 'adjective'),
      w('picante', '辣的；辛辣的', 'Esta salsa es muy picante.', '这款酱很辣。', 'adjective'),
      w('grasa', '脂肪；油脂', 'La etiqueta indica la cantidad de grasa.', '标签标明了脂肪含量。', 'noun'),
      w('proteína', '蛋白质', 'El tofu contiene proteína.', '豆腐含有蛋白质。', 'noun'),
      w('ajo', '大蒜', 'Necesito dos cabezas de ajo.', '我需要两头大蒜。', 'noun'),
      w('jengibre', '姜；生姜', 'Añade un poco de jengibre fresco.', '加入一点鲜姜。', 'noun'),
      w('cebolleta', '小葱；嫩葱', 'Corta la cebolleta muy fina.', '把小葱切得很细。', 'noun'),
      w('cilantro', '香菜；芫荽', '¿Tiene cilantro fresco?', '有新鲜香菜吗？', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-vegetables-a2', level: 'A2', scene: '餐厅', kind: '单词',
    title: '家庭烹饪常用蔬菜', description: '补充炒菜、炖煮和配菜时高概率购买的食材',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('puerro', '韭葱；大葱', 'El puerro sirve para preparar caldo.', '韭葱可以用来熬汤。', 'noun'),
      w('berenjena', '茄子', 'Compré una berenjena grande.', '我买了一个大茄子。', 'noun'),
      w('calabacín', '西葫芦', 'El calabacín está de oferta.', '西葫芦正在打折。', 'noun'),
      w('col', '卷心菜；甘蓝', 'Necesitamos media col para la receta.', '这道菜需要半颗卷心菜。', 'noun'),
      w('seta', '食用菌；蘑菇', 'Estas setas son de temporada.', '这些蘑菇正当季。', 'noun'),
      w('champiñón', '双孢蘑菇；口蘑', 'Limpia los champiñones antes de cortarlos.', '切之前把口蘑清洗干净。', 'noun'),
      w('tofu', '豆腐', 'El tofu está en la zona refrigerada.', '豆腐在冷藏区。', 'noun', life),
      w('cerdo', '猪；猪肉', 'Busco carne de cerdo para guisar.', '我在找适合炖煮的猪肉。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-meat-a2', level: 'A2', scene: '购物', kind: '单词',
    title: '肉类与常用部位', description: '在冷柜或肉铺辨认家庭烹饪需要的肉和部位',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('ternera', '小牛肉；牛肉', 'La ternera está en la carnicería.', '牛肉在肉铺柜台。', 'noun'),
      w('panceta', '五花肉；培根肉', 'Quiero una pieza de panceta fresca.', '我想要一块新鲜五花肉。', 'noun', life, '不同地区和切法也可能标作 barriga de cerdo'),
      w('costilla', '肋排；肋骨', 'Las costillas son para cocinar al horno.', '这些排骨是用来烤的。', 'noun'),
      w('pechuga', '胸肉；鸡胸', 'Compré pechuga de pollo.', '我买了鸡胸肉。', 'noun'),
      w('muslo', '腿；鸡腿', 'Necesito cuatro muslos de pollo.', '我需要四只鸡腿。', 'noun'),
      w('contramuslo', '鸡上腿；大腿肉', 'El contramuslo queda jugoso al horno.', '鸡上腿烤出来很多汁。', 'noun', life),
      w('filete', '肉片；鱼片；排', 'Corte el filete un poco más fino.', '请把肉片切薄一点。', 'noun'),
      w('gamba', '虾', 'Las gambas están en la pescadería.', '虾在鱼鲜柜台。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-fish-a2', level: 'A2', scene: '购物', kind: '单词',
    title: '鱼鲜柜台与调味', description: '辨认常见海鲜并说明去刺、去鳞等处理需求',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('calamar', '鱿鱼；枪乌贼', 'El calamar puede venderse entero o en anillas.', '鱿鱼可以整只或切圈出售。', 'noun'),
      w('mejillón', '贻贝；青口', 'Compré un kilo de mejillones.', '我买了一公斤青口。', 'noun'),
      w('lubina', '欧洲海鲈', 'La lubina está fresca hoy.', '今天的欧洲海鲈很新鲜。', 'noun', life),
      w('dorada', '金头鲷', 'Quiero una dorada para el horno.', '我想要一条金头鲷用来烤。', 'noun', life),
      w('espina', '鱼刺；刺', '¿Puede quitar las espinas?', '可以把鱼刺去掉吗？', 'noun'),
      w('escama', '鱼鳞；鳞片', 'El pescadero quita las escamas.', '鱼贩把鱼鳞去掉。', 'noun'),
      w('chile', '辣椒', 'Este chile tiene un sabor muy fuerte.', '这种辣椒味道很强烈。', 'noun'),
      w('guindilla', '小辣椒；辣椒', 'Añade una guindilla al aceite.', '在油里加入一根小辣椒。', 'noun', life),
    ],
  },
  {
    id: 'vida-supermarket-household-a2', level: 'A2', scene: '日常', kind: '单词',
    title: '清洁与家庭用品', description: '购买洗涤、消毒和厨房清洁用品',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('sésamo', '芝麻', 'El pan lleva semillas de sésamo.', '这个面包上有芝麻。', 'noun', life),
      w('detergente', '洗涤剂；洗衣液', 'Necesito detergente para la ropa.', '我需要洗衣液。', 'noun'),
      w('lavavajillas', '洗碗液；洗碗机', 'Este lavavajillas sirve para lavar a mano.', '这种洗碗液适合手洗。', 'noun'),
      w('lejía', '漂白剂；含氯消毒剂', 'No mezcles la lejía con otros productos.', '不要把漂白剂与其他产品混合。', 'noun'),
      w('desinfectante', '消毒剂', 'Compré un desinfectante para el baño.', '我买了一瓶浴室消毒剂。', 'noun'),
      w('estropajo', '百洁布；清洁海绵', 'Cambia el estropajo de la cocina.', '更换厨房百洁布。', 'noun'),
      w('bayeta', '清洁布；抹布', 'Usa una bayeta limpia para la mesa.', '用一块干净抹布擦桌子。', 'noun'),
      w('guante', '手套', 'Ponte guantes para limpiar.', '清洁时戴上手套。', 'noun', dual, '商品包装和实际使用中通常出现复数 guantes'),
    ],
  },
  {
    id: 'vida-supermarket-counter-phrases-a1', level: 'A1', scene: '购物', kind: '短语',
    title: '称重与柜台要求', description: '直接表达购买数量、处理方式和商品选择',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'free', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('a granel', '散装；按散装出售', 'Los frutos secos se venden a granel.', '坚果按散装出售。', undefined),
      w('sin gluten', '无麸质', 'Busco pan sin gluten.', '我在找无麸质面包。', undefined),
      w('carne picada', '肉馅；绞肉', 'Quiero medio kilo de carne picada.', '我想要半公斤肉馅。', undefined),
      w('medio kilo', '半公斤', 'Deme medio kilo de tomates.', '请给我半公斤西红柿。', undefined),
      w('por unidad', '按个；按件', 'Este producto se vende por unidad.', '这个商品按件出售。', undefined),
      w('sin espinas', '去鱼刺的；无刺', 'Quiero el pescado sin espinas.', '我想要去掉鱼刺的鱼。', undefined),
      w('sin piel', '去皮的；无皮', 'Prefiero la pechuga sin piel.', '我更喜欢去皮鸡胸肉。', undefined),
      w('más fresco', '更新鲜的', '¿Cuál de los dos está más fresco?', '这两个哪个更新鲜？', undefined),
    ],
  },
  {
    id: 'vida-supermarket-chinese-pantry-a2', level: 'A2', scene: '餐厅', kind: '短语',
    title: '华人厨房常见食材', description: '在普通或亚洲超市辨认中式烹饪高概率使用的商品',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('col china', '大白菜；中国白菜', 'La col china está junto a las verduras.', '大白菜在蔬菜旁边。', undefined, life),
      w('pak choi', '小白菜；青江菜', 'El pak choi se vende en paquetes pequeños.', '青江菜以小包装出售。', undefined, life, '商品标签也可能写 bok choy'),
      w('brotes de soja', '豆芽；大豆芽', 'Añade brotes de soja al final.', '最后加入豆芽。', undefined, life),
      w('salsa de soja', '酱油', 'Esta salsa de soja contiene menos sal.', '这款酱油含盐量较低。', undefined, life),
      w('vinagre de arroz', '米醋', 'Necesito vinagre de arroz para la salsa.', '我做酱汁需要米醋。', undefined, life),
      w('aceite de sésamo', '香油；芝麻油', 'Añade unas gotas de aceite de sésamo.', '加入几滴香油。', undefined, life),
      w('salsa de ostras', '蚝油', 'La salsa de ostras está en la sección asiática.', '蚝油在亚洲食品区。', undefined, life),
      w('pimienta de Sichuan', '花椒；四川花椒', 'Busco pimienta de Sichuan para este plato.', '我在找做这道菜用的花椒。', undefined, life),
    ],
  },
  {
    id: 'vida-supermarket-pantry-household-a2', level: 'A2', scene: '日常', kind: '短语',
    title: '香料、保鲜与纸品', description: '补齐中式香料和家庭日常消耗品的包装名称',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('anís estrellado', '八角；星形茴香', 'El paquete contiene anís estrellado.', '这包里是八角。', undefined, life),
      w('cinco especias', '五香粉；五种香料', 'Uso cinco especias para marinar la carne.', '我用五香粉腌肉。', undefined, life),
      w('almidón de maíz', '玉米淀粉', 'Necesito almidón de maíz para espesar la salsa.', '我需要玉米淀粉来勾芡。', undefined, life, 'Maicena 是常见品牌名，不作为通用目标'),
      w('papel higiénico', '卫生纸', 'El papel higiénico está en el último pasillo.', '卫生纸在最后一条通道。', undefined),
      w('papel de cocina', '厨房纸', 'Compra un rollo de papel de cocina.', '买一卷厨房纸。', undefined),
      w('bolsa de basura', '垃圾袋', 'Necesitamos una bolsa de basura resistente.', '我们需要一个结实的垃圾袋。', undefined),
      w('film transparente', '保鲜膜', 'Cubre el recipiente con film transparente.', '用保鲜膜盖住容器。', undefined),
      w('papel de aluminio', '铝箔；锡纸', 'Envuelve el pescado en papel de aluminio.', '用铝箔把鱼包起来。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-produce-02-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '常买蔬菜', description: '覆盖做饭最常遇到的根茎、叶菜和配菜',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('tomate', '西红柿；番茄', 'Los tomates se venden por kilo.', '西红柿按公斤出售。', 'noun'),
      w('patata', '土豆；马铃薯', 'Necesito una bolsa de patatas.', '我需要一袋土豆。', 'noun'),
      w('cebolla', '洋葱', 'Compra dos cebollas grandes.', '买两个大洋葱。', 'noun'),
      w('zanahoria', '胡萝卜', 'Las zanahorias están junto a las patatas.', '胡萝卜在土豆旁边。', 'noun'),
      w('pepino', '黄瓜', 'Este pepino está firme y fresco.', '这根黄瓜很结实新鲜。', 'noun'),
      w('pimiento', '甜椒；辣椒', 'Quiero un pimiento rojo.', '我想要一个红甜椒。', 'noun'),
      w('brócoli', '西兰花', 'El brócoli está en la zona de verduras.', '西兰花在蔬菜区。', 'noun'),
      w('espinaca', '菠菜', 'La espinaca viene en una bolsa.', '菠菜装在袋子里。', 'noun'),
      w('lechuga', '生菜；莴苣', 'Elige una lechuga fresca.', '选一颗新鲜生菜。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-fruit-02-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '水果与配菜', description: '辨认水果区和冷藏蔬菜区的常见商品',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('guisante', '豌豆', 'Los guisantes congelados están en este arcón.', '冷冻豌豆在这个冷柜里。', 'noun'),
      w('maíz', '玉米', 'Necesito una lata de maíz.', '我需要一罐玉米。', 'noun'),
      w('aguacate', '牛油果；鳄梨', 'Este aguacate todavía está duro.', '这个牛油果还很硬。', 'noun'),
      w('pera', '梨', 'Las peras están maduras.', '这些梨已经熟了。', 'noun'),
      w('plátano', '香蕉', 'Quiero seis plátanos.', '我想要六根香蕉。', 'noun'),
      w('fresa', '草莓', 'La bandeja de fresas está de oferta.', '这盒草莓正在打折。', 'noun'),
      w('uva', '葡萄', 'Las uvas se venden en bandejas.', '葡萄以盒装出售。', 'noun'),
      w('sandía', '西瓜', '¿Puede cortar la sandía por la mitad?', '可以把西瓜切成两半吗？', 'noun'),
      w('melón', '甜瓜；蜜瓜', 'Este melón pesa dos kilos.', '这个甜瓜重两公斤。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-staples-02-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '主食、豆类与早餐', description: '购买面食、豆类、谷物和乳制早餐',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('mandarina', '橘子；柑橘', 'Las mandarinas son fáciles de pelar.', '橘子很容易剥皮。', 'noun'),
      w('pasta', '意大利面；面食', 'La pasta está en el pasillo cinco.', '意大利面在第五条通道。', 'noun'),
      w('fideo', '面条；细面', 'Busco fideos finos para la sopa.', '我在找煮汤用的细面。', 'noun'),
      w('lenteja', '小扁豆；兵豆', 'Las lentejas secas están junto al arroz.', '干小扁豆在大米旁边。', 'noun'),
      w('garbanzo', '鹰嘴豆', 'Compré un tarro de garbanzos cocidos.', '我买了一罐煮熟的鹰嘴豆。', 'noun'),
      w('avena', '燕麦', 'La avena sirve para preparar el desayuno.', '燕麦可以用来做早餐。', 'noun'),
      w('cereal', '谷物；早餐麦片', 'Este cereal contiene poco azúcar.', '这种早餐麦片含糖量较低。', 'noun'),
      w('yogur', '酸奶', 'Los yogures están en la nevera.', '酸奶在冷藏柜里。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-dairy-protein-02-a2', level: 'A2', scene: '餐厅', kind: '单词',
    title: '乳制品、肉类与鱼类', description: '补齐家庭一周采购中的蛋白质和烹饪原料',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('legumbre', '豆类；豆科食物', 'Las legumbres pueden comprarse secas o cocidas.', '豆类可以买干货或熟制品。', 'noun'),
      w('judía', '豆；菜豆', 'Necesito judías para el guiso.', '我炖菜需要菜豆。', 'noun'),
      w('mantequilla', '黄油', 'La mantequilla está junto al queso.', '黄油在奶酪旁边。', 'noun'),
      w('nata', '奶油；鲜奶油', 'Quiero nata para cocinar.', '我想要烹饪用奶油。', 'noun'),
      w('jamón', '火腿', 'Corte el jamón en lonchas finas.', '请把火腿切成薄片。', 'noun'),
      w('embutido', '香肠及腌制肉制品', 'Los embutidos están en la charcutería.', '香肠和腌肉在熟食柜台。', 'noun'),
      w('atún', '金枪鱼', 'Compré dos latas de atún.', '我买了两罐金枪鱼。', 'noun'),
      w('salmón', '三文鱼；鲑鱼', 'El salmón se vende en filetes.', '三文鱼以鱼排形式出售。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-service-household-02-a2', level: 'A2', scene: '购物', kind: '单词',
    title: '售后状态与清洁用品', description: '理解缺货、退货以及洗衣和地面清洁商品',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('porción', '一份；食用份量', 'La etiqueta indica el tamaño de la porción.', '标签标明了每份大小。', 'noun'),
      w('devolución', '退货；归还', 'La devolución se tramita con el recibo.', '凭收据办理退货。', 'noun'),
      w('reembolso', '退款', 'El reembolso llegará a la misma tarjeta.', '退款会退回原银行卡。', 'noun'),
      w('agotado', '售罄的；缺货的', 'Este producto está agotado.', '这个商品缺货了。', 'adjective'),
      w('rebajado', '降价的；打折的', 'El yogur está rebajado porque caduca pronto.', '酸奶因为临近保质期而降价。', 'adjective'),
      w('suavizante', '衣物柔顺剂', 'El suavizante está junto al detergente.', '衣物柔顺剂在洗衣液旁边。', 'noun'),
      w('quitamanchas', '去渍剂', 'Necesito un quitamanchas para ropa blanca.', '我需要白色衣物用去渍剂。', 'noun'),
      w('fregasuelos', '地板清洁剂', 'Este fregasuelos sirve para baldosas.', '这种地板清洁剂适用于瓷砖。', 'noun'),
      w('limpiador', '清洁剂；清洁用品', 'Busco un limpiador para la cocina.', '我在找厨房清洁剂。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-personal-care-02-a2', level: 'A2', scene: '日常', kind: '单词',
    title: '纸品与个人护理', description: '购买卫生间、洗护和婴幼儿常见消耗品',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('papelera', '垃圾桶；废纸篓', 'Necesito una papelera pequeña para el baño.', '我需要一个浴室用小垃圾桶。', 'noun'),
      w('servilleta', '餐巾纸；餐巾', 'Compra un paquete de servilletas.', '买一包餐巾纸。', 'noun'),
      w('pañuelo', '纸巾；手帕', 'Los pañuelos están junto al papel higiénico.', '纸巾在卫生纸旁边。', 'noun'),
      w('jabón', '肥皂；洗手液', 'Quiero jabón para las manos.', '我想要洗手用的肥皂。', 'noun'),
      w('champú', '洗发水', 'Este champú es para cabello seco.', '这款洗发水适合干性头发。', 'noun'),
      w('desodorante', '除臭剂；止汗香体剂', 'El desodorante está en higiene personal.', '止汗香体剂在个人护理区。', 'noun'),
      w('compresa', '卫生巾；敷布', 'Las compresas están en este pasillo.', '卫生巾在这条通道。', 'noun'),
      w('tampón', '卫生棉条', 'Busco tampones sin aplicador.', '我在找不带导管的卫生棉条。', 'noun'),
      w('pañal', '尿布；纸尿裤', 'Necesitamos pañales de la talla tres.', '我们需要三号纸尿裤。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-actions-02-a2', level: 'A2', scene: '购物', kind: '动词原形',
    title: '称重、结账与售后动作', description: '在自助秤、收银台和退换货流程中使用的动词',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('pesar', '称重', 'Hay que pesar la fruta antes de pagar.', '付款前需要给水果称重。', 'verb'),
      w('devolver', '退还；退货', 'Quiero devolver este producto.', '我想退掉这个商品。', 'verb'),
      w('escanear', '扫描', 'Escanee el código de barras.', '请扫描条形码。', 'verb'),
      w('cobrar', '收费；收款', 'Me cobraron dos veces el mismo producto.', '同一件商品被收了两次钱。', 'verb'),
      w('reembolsar', '退款；偿还', 'La tienda puede reembolsar el importe.', '商店可以退还款项。', 'verb'),
      w('envolver', '包裹；包装', '¿Puede envolver el pescado por separado?', '可以把鱼单独包装吗？', 'verb'),
      w('cortar', '切；切开', '¿Puede cortar la carne en tiras?', '可以把肉切成条吗？', 'verb'),
      w('trocear', '切块；分割', 'Pida que le troceen el pollo.', '可以请柜台把鸡切块。', 'verb'),
    ],
  },
  {
    id: 'vida-supermarket-food-types-02-a2', level: 'A2', scene: '餐厅', kind: '短语',
    title: '食品规格与替代选择', description: '区分奶类、米面和常见加工规格',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('judía verde', '四季豆；青豆角', 'Las judías verdes están en la zona refrigerada.', '四季豆在冷藏区。', undefined),
      w('pan rallado', '面包糠', 'Necesito pan rallado para empanar.', '我需要面包糠来裹粉。', undefined),
      w('arroz integral', '糙米', 'El arroz integral tarda más en cocerse.', '糙米煮制时间更长。', undefined),
      w('leche entera', '全脂牛奶', 'Compro leche entera para cocinar.', '我买全脂牛奶做饭。', undefined),
      w('leche semidesnatada', '半脱脂牛奶', 'La leche semidesnatada lleva tapón azul.', '这款半脱脂牛奶使用蓝色瓶盖。', undefined),
      w('leche desnatada', '脱脂牛奶', 'Busco leche desnatada sin lactosa.', '我在找无乳糖脱脂牛奶。', undefined),
      w('leche de coco', '椰奶', 'La leche de coco está en la sección internacional.', '椰奶在国际食品区。', undefined),
      w('bebida de soja', '豆奶；大豆植物饮料', 'Esta bebida de soja no lleva azúcar añadido.', '这款豆奶没有添加糖。', undefined),
      w('fideos de arroz', '米粉；米线', 'Los fideos de arroz se cuecen muy rápido.', '米粉很快就能煮熟。', undefined, life),
    ],
  },
  {
    id: 'vida-supermarket-label-reading-02-b1', level: 'B1', scene: '购物', kind: '短语',
    title: '营养标签与产地', description: '看懂包装上依法常见的数量、营养和来源信息',
    lifeModule: 'supermarket', lifeTier: 'L3', access: 'paid', frameworkReference: B1_B2_PCIC, source,
    words: [
      w('cantidad neta', '净含量', 'La cantidad neta es de quinientos gramos.', '净含量为五百克。', undefined),
      w('consumo preferente', '最佳食用期；建议食用期限', 'Comprueba la fecha de consumo preferente.', '检查最佳食用期。', undefined),
      w('país de origen', '原产国', 'El país de origen aparece en la etiqueta.', '原产国显示在标签上。', undefined),
      w('información nutricional', '营养信息', 'La información nutricional se indica por cien gramos.', '营养信息按每一百克标示。', undefined),
      w('valor energético', '能量值；热量值', 'El valor energético aparece en kilojulios y kilocalorías.', '能量值以千焦和千卡标示。', undefined),
      w('hidratos de carbono', '碳水化合物', 'La tabla indica los hidratos de carbono.', '表格标明了碳水化合物含量。', undefined),
      w('grasas saturadas', '饱和脂肪', 'Compara la cantidad de grasas saturadas.', '比较饱和脂肪含量。', undefined),
      w('fibra alimentaria', '膳食纤维', 'Este cereal contiene fibra alimentaria.', '这种麦片含有膳食纤维。', undefined),
      w('sin lactosa', '无乳糖', 'Necesito leche sin lactosa.', '我需要无乳糖牛奶。', undefined),
      w('bajo en sal', '低盐的', 'Busco un caldo bajo en sal.', '我在找低盐高汤。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-checkout-02-a2', level: 'A2', scene: '购物', kind: '短语',
    title: '收银、自提与日期', description: '理解自助结账、会员卡、取货和保质期提示',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('fecha de caducidad', '保质期限；失效日期', 'La fecha de caducidad es mañana.', '保质期到明天。', undefined),
      w('caja automática', '自助收银台', 'La caja automática acepta tarjeta.', '自助收银台接受刷卡。', undefined),
      w('código de barras', '条形码', 'El código de barras no se puede leer.', '条形码无法读取。', undefined),
      w('tique de compra', '购物小票', 'Guarde el tique de compra para la devolución.', '保留购物小票以便退货。', undefined, dual, '也常写作 ticket；本卡使用西语规范拼写 tique'),
      w('tarjeta de fidelización', '会员卡；积分卡', 'Pase la tarjeta de fidelización antes de pagar.', '付款前刷会员卡。', undefined),
      w('punto de recogida', '取货点；自提点', 'El pedido espera en el punto de recogida.', '订单在自提点等待领取。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-asian-pantry-02-a2', level: 'A2', scene: '餐厅', kind: '短语',
    title: '亚洲食品区扩充', description: '补齐华人家庭做饭时高概率寻找的米面、豆制品和调料',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('alga nori', '海苔；紫菜片', 'El alga nori está junto al arroz para sushi.', '海苔在寿司米旁边。', undefined, life),
      w('seta shiitake', '香菇；椎茸', 'Las setas shiitake también se venden secas.', '香菇也有干货出售。', undefined, life),
      w('brotes de bambú', '竹笋', 'Compré un tarro de brotes de bambú.', '我买了一罐竹笋。', undefined, life),
      w('salsa picante', '辣酱', 'Esta salsa picante contiene chile y ajo.', '这款辣酱含辣椒和大蒜。', undefined),
      w('pasta de curry', '咖喱酱；咖喱膏', 'La pasta de curry está en la sección asiática.', '咖喱膏在亚洲食品区。', undefined, life),
      w('arroz jazmín', '茉莉香米', 'El arroz jazmín viene en bolsas grandes.', '茉莉香米有大袋包装。', undefined, life),
      w('arroz glutinoso', '糯米', 'Busco arroz glutinoso para este postre.', '我在找做这个甜点用的糯米。', undefined, life),
      w('judía mungo', '绿豆', 'La judía mungo se vende seca.', '绿豆以干货形式出售。', undefined, life),
      w('harina de arroz', '米粉；大米粉', 'Necesito harina de arroz para la masa.', '我做面糊需要大米粉。', undefined, life),
      w('almidón de patata', '马铃薯淀粉', 'El almidón de patata sirve para espesar.', '马铃薯淀粉可以用于勾芡。', undefined, life),
      w('tofu firme', '老豆腐；硬豆腐', 'El tofu firme mantiene mejor la forma.', '硬豆腐更容易保持形状。', undefined, life),
      w('tofu sedoso', '嫩豆腐；绢豆腐', 'El tofu sedoso tiene una textura suave.', '嫩豆腐口感柔滑。', undefined, life),
    ],
  },
  {
    id: 'vida-supermarket-personal-phrases-02-a2', level: 'A2', scene: '日常', kind: '短语',
    title: '口腔、洗护与随身用品', description: '识别个人护理货架上的常见包装名称',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('cepillo de dientes', '牙刷', 'Necesito un cepillo de dientes suave.', '我需要一把软毛牙刷。', undefined),
      w('pasta de dientes', '牙膏', 'La pasta de dientes está en el pasillo de higiene.', '牙膏在个人护理通道。', undefined),
      w('gel de ducha', '沐浴露', 'Este gel de ducha no tiene perfume.', '这款沐浴露没有香味。', undefined),
      w('hilo dental', '牙线', 'El hilo dental está junto a los cepillos.', '牙线在牙刷旁边。', undefined),
      w('crema de manos', '护手霜', 'Busco crema de manos para piel seca.', '我在找适合干燥皮肤的护手霜。', undefined),
      w('protector solar', '防晒霜；防晒用品', 'Necesitamos protector solar para los niños.', '我们需要儿童用防晒霜。', undefined),
      w('toallita húmeda', '湿巾', 'Compra un paquete de toallitas húmedas.', '买一包湿巾。', undefined),
      w('pañuelo de papel', '面巾纸；纸手帕', 'Los pañuelos de papel están junto al papel higiénico.', '面巾纸在卫生纸旁边。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-counters-03-a1', level: 'A1', scene: '购物', kind: '单词',
    title: '柜台与冷藏区域', description: '找到肉铺、鱼铺、熟食、烘焙和冷冻冷藏区域',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('mostrador', '柜台；展示台', 'Pregunte en el mostrador de información.', '请在服务台询问。', 'noun'),
      w('carnicería', '肉铺；肉类柜台', 'La carnicería está al fondo.', '肉类柜台在最里面。', 'noun'),
      w('pescadería', '鱼铺；鱼鲜柜台', 'La pescadería cierra a las ocho.', '鱼鲜柜台八点关闭。', 'noun'),
      w('charcutería', '熟食及腌肉柜台', 'El jamón se corta en la charcutería.', '火腿在熟食柜台切片。', 'noun'),
      w('panadería', '面包店；烘焙区', 'El pan recién hecho está en la panadería.', '刚出炉的面包在烘焙区。', 'noun'),
      w('frutería', '果蔬店；果蔬区', 'La frutería está junto a la entrada.', '果蔬区在入口旁边。', 'noun'),
      w('congelador', '冷冻柜；冰柜', 'Los guisantes están en el congelador.', '豌豆在冷冻柜里。', 'noun'),
      w('nevera', '冰箱；冷藏柜', 'El tofu está en la nevera.', '豆腐在冷藏柜里。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-label-terms-03-b1', level: 'B1', scene: '购物', kind: '单词',
    title: '配料表进阶术语', description: '识别来源、添加剂、过敏风险和易腐食品描述',
    lifeModule: 'supermarket', lifeTier: 'L3', access: 'paid', frameworkReference: B1_B2_PCIC, source,
    words: [
      w('procedencia', '来源；产地', 'La etiqueta indica la procedencia del pescado.', '标签标明了鱼的产地。', 'noun'),
      w('aditivo', '食品添加剂；添加物', 'Cada aditivo aparece en la lista de ingredientes.', '每种添加剂都列在配料表中。', 'noun'),
      w('conservante', '防腐剂', 'Este producto no contiene conservantes.', '这个产品不含防腐剂。', 'noun'),
      w('colorante', '着色剂；色素', 'La bebida lleva un colorante natural.', '这款饮料含天然色素。', 'noun'),
      w('traza', '微量残留；痕量', 'Puede contener trazas de frutos secos.', '可能含有微量坚果成分。', 'noun'),
      w('intolerancia', '不耐受；不耐症', 'Revise los ingredientes si tiene una intolerancia.', '如有不耐受，请检查配料。', 'noun'),
      w('escurrido', '沥干的；净沥干的', 'La lata indica el peso escurrido.', '罐头标明了沥干重量。', 'adjective'),
      w('perecedero', '易腐的；不耐保存的', 'La carne fresca es un alimento perecedero.', '鲜肉是易腐食品。', 'adjective'),
    ],
  },
  {
    id: 'vida-supermarket-loyalty-delivery-03-b1', level: 'B1', scene: '购物', kind: '单词',
    title: '会员、补货与配送问题', description: '处理优惠券、缺货替换、取货和订单异常',
    lifeModule: 'supermarket', lifeTier: 'L3', access: 'paid', frameworkReference: B1_B2_PCIC, source,
    words: [
      w('cupón', '优惠券', 'Aplique el cupón antes de pagar.', '付款前使用优惠券。', 'noun'),
      w('fidelización', '会员维系；忠诚计划', 'La aplicación incluye un programa de fidelización.', '这个应用包含会员积分计划。', 'noun'),
      w('sustitución', '替换；替代商品', 'No acepto la sustitución de este producto.', '我不接受替换这个商品。', 'noun'),
      w('recogida', '领取；自提', 'La recogida del pedido es a partir de las seis.', '订单六点以后可以自提。', 'noun'),
      w('franja', '时段；条带', 'Elija una franja de entrega.', '请选择配送时段。', 'noun'),
      w('reposición', '补货；重新上架', 'El producto está pendiente de reposición.', '这个商品正在等待补货。', 'noun'),
      w('incidencia', '异常；问题记录', 'He comunicado una incidencia con el pedido.', '我报告了订单异常。', 'noun'),
      w('datáfono', '刷卡终端；银行卡机', 'Acerque la tarjeta al datáfono.', '请把银行卡靠近刷卡终端。', 'noun'),
    ],
  },
  {
    id: 'vida-supermarket-asian-sauces-03-a2', level: 'A2', scene: '餐厅', kind: '单词',
    title: '亚洲食品区名称', description: '识别亚洲超市和国际食品区常见的调味与即食商品',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('mirin', '味醂；日式甜料酒', 'El mirin está junto a la salsa de soja.', '味醂在酱油旁边。', 'noun', life),
      w('miso', '味噌', 'Necesito miso para preparar sopa.', '我需要味噌来做汤。', 'noun', life),
      w('kimchi', '韩式泡菜', 'El kimchi se conserva refrigerado.', '韩式泡菜需要冷藏。', 'noun', life),
      w('edamame', '毛豆', 'El edamame suele venderse congelado.', '毛豆通常以冷冻形式出售。', 'noun', life),
      w('gochujang', '韩式辣椒酱', 'El gochujang está en la sección coreana.', '韩式辣椒酱在韩国食品区。', 'noun', life),
      w('panko', '日式面包糠', 'El panko queda más crujiente al freír.', '日式面包糠炸后更酥脆。', 'noun', life),
      w('hoisin', '海鲜酱；甜面酱风味酱', 'La salsa hoisin tiene un sabor dulce y salado.', '海鲜酱带甜咸风味。', 'noun', life),
      w('dashi', '日式高汤；出汁', 'El dashi puede venderse en polvo.', '日式高汤也有粉末包装。', 'noun', life),
    ],
  },
  {
    id: 'vida-supermarket-label-instructions-03-b1', level: 'B1', scene: '购物', kind: '短语',
    title: '包装上的保存提示', description: '看懂过敏原、开封后保存和即食说明',
    lifeModule: 'supermarket', lifeTier: 'L3', access: 'paid', frameworkReference: B1_B2_PCIC, source,
    words: [
      w('sin azúcar añadido', '无添加糖', 'El zumo indica sin azúcar añadido.', '果汁标明无添加糖。', undefined),
      w('puede contener trazas', '可能含有微量成分', 'La etiqueta dice puede contener trazas de frutos secos.', '标签写着可能含有微量坚果成分。', undefined),
      w('mantener refrigerado', '保持冷藏', 'El envase indica mantener refrigerado.', '包装标明需要保持冷藏。', undefined),
      w('una vez abierto', '开封后', 'Una vez abierto, consúmalo en tres días.', '开封后三天内食用。', undefined),
      w('listo para comer', '开袋即食；可直接食用', 'Este producto está listo para comer.', '这个产品可以直接食用。', undefined),
      w('peso neto escurrido', '沥干净重', 'El peso neto escurrido aparece bajo la cantidad neta.', '沥干净重显示在净含量下方。', undefined),
      w('conservar en frío', '冷藏保存', 'Hay que conservar en frío este alimento.', '这种食品需要冷藏保存。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-counter-requests-03-a2', level: 'A2', scene: '购物', kind: '短语',
    title: '鱼肉柜台处理要求', description: '说明去鳞去内脏、切片切块和购买人数',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', frameworkReference: A1_A2_PCIC, source,
    words: [
      w('quitar las escamas', '去鱼鳞', '¿Puede quitar las escamas?', '可以去掉鱼鳞吗？', undefined),
      w('quitar las vísceras', '去内脏', '¿Puede quitar las vísceras?', '可以去掉内脏吗？', undefined),
      w('cortar en rodajas', '切成圆片', '¿Puede cortar el pescado en rodajas?', '可以把鱼切成片吗？', undefined),
      w('cortar en filetes', '切成鱼排；切片', '¿Puede cortar el salmón en filetes?', '可以把三文鱼切成鱼排吗？', undefined),
      w('cortar en trozos', '切成块', '¿Puede cortar el pollo en trozos?', '可以把鸡切成块吗？', undefined),
      w('así está bien', '这样就可以', 'Gracias, así está bien.', '谢谢，这样就可以。', undefined),
      w('para cuatro personas', '四人份', 'Necesito pescado para cuatro personas.', '我需要四人份的鱼。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-checkout-problems-03-b1', level: 'B1', scene: '购物', kind: '短语',
    title: '付款、退货与订单异常', description: '处理非接触支付、价格错误、重复扣款和配送缺漏',
    lifeModule: 'supermarket', lifeTier: 'L3', access: 'paid', frameworkReference: B1_B2_PCIC, source,
    words: [
      w('pago sin contacto', '非接触式支付', 'El terminal permite pago sin contacto.', '这台终端支持非接触式支付。', undefined),
      w('saldo de puntos', '积分余额', 'Consulte el saldo de puntos en la aplicación.', '在应用中查看积分余额。', undefined),
      w('precio incorrecto', '价格错误', 'El recibo muestra un precio incorrecto.', '收据显示了错误价格。', undefined),
      w('doble cobro', '重复扣款；重复收费', 'Quiero reclamar un doble cobro.', '我想投诉重复扣款。', undefined),
      w('plazo de devolución', '退货期限', 'El plazo de devolución termina mañana.', '退货期限明天结束。', undefined),
      w('entrega a domicilio', '送货上门', 'La entrega a domicilio cuesta tres euros.', '送货上门费用是三欧元。', undefined),
      w('pedido incompleto', '订单缺件；订单不完整', 'He recibido un pedido incompleto.', '我收到的订单缺少商品。', undefined),
    ],
  },
  {
    id: 'vida-supermarket-pantry-basics-04-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '基础调味与烹饪辅料', description: '补齐西班牙超市最常见的醋、香辛料、蜂蜜、酵母和高汤',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', reviewKey: 'vida-supermarket-gap-editorial-004', frameworkReference: A1_A2_PCIC, source,
    words: [
      n('vinagre', '醋', 'el', 'Necesito vinagre para aliñar la ensalada.', '我需要醋来拌沙拉。'),
      n('pimienta negra', '黑胡椒', 'la', 'Busco pimienta negra molida.', '我在找黑胡椒粉。'),
      n('comino', '孜然；小茴香籽', 'el', 'El comino está en el pasillo de las especias.', '孜然在香料货架通道。'),
      n('perejil', '欧芹；荷兰芹', 'el', 'Quiero perejil fresco para la sopa.', '我想要做汤用的新鲜欧芹。'),
      n('laurel', '月桂叶；香叶', 'el', 'Añade una hoja de laurel al guiso.', '炖菜里加一片香叶。'),
      n('miel', '蜂蜜', 'la', 'La miel está junto a la mermelada.', '蜂蜜在果酱旁边。'),
      n('levadura', '酵母', 'la', 'Necesito levadura para hacer pan.', '我需要酵母来做面包。'),
      n('caldo', '高汤；汤底', 'el', 'Este caldo de pollo lleva poca sal.', '这款鸡汤底含盐较少。'),
    ],
  },
  {
    id: 'vida-supermarket-produce-gap-04-a1', level: 'A1', scene: '餐厅', kind: '单词',
    title: '常买果蔬与食品', description: '补齐家庭做饭和早餐零食中高频出现的蔬菜、饮料与食品',
    lifeModule: 'supermarket', lifeTier: 'L1', access: 'paid', reviewKey: 'vida-supermarket-gap-editorial-004', frameworkReference: A1_A2_PCIC, source,
    words: [
      n('coliflor', '花椰菜；菜花', 'la', 'La coliflor está junto al brócoli.', '花椰菜在西兰花旁边。'),
      n('apio', '芹菜', 'el', 'Necesito apio para preparar el caldo.', '我需要芹菜来熬汤。'),
      n('calabaza', '南瓜', 'la', 'Quiero un trozo de calabaza.', '我想要一块南瓜。'),
      n('boniato', '红薯；甘薯', 'el', 'El boniato se vende por kilo.', '红薯按公斤出售。'),
      n('acelga', '牛皮菜；莙荙菜', 'la', 'Las acelgas frescas están en la frutería.', '新鲜牛皮菜在果蔬区。'),
      n('salchicha', '香肠；肉肠', 'la', 'Estas salchichas necesitan refrigeración.', '这些香肠需要冷藏。'),
      n('zumo', '果汁', 'el', 'Busco zumo de naranja sin azúcar añadido.', '我在找无添加糖的橙汁。'),
      n('galleta', '饼干', 'la', 'Quiero unas galletas para el desayuno.', '我想买些早餐吃的饼干。'),
    ],
  },
  {
    id: 'vida-supermarket-chinese-pantry-04-a2', level: 'A2', scene: '餐厅', kind: '单词',
    title: '华人厨房调味补缺', description: '识别亚洲食品区常见的面食、烹饪酒、醋、酱料与油',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', reviewKey: 'vida-supermarket-gap-editorial-004', frameworkReference: A1_A2_PCIC, source,
    words: [
      n('fideos de trigo', '小麦面条', 'los', 'Busco fideos de trigo para saltear.', '我在找适合炒制的小麦面条。', life),
      n('vinagre negro', '黑醋；陈醋类黑醋', 'el', 'El vinagre negro está junto al vinagre de arroz.', '黑醋在米醋旁边。', life),
      n('vino de arroz', '米酒；烹饪米酒', 'el', 'Necesito vino de arroz para cocinar.', '我需要烹饪用米酒。', life, '购物时核对标签：不同产品可能是烹饪酒、清酒或其他米酿酒，酒精度和用途并不相同。'),
      n('salsa de pescado', '鱼露', 'la', 'La salsa de pescado está en la sección asiática.', '鱼露在亚洲食品区。', life),
      n('aceite de cacahuete', '花生油', 'el', 'Busco aceite de cacahuete para cocinar.', '我在找烹饪用花生油。', life),
      n('pasta de soja', '豆酱；发酵豆酱', 'la', 'Esta pasta de soja es fermentada.', '这款豆酱经过发酵。', life, '这是货架通用识别词；味噌、黄豆酱和韩式大酱的配料与风味不同。'),
      n('pasta de sésamo', '芝麻酱', 'la', 'La pasta de sésamo está junto a las salsas.', '芝麻酱在各类酱料旁边。', life),
      n('aceite de chile', '辣椒油；红油', 'el', 'Este aceite de chile es muy picante.', '这款辣椒油很辣。', life),
    ],
  },
  {
    id: 'vida-supermarket-household-gap-04-a2', level: 'A2', scene: '购物', kind: '单词',
    title: '厨房耗材与个人护理', description: '补齐烘焙、冷冻收纳、洗碗和日常洗护用品的货架名称',
    lifeModule: 'supermarket', lifeTier: 'L2', access: 'paid', reviewKey: 'vida-supermarket-gap-editorial-004', frameworkReference: A1_A2_PCIC, source,
    words: [
      n('papel de horno', '烘焙纸；烤箱纸', 'el', 'El papel de horno está junto al papel de aluminio.', '烘焙纸在铝箔纸旁边。'),
      n('bolsa de congelación', '冷冻保鲜袋', 'la', 'Necesito una bolsa de congelación con cierre.', '我需要一个带封口的冷冻保鲜袋。'),
      n('cápsula de lavavajillas', '洗碗机胶囊', 'la', 'Compro cápsulas de lavavajillas todo en uno.', '我买多效合一的洗碗机胶囊。'),
      n('acondicionador', '护发素', 'el', 'El acondicionador está al lado del champú.', '护发素在洗发水旁边。'),
      n('enjuague bucal', '漱口水', 'el', 'Busco un enjuague bucal sin alcohol.', '我在找不含酒精的漱口水。'),
      n('bastoncillo de algodón', '棉签', 'el', 'Necesito una caja de bastoncillos de algodón.', '我需要一盒棉签。'),
      n('maquinilla de afeitar', '剃须刀', 'la', 'Las maquinillas de afeitar están en higiene personal.', '剃须刀在个人护理区。'),
      n('crema corporal', '身体乳；身体霜', 'la', 'Quiero una crema corporal para piel seca.', '我想要一款适合干性皮肤的身体乳。'),
    ],
  },
]
