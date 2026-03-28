import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as path from 'path';

// 数据源配置
const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  database: path.join(__dirname, 'clawcms.db'),
  entities: [path.join(__dirname, 'src/entities/*.entity.{ts,js}')],
  synchronize: false,
});

async function init() {
  await AppDataSource.initialize();
  console.log('数据库连接成功');

  // 1. 创建管理员
  const passwordHash = await bcrypt.hash('Admin@123456', 10);
  
  await AppDataSource.query(`
    INSERT INTO users (id, username, email, passwordHash, role, isActive, avatar, createdAt, updatedAt)
    VALUES (
      'admin-001',
      'admin',
      'admin@clawcms.ai',
      ?,
      'admin',
      1,
      'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      datetime('now'),
      datetime('now')
    )
  `, [passwordHash]);
  console.log('✅ 管理员创建成功: admin / Admin@123456');

  // 2. 创建板块
  const sections = [
    { id: 'sec-001', name: '政策法规', slug: 'policy', description: '体育旅游政策法规解读', color: '#3B82F6', icon: 'DocumentTextIcon' },
    { id: 'sec-002', name: '地方实践', slug: 'practice', description: '各地体育旅游发展实践案例', color: '#10B981', icon: 'MapIcon' },
    { id: 'sec-003', name: '赛事活动', slug: 'events', description: '体育赛事与旅游活动资讯', color: '#F59E0B', icon: 'TrophyIcon' },
    { id: 'sec-004', name: '产业数据', slug: 'data', description: '体育旅游产业数据分析', color: '#8B5CF6', icon: 'ChartBarIcon' },
    { id: 'sec-005', name: '精品线路', slug: 'routes', description: '体育旅游精品线路推荐', color: '#EC4899', icon: 'RouteIcon' },
    { id: 'sec-006', name: '行业动态', slug: 'news', description: '体育旅游行业最新动态', color: '#06B6D4', icon: 'NewspaperIcon' },
  ];

  for (const sec of sections) {
    await AppDataSource.query(`
      INSERT INTO sections (id, name, slug, description, color, icon, sortOrder, isActive, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 0, 1, datetime('now'), datetime('now'))
    `, [sec.id, sec.name, sec.slug, sec.description, sec.color, sec.icon]);
  }
  console.log('✅ 板块创建成功: 6个');

  // 3. 创建分类
  const categories = [
    { id: 'cat-001', name: '政策解读', slug: 'policy-interpretation', sectionId: 'sec-001' },
    { id: 'cat-002', name: '法律法规', slug: 'laws', sectionId: 'sec-001' },
    { id: 'cat-003', name: '成功案例', slug: 'success-cases', sectionId: 'sec-002' },
    { id: 'cat-004', name: '创新模式', slug: 'innovation', sectionId: 'sec-002' },
    { id: 'cat-005', name: '马拉松', slug: 'marathon', sectionId: 'sec-003' },
    { id: 'cat-006', name: '骑行赛事', slug: 'cycling', sectionId: 'sec-003' },
    { id: 'cat-007', name: '市场报告', slug: 'market-reports', sectionId: 'sec-004' },
    { id: 'cat-008', name: '统计数据', slug: 'statistics', sectionId: 'sec-004' },
  ];

  for (const cat of categories) {
    await AppDataSource.query(`
      INSERT INTO categories (id, name, slug, sectionId, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [cat.id, cat.name, cat.slug, cat.sectionId]);
  }
  console.log('✅ 分类创建成功: 8个');

  // 4. 创建文章
  const posts = [
    {
      id: 'post-001',
      title: '国务院发布《关于促进体育旅游融合发展的指导意见》',
      slug: 'state-council-sports-tourism-guidance',
      excerpt: '国务院办公厅印发指导意见，明确提出到2030年建成布局合理、功能完善、门类齐全的体育旅游产业体系。',
      content: `# 国务院发布《关于促进体育旅游融合发展的指导意见》

## 政策背景

为深入贯彻落实党中央、国务院关于促进体育产业和旅游业发展的决策部署，加快推进体育旅游融合发展，国务院办公厅近日印发《关于促进体育旅游融合发展的指导意见》。

## 主要目标

- **到2025年**：体育旅游产业体系初步建立，体育旅游市场规模达到1.2万亿元
- **到2030年**：建成布局合理、功能完善、门类齐全的体育旅游产业体系，培育一批具有国际影响力的体育旅游目的地

## 重点任务

### 1. 优化体育旅游空间布局
- 建设一批国家体育旅游示范基地
- 打造一批体育旅游精品线路
- 培育一批体育旅游精品赛事

### 2. 丰富体育旅游产品供给
- 发展山地户外运动旅游
- 发展水上运动旅游
- 发展冰雪运动旅游
- 发展航空运动旅游

### 3. 完善体育旅游基础设施
- 加强体育旅游交通设施建设
- 完善体育旅游公共服务体系
- 推进体育旅游信息化建设`,
      sectionId: 'sec-001',
      categoryId: 'cat-001',
      featuredImage: 'https://images.unsplash.com/photo-1461896836934- voices-5d4d?w=800',
      status: 'published',
      viewCount: 1256,
    },
    {
      id: 'post-002',
      title: '浙江省打造"运动浙江"体育旅游品牌成效显著',
      slug: 'zhejiang-sports-tourism-brand',
      excerpt: '浙江省通过打造"运动浙江"品牌，成功创建国家级体育旅游示范基地3个，年接待体育旅游游客超过5000万人次。',
      content: `# 浙江省打造"运动浙江"体育旅游品牌成效显著

## 成效亮点

浙江省深入贯彻体育旅游融合发展理念，成功打造"运动浙江"体育旅游品牌，取得显著成效：

### 基地建设
- 国家级体育旅游示范基地：3个
- 省级体育旅游示范基地：15个
- 体育旅游精品线路：28条

### 市场规模
- 年接待体育旅游游客：超过5000万人次
- 体育旅游年收入：突破300亿元
- 带动就业人数：超过10万人

## 典型案例

### 千岛湖运动休闲小镇
千岛湖依托优质水资源，发展水上运动、骑行、徒步等体育旅游项目，年接待游客超过200万人次。

### 安吉云上草原
打造高山户外运动综合体，涵盖滑翔伞、悬崖秋千、高山滑雪等项目，成为网红打卡地。`,
      sectionId: 'sec-002',
      categoryId: 'cat-003',
      featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      status: 'published',
      viewCount: 892,
    },
    {
      id: 'post-003',
      title: '2026年全国马拉松赛事日历发布，超300场赛事等你挑战',
      slug: '2026-marathon-calendar',
      excerpt: '中国田径协会发布2026年全国马拉松赛事日历，全年计划举办超过300场马拉松赛事，覆盖全国所有省份。',
      content: `# 2026年全国马拉松赛事日历发布

## 赛事概览

中国田径协会正式发布2026年全国马拉松赛事日历，全年计划举办：

- **全程马拉松**：120场
- **半程马拉松**：180场
- **其他路跑赛事**：超过50场

## 重点赛事推荐

### 3月
- 3月15日：无锡马拉松（世界田联金标赛事）
- 3月22日：重庆马拉松

### 4月
- 4月12日：武汉马拉松
- 4月19日：上海半程马拉松

### 10月
- 10月18日：北京马拉松（预计）
- 10月25日：成都马拉松

### 11月
- 11月1日：杭州马拉松
- 11月8日：南京马拉松

### 12月
- 12月6日：广州马拉松
- 12月13日：深圳马拉松

## 报名提示

建议跑者提前关注赛事官网，合理规划参赛计划。部分热门赛事采用抽签制，建议多选择几场作为备选。`,
      sectionId: 'sec-003',
      categoryId: 'cat-005',
      featuredImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
      status: 'published',
      viewCount: 2341,
    },
    {
      id: 'post-004',
      title: '2025年中国体育旅游市场规模达1.2万亿元，增长18%',
      slug: '2025-sports-tourism-market-report',
      excerpt: '最新市场研究报告显示，2025年中国体育旅游市场规模达到1.2万亿元，同比增长18%，预计2030年将突破2.5万亿元。',
      content: `# 2025年中国体育旅游市场报告

## 市场规模

| 年份 | 市场规模 | 增长率 |
|------|----------|--------|
| 2023年 | 8,000亿 | 15% |
| 2024年 | 10,000亿 | 25% |
| 2025年 | 12,000亿 | 18% |
| 2030年(预测) | 25,000亿 | 12% |

## 细分市场

### 按类型划分
- 观赛旅游：2,400亿（20%）
- 参赛旅游：4,800亿（40%）
- 运动休闲旅游：4,800亿（40%）

### 按项目划分
- 马拉松/路跑：3,000亿
- 滑雪运动：2,400亿
- 水上运动：1,800亿
- 户外运动：2,400亿
- 其他：2,400亿

## 发展趋势

1. **政策持续利好**：国家和地方政策密集出台
2. **消费升级明显**：从观赛向参赛转变
3. **技术赋能深化**：VR/AR、智能穿戴普及
4. **业态融合加速**：体育+旅游+文化融合`,
      sectionId: 'sec-004',
      categoryId: 'cat-007',
      featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      status: 'published',
      viewCount: 1567,
    },
    {
      id: 'post-005',
      title: '云南香格里拉高原徒步线路入选全国十佳体育旅游精品线路',
      slug: 'shangri-la-hiking-route-top10',
      excerpt: '国家体育总局、文化和旅游部联合发布2025年全国十佳体育旅游精品线路，云南香格里拉高原徒步线路成功入选。',
      content: `# 香格里拉高原徒步线路入选全国十佳

## 线路简介

**香格里拉高原徒步线路**全长约120公里，平均海拔3500米，串联普达措国家公园、梅里雪山、虎跳峡等著名景点。

### 线路特色
- 高原风光：雪山、草甸、湖泊
- 民族文化：藏族风情、宗教文化
- 生态体验：原始森林、珍稀动植物

### 推荐行程（5天4夜）

**Day 1**: 香格里拉市区 - 普达措国家公园
- 徒步距离：15公里
- 海拔：3200m - 3600m

**Day 2**: 普达措 - 白水台
- 徒步距离：20公里
- 海拔：3600m - 3800m

**Day 3**: 白水台 - 虎跳峡
- 徒步距离：25公里
- 海拔：3800m - 1800m（下坡）

**Day 4**: 虎跳峡徒步
- 徒步距离：18公里
- 海拔：1800m - 2600m

**Day 5**: 返回香格里拉
- 徒步距离：10公里
- 海拔：2600m - 3200m

## 最佳季节

- **推荐**：4月-6月，9月-11月
- **避开**：7月-8月（雨季），12月-3月（严寒）

## 装备建议

- 高原徒步鞋、冲锋衣
- 防晒霜、墨镜、帽子
- 登山杖、头灯
- 氧气瓶（备用）`,
      sectionId: 'sec-005',
      categoryId: 'cat-008',
      featuredImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      status: 'published',
      viewCount: 3456,
    },
    {
      id: 'post-006',
      title: '体育总局：推动体育旅游高质量发展，助力体育强国建设',
      slug: 'sports-bureau-high-quality-development',
      excerpt: '国家体育总局召开全国体育旅游工作会议，强调要推动体育旅游高质量发展，为体育强国建设贡献力量。',
      content: `# 体育总局召开全国体育旅游工作会议

## 会议要点

国家体育总局局长在会上强调：

### 发展目标
1. 到2025年，体育旅游产业增加值占体育产业比重达到15%
2. 到2030年，培育100个国家级体育旅游示范基地
3. 打造1000条体育旅游精品线路

### 重点举措

**一、完善顶层设计**
- 编制全国体育旅游发展规划
- 建立体育旅游标准体系
- 完善体育旅游统计制度

**二、加强基地建设**
- 国家级基地：100个
- 省级基地：500个
- 市级基地：1000个

**三、丰富产品供给**
- 打造品牌赛事
- 开发精品线路
- 创新业态模式

**四、强化人才培养**
- 专业人才培训
- 职业技能认证
- 国际交流合作`,
      sectionId: 'sec-006',
      categoryId: 'cat-006',
      featuredImage: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800',
      status: 'published',
      viewCount: 789,
    },
  ];

  for (const post of posts) {
    await AppDataSource.query(`
      INSERT INTO posts (
        id, title, slug, excerpt, content, sectionId, categoryId, 
        featuredImage, status, viewCount, authorId, isFeatured,
        createdAt, updatedAt, publishedAt
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'admin-001', 1, datetime('now'), datetime('now'), datetime('now'))
    `, [post.id, post.title, post.slug, post.excerpt, post.content, post.sectionId, post.categoryId, post.featuredImage, post.status, post.viewCount]);
  }
  console.log('✅ 文章创建成功: 6篇');

  // 5. 创建标签
  const tags = [
    { id: 'tag-001', name: '政策', slug: 'policy' },
    { id: 'tag-002', name: '马拉松', slug: 'marathon' },
    { id: 'tag-003', name: '徒步', slug: 'hiking' },
    { id: 'tag-004', name: '市场分析', slug: 'market-analysis' },
    { id: 'tag-005', name: '精品线路', slug: 'premium-routes' },
  ];

  for (const tag of tags) {
    await AppDataSource.query(`
      INSERT INTO tags (id, name, slug, createdAt, updatedAt)
      VALUES (?, ?, ?, datetime('now'), datetime('now'))
    `, [tag.id, tag.name, tag.slug]);
  }
  console.log('✅ 标签创建成功: 5个');

  console.log('\n🎉 初始化完成！');
  console.log('📌 登录账号: admin');
  console.log('📌 登录密码: Admin@123456');

  await AppDataSource.destroy();
}

init().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});
