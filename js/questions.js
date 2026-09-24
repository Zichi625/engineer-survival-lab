export const QUESTIONS = [
  {
    id: 'role',
    level: 1,
    type: 'single',
    visualStyle: 'cards',
    characterMood: 'default',
    prompt: '選擇你的工程師角色！',
    options: [
      { value: 'frontend', label: '前端', emoji: '🎨' },
      { value: 'backend', label: '後端', emoji: '⚙️' },
      { value: 'fullstack', label: '全端', emoji: '🧩' },
      { value: 'app', label: 'App', emoji: '📱' },
      { value: 'ai', label: 'AI', emoji: '🤖', personaPoints: { aiEvolved: 1 } },
      { value: 'data', label: 'Data', emoji: '📊' },
      { value: 'devops', label: 'DevOps', emoji: '🛠️' },
      { value: 'other', label: '其他', emoji: '✨' }
    ]
  },
  {
    id: 'experience',
    level: 2,
    type: 'single',
    visualStyle: 'expBar',
    characterMood: 'default',
    fillProgressive: true,
    prompt: '你在工程師世界生存多久了？',
    options: [
      { value: 'lt1', label: '未滿1年', emoji: '🌱', personaPoints: { careerDebugger: 1 } },
      { value: '1to3', label: '1–3年', emoji: '🌿', personaPoints: { careerDebugger: 1 } },
      { value: '3to5', label: '3–5年', emoji: '🌳', personaPoints: { radarWatcher: 1 } },
      { value: '5to10', label: '5–10年', emoji: '🌲', personaPoints: { stableGrowth: 1 } },
      { value: 'gt10', label: '10年以上', emoji: '🏔️', personaPoints: { stableGrowth: 2 } }
    ]
  },
  {
    id: 'satisfaction',
    level: 3,
    type: 'single',
    visualStyle: 'mood',
    characterMood: 'default',
    prompt: '現在這份工作，你還好嗎？',
    options: [
      { value: 'great', label: '很滿意', emoji: '😄', personaPoints: { stableGrowth: 2 }, dimensionValues: { salary: 5, stability: 5 } },
      { value: 'good', label: '滿意', emoji: '🙂', personaPoints: { stableGrowth: 1 }, dimensionValues: { salary: 4, stability: 4 } },
      { value: 'ok', label: '普通', emoji: '😐', personaPoints: { radarWatcher: 1 }, dimensionValues: { salary: 3, stability: 3 } },
      { value: 'bad', label: '不太好', emoji: '😣', personaPoints: { careerDebugger: 1, jobHopper: 1 }, dimensionValues: { salary: 2, stability: 2 } },
      { value: 'terrible', label: '我快不行了', emoji: '🥵', personaPoints: { jobHopper: 2, careerDebugger: 1 }, dimensionValues: { salary: 1, stability: 1 } }
    ]
  },
  {
    id: 'salary',
    level: 4,
    type: 'single',
    visualStyle: 'coins',
    characterMood: 'default',
    prompt: '目前薪資落在哪個補給區？',
    options: [
      { value: 'under40', label: '<40K', emoji: '🪙', personaPoints: { careerDebugger: 2 }, dimensionValues: { salary: 1 } },
      { value: '40to60', label: '40–60K', emoji: '🪙', personaPoints: { careerDebugger: 1 }, dimensionValues: { salary: 2 } },
      { value: '60to80', label: '60–80K', emoji: '🪙', personaPoints: { radarWatcher: 1 }, dimensionValues: { salary: 3 } },
      { value: '80to100', label: '80–100K', emoji: '🪙', personaPoints: { stableGrowth: 1 }, dimensionValues: { salary: 4 } },
      { value: 'over100', label: '100K+', emoji: '🪙', personaPoints: { stableGrowth: 1 }, dimensionValues: { salary: 5 } },
      { value: 'secret', label: '秘密', emoji: '🤐', personaPoints: { radarWatcher: 1 }, dimensionValues: { salary: 3 } }
    ]
  },
  {
    id: 'headhunterReaction',
    level: 5,
    type: 'single',
    visualStyle: 'comic',
    characterMood: 'default',
    prompt: '現在有人敲你 LinkedIn，你會？',
    options: [
      { value: 'ignore', label: '不理', emoji: '🙅', personaPoints: { stableGrowth: 2 }, dimensionValues: { stability: 5, radar: 1 } },
      { value: 'peek', label: '看看', emoji: '👀', personaPoints: { radarWatcher: 2 }, dimensionValues: { stability: 4, radar: 3 } },
      { value: 'chat', label: '聊聊', emoji: '💬', personaPoints: { radarWatcher: 1, jobHopper: 1 }, dimensionValues: { stability: 2, radar: 4 } },
      { value: 'please', label: '拜託快找我', emoji: '🙏', personaPoints: { jobHopper: 2 }, dimensionValues: { stability: 1, radar: 5 } }
    ]
  },
  {
    id: 'jumpThreshold',
    level: 6,
    type: 'single',
    visualStyle: 'chips',
    characterMood: 'default',
    prompt: 'Boss 出多少，你願意跳槽？',
    options: [
      { value: 'noRaise', label: '不加也走😂', emoji: '🪙', personaPoints: { jobHopper: 2 }, dimensionValues: { radar: 5 } },
      { value: 'plus10', label: '+10%', emoji: '🪙', personaPoints: { jobHopper: 1, radarWatcher: 1 }, dimensionValues: { radar: 4 } },
      { value: 'plus20', label: '+20%', emoji: '🪙', personaPoints: { radarWatcher: 1 }, dimensionValues: { radar: 3 } },
      { value: 'plus30', label: '+30%', emoji: '🪙', personaPoints: { stableGrowth: 1 }, dimensionValues: { radar: 2 } },
      { value: 'workMatters', label: '工作好比較重要', emoji: '💼', personaPoints: { stableGrowth: 2 }, dimensionValues: { radar: 1 } }
    ]
  },
  {
    id: 'careerBug',
    level: 7,
    type: 'single',
    visualStyle: 'bugs',
    characterMood: 'sweat',
    prompt: '抓到你的 Career Bug！',
    options: [
      { value: 'salary', label: '薪資卡住', emoji: '🐛', personaPoints: { careerDebugger: 2 } },
      { value: 'boss', label: '主管問題', emoji: '🐛', personaPoints: { careerDebugger: 2 } },
      { value: 'hours', label: '工時太長', emoji: '🐛', personaPoints: { careerDebugger: 1, jobHopper: 1 } },
      { value: 'skill', label: '技術焦慮', emoji: '🐛', personaPoints: { careerDebugger: 1, aiEvolved: -1 } },
      { value: 'promotion', label: '升遷卡關', emoji: '🐛', personaPoints: { careerDebugger: 1, radarWatcher: 1 } },
      { value: 'noOpportunity', label: '沒好機會', emoji: '🐛', personaPoints: { jobHopper: 1, careerDebugger: 1 } },
      { value: 'aiAnxiety', label: 'AI焦慮', emoji: '🐛', personaPoints: { careerDebugger: 2, aiEvolved: -2 } }
    ]
  },
  {
    id: 'aiFrequency',
    level: 8,
    type: 'single',
    visualStyle: 'robot',
    characterMood: 'robot',
    prompt: 'AI 已經進入你的工作了嗎？',
    options: [
      { value: 'daily', label: '每天', emoji: '🤖', personaPoints: { aiEvolved: 2 }, dimensionValues: { aiAdapt: 5 }, buffLabel: '重度 AI 工具使用者' },
      { value: 'sometimes', label: '偶爾', emoji: '🤖', personaPoints: { aiEvolved: 1 }, dimensionValues: { aiAdapt: 4 }, buffLabel: 'AI 輕度使用者' },
      { value: 'learning', label: '正在學', emoji: '🤖', personaPoints: { aiEvolved: 1 }, dimensionValues: { aiAdapt: 3 }, buffLabel: 'AI 學習中' },
      { value: 'rarely', label: '幾乎不用', emoji: '🤖', personaPoints: { careerDebugger: 1 }, dimensionValues: { aiAdapt: 2 }, buffLabel: 'AI 觀望者' },
      { value: 'notAllowed', label: '公司不給用', emoji: '🤖', personaPoints: { careerDebugger: 1 }, dimensionValues: { aiAdapt: 1 }, buffLabel: 'AI 待解鎖' }
    ]
  },
  {
    id: 'aiTools',
    level: 9,
    type: 'multi',
    visualStyle: 'gear',
    characterMood: 'robot',
    prompt: '你現在最常用哪個 AI Coding 夥伴？',
    options: [
      { value: 'chatgpt', label: 'ChatGPT', emoji: '💬', personaPoints: { aiEvolved: 1 } },
      { value: 'claude', label: 'Claude', emoji: '🟣', personaPoints: { aiEvolved: 1 } },
      { value: 'cursor', label: 'Cursor', emoji: '⌨️', personaPoints: { aiEvolved: 1 } },
      { value: 'copilot', label: 'Copilot', emoji: '🧑‍✈️', personaPoints: { aiEvolved: 1 } },
      { value: 'gemini', label: 'Gemini', emoji: '♊', personaPoints: { aiEvolved: 1 } },
      { value: 'other', label: '其他', emoji: '✨', personaPoints: { aiEvolved: 1 } },
      { value: 'none', label: '沒使用', emoji: '🚫', personaPoints: { careerDebugger: 1, aiEvolved: -1 } }
    ]
  },
  {
    id: 'aiImpact',
    level: 10,
    type: 'single',
    visualStyle: 'scenario',
    characterMood: 'robot',
    prompt: 'AI 讓你最有感的是？',
    options: [
      { value: 'faster', label: '開發變快', emoji: '⚡', personaPoints: { aiEvolved: 2 }, dimensionValues: { aiAdapt: 5 } },
      { value: 'learning', label: '學習變快', emoji: '📚', personaPoints: { aiEvolved: 2 }, dimensionValues: { aiAdapt: 5 } },
      { value: 'changed', label: '工作內容改變', emoji: '🔄', personaPoints: { aiEvolved: 1, radarWatcher: 1 }, dimensionValues: { aiAdapt: 4 } },
      { value: 'worried', label: '開始擔心被取代', emoji: '😰', personaPoints: { careerDebugger: 2, aiEvolved: -1 }, dimensionValues: { aiAdapt: 2 } },
      { value: 'noDiff', label: '沒什麼差', emoji: '🤷', personaPoints: { stableGrowth: 1 }, dimensionValues: { aiAdapt: 3 } }
    ]
  },
  {
    id: 'aiFear',
    level: 11,
    type: 'single',
    visualStyle: 'monster',
    characterMood: 'robot',
    prompt: 'AI 時代，你最怕哪件事？',
    options: [
      { value: 'skillGap', label: '技術跟不上', emoji: '👹', personaPoints: { careerDebugger: 1, aiEvolved: -1 } },
      { value: 'juniorOpportunity', label: 'Junior機會減少', emoji: '👹', personaPoints: { careerDebugger: 1 } },
      { value: 'salaryPressure', label: '薪資被壓縮', emoji: '👹', personaPoints: { careerDebugger: 1, jobHopper: 1 } },
      { value: 'workloadSurge', label: '公司要求產能暴增', emoji: '👹', personaPoints: { careerDebugger: 1, jobHopper: 1 } },
      { value: 'notScared', label: '其實不怕', emoji: '💪', personaPoints: { aiEvolved: 2, stableGrowth: 1 } }
    ]
  },
  {
    id: 'goal2027',
    level: 12,
    type: 'single',
    visualStyle: 'badge',
    characterMood: 'happy',
    prompt: '2027 你最想解鎖什麼成就？',
    options: [
      { value: 'raise', label: '加薪', emoji: '💰', personaPoints: { careerDebugger: 1 } },
      { value: 'switchJob', label: '跳槽', emoji: '🚪', personaPoints: { jobHopper: 2 } },
      { value: 'senior', label: '升Senior', emoji: '⭐', personaPoints: { radarWatcher: 1 } },
      { value: 'foreign', label: '進外商', emoji: '🌍', personaPoints: { radarWatcher: 1, jobHopper: 1 } },
      { value: 'remote', label: '全遠端', emoji: '🏡', personaPoints: { stableGrowth: 1 } },
      { value: 'switchToAI', label: '轉AI', emoji: '🤖', personaPoints: { aiEvolved: 2 } },
      { value: 'wlb', label: 'Work-Life Balance', emoji: '⚖️', personaPoints: { stableGrowth: 1, careerDebugger: 1 } }
    ]
  }
];
