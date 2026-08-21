# Vida 城市出行词库 V1

核对日期：2026-08-21。该模块面向在西班牙生活或旅行的中文使用者，目标是完成问路、乘车、换乘、机场和行程异常处理，不是驾驶、交通法规或旅客权利建议。

## 当前结果

当前模块共 140 个输入目标，全部复用现有 canonical 卡，没有新建重复词条。目录审计发现 `calle`、`ciudad`、常见城市地点、基础方位和出入口等 20 个 A1 目标仍只在考试路线，因此定向补入：

`estación`、`billete`、`andén` 和 `equipaje` 现在统一复用裸词形 canonical 卡；`la / el` 作为名词属性展示，历史 `la estación`、`el billete` 等学习卡 ID 会重定向到同一份看义、听写与错题证据。

- 68 项来自既有基础、城市、新居民与词频扩库课程，其中包含本轮 20 项 A1 城市／方向补缺；
- 72 项来自已经完成官方用语核对的考试路线出行补缺批次；
- 免费体验 24 项，覆盖方向、车站、票、站台、行李和基础城市交通；
- 标记为未来付费内容 116 项，覆盖基础城市地点、方向、城市设施、票种换乘、机场、道路异常、无障碍和旅客申诉；
- L1 60 项、L2 48 项、L3 32 项；
- 140 项全部同时属于 `exam` 路线，从任一路线取得的有效看义或听写证据都复用同一卡片。

生活路线现在不是把考试词库复制一遍：`src/vidaMobility.ts` 只保存模块 placement，即模块、生活等级和访问边界；西语目标、中文释义、例句、来源、课程 ID 与学习证据仍来自统一 canonical 目录。

## 任务范围

### L1：完成最小出行

- `todo recto`、`a la derecha`、`a la izquierda` 等基础方向；
- 街道、广场、市中心、商店、市场、银行、医院、药店和学校；
- 左右、前后、内外、远近、道路、入口和出口；
- 车站、票、站台、行李和往返；
- 公交、站点、自行车、道路、路口和常见城市地标；
- 认识信号灯、人行道、环岛、车道、堵车和停车位置。

### L2：独立规划和换乘

- 近郊、公共交通、生活成本、学校与医疗设施；
- 司机、乘客、寄存、售票、值机和城市交通工具；
- 单程票、交通通票、高峰期、区域列车和近郊列车；
- 旅游咨询、步行区、历史城区和人行横道；
- 取消、延误、改道、罢工、上下机和基础道路救援。

### L3：处理异常与权利问题

- 高速道路、路肩、道路标识、拖车、海关和事故报告；
- 随身行李、行李遗失、登机口、安检和航班延误；
- 补偿、改签安置、无障碍、拥堵和交通违法；
- 可持续出行、服务中断、通行限制、投诉表和旅客权利。

## 免费与付费边界

免费 24 项让用户完成一次最小的“找到方向—到达车站—识别票和站台—乘坐常见交通工具”任务。其余 116 项先标记为付费内容，覆盖更完整的城市辨认、换乘、机场、异常处理和申诉能力；本轮 20 项全部留在付费侧，没有静默扩大免费边界。

`access: paid` 仍只是目录元数据；项目尚未上线支付功能，也没有验证用户是否愿意为这一模块付费。商业化前应以真实出行任务完成率、重复使用和付费意向为依据，而不是把词条数量当成价值证明。

## 来源与限制

- 等级和出行领域参考 [PCIC A1–A2](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_a1-a2.htm) 与 [B1–B2](https://cvc.cervantes.es/ensenanza/biblioteca_ele/plan_curricular/niveles/09_nociones_especificas_inventario_b1-b2.htm)，不是官方逐词认证。
- 机场任务用语通过 [Aena 安全检查](https://www.aena.es/es/pasajeros/equipajes-controles/control-seguridad.html) 与出发区页面核对。
- 铁路延误、取消和旅客服务语境通过 [Renfe Viajeros 一般运输条件](https://www.renfe.com/es/es/ayuda/informacion-legal-viajeros/condiciones-generales/condiciones-generales-renfe-viajeros)核对。
- 道路安全用语通过 [DGT 违法与处罚说明](https://www.dgt.es/nuestros-servicios/multas-y-sanciones/conoce-los-tipos-de-infracciones-y-sanciones/)核对。
- 可持续与无障碍出行用语通过[西班牙交通部](https://www.transportes.gob.es/transporte-terrestre/movilidad/movilidad-sostenible)核对。

模块仍缺少具名西语教师逐条复核和真实用户任务测试。地区交通系统的票名、通票和服务规则会变化；卡片只教语言，不承诺某项票务、赔偿或道路规则适用于所有地点和时间。
