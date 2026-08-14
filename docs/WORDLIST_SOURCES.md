# 词库来源与制作计划

## 当前版本的真实状态

`src/data.ts` 中现有 18 个 A1 词条由项目开发阶段人工编写，用于验证交互、重音、冠词、短语空格和听写流程。

这些内容：

- 不是从 Qwerty Learner 词库复制；
- 不是从 RAE、教材或商业词典摘录；
- 尚未经过西语教师或专业语言编辑逐条审核；
- 只能标记为“演示词库”，不能作为正式完整 A1 课程发布。

## 正式词库拟采用的来源

### 1. 词形、词性、变位和发音信息

优先使用 Wiktionary 的结构化提取数据（Wiktextract / Kaikki）。数据需要保留来源条目、提取日期和 CC BY-SA 许可信息。

用途：

- 校验西语拼写与重音；
- 区分词性；
- 获取名词性别和常见变位；
- 筛选可用的发音文件。

### 2. 西语例句及中西翻译配对

候选来源为 Tatoeba 下载数据。Tatoeba 文本下载默认以 CC BY 2.0 FR 发布，但必须逐句保留作者和句子 ID，不能只在应用底部笼统写一次来源。

用途：

- 筛选短、自然、适合 A1-A2 的真实句子；
- 构建西语—中文配对；
- 生成逐句 attribution 清单。

Tatoeba 自身不保证所有句子或翻译经过专业审核，因此导入后仍需人工复核。

### 3. 难度与教学顺序

不直接复制受版权保护的教材词表。项目自行建立分级规则：

- 沟通场景：问候、身份、家庭、饮食、交通、购物、时间等；
- 语法负担：名词性别、规则动词、常用不规则动词、代词与介词；
- 拼写训练价值：重音、`ñ`、`ü`、`j/g`、`b/v`、`ll/y` 等；
- 词频与现实使用价值；
- 每组 8–12 个词或短语，避免孤立堆词。

## 每个正式词条必须保留的字段

```ts
{
  spanish: string
  chinese: string
  article?: string
  partOfSpeech: string
  example: string
  exampleChinese: string
  level: 'A1' | 'A2' | 'B1' | 'B2'
  source: {
    spelling: string
    example?: string
    license: string
    attribution?: string
  }
  reviewedBy?: string
  reviewedAt?: string
}
```

## 发布门槛

一个词库只有同时满足以下条件才能从“候选”改成“正式”：

1. 拼写、重音、词性和性别校验通过；
2. 中文释义符合具体语境，不是机器翻译堆砌；
3. 例句自然且适合标注等级；
4. 来源、许可和 attribution 可追踪；
5. 至少一名具备西语能力的人逐条复核。
