import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ReactECharts from 'echarts-for-react'

// API 基础 URL，优先使用环境变量，否则使用默认值
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await axios.get(`${API_BASE_URL}/api/orders`)
      setOrders(res.data || [])
    } catch (err) {
      console.error('获取订单失败:', err)
      setError('无法连接到服务器，请确保后端服务已启动')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async () => {
    try {
      // 如果后端有 POST 接口，可以这样调用：
      // await axios.post(`${API_BASE_URL}/api/orders`, { client_name: '新客户', status: '进行中' })
      // fetchOrders() // 刷新列表
      console.log('创建新订单')
    } catch (err) {
      console.error('创建订单失败:', err)
    }
  }

  const stats = useMemo(() => {
    const total = orders.length
    const ongoing = orders.filter((o) => o.status === '进行中').length
    const completed = orders.filter((o) => o.status === '已完成').length
    const cancelled = orders.filter((o) => o.status === '已取消').length
    return { total, ongoing, completed, cancelled }
  }, [orders])

  // 折线图配置
  const lineChartOption = {
    color: ['#3b82f6', '#14b8a6'],
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#e2e8f0',
      textStyle: { color: '#334155' },
    },
    grid: { top: 30, right: 20, bottom: 20, left: 40, containLabel: true },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#64748b' },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#64748b' },
    },
    series: [
      {
        name: '北京厂',
        type: 'line',
        smooth: true,
        data: [120, 132, 101, 134, 90, 230, 210],
        areaStyle: { opacity: 0.1 },
      },
      {
        name: '苏州厂',
        type: 'line',
        smooth: true,
        data: [220, 182, 191, 234, 290, 330, 310],
        areaStyle: { opacity: 0.1 },
      },
    ],
  }

  // 雷达图配置
  const radarChartOption = {
    radar: {
      indicator: [
        { name: '产能', max: 100 },
        { name: '质量', max: 100 },
        { name: 'SLA', max: 100 },
        { name: '活跃度', max: 100 },
        { name: '设备', max: 100 },
      ],
      radius: '70%',
      axisName: { color: '#64748b', fontSize: 11, fontWeight: 'bold' },
      splitArea: { areaStyle: { color: ['#f8fafc', '#fff'] } },
      splitLine: { lineStyle: { color: '#e2e8f0' } },
    },
    series: [
      {
        name: '厂区评分',
        type: 'radar',
        data: [
          {
            value: [90, 98, 85, 95, 92],
            name: '北京厂',
            itemStyle: { color: '#3b82f6' },
            areaStyle: { opacity: 0.2 },
          },
          {
            value: [85, 90, 95, 80, 88],
            name: '苏州厂',
            itemStyle: { color: '#14b8a6' },
            areaStyle: { opacity: 0.2 },
          },
        ],
      },
    ],
  }

  return (
    <div className="flex h-screen overflow-hidden text-sm">
      {/* 侧边栏 */}
      <aside className="w-64 bg-[#0f172a] text-slate-400 flex flex-col shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0f172a]">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg shadow-blue-500/30">
            <i className="fa-solid fa-robot"></i>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">乐聚·大中台</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Training Hub</p>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
          <p className="px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">运营中心</p>
          <a href="#" className="nav-item active flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-chart-pie w-6 text-center"></i> <span className="ml-2">总览看板</span>
          </a>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-users w-6 text-center"></i> <span className="ml-2">客户管理</span>
          </a>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-file-invoice w-6 text-center"></i> <span className="ml-2">订单管理</span>
          </a>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-network-wired w-6 text-center"></i> <span className="ml-2">任务调度</span>
          </a>

          <p className="px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 mt-6">基础档案</p>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-sitemap w-6 text-center"></i> <span className="ml-2">厂区资源档案</span>
          </a>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-database w-6 text-center"></i> <span className="ml-2">数据资产库</span>
          </a>
          <a href="#" className="nav-item flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-id-card w-6 text-center"></i> <span className="ml-2">人员管理</span>
          </a>
          <a href="#" className="nav-item active flex items-center px-3 py-2.5 rounded-md">
            <i className="fa-solid fa-cubes-stacked w-6 text-center"></i> <span className="ml-2">场景与物料</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
          <div className="flex items-center gap-3 p-2 rounded-md">
            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">管理员</p>
              <p className="text-xs text-slate-500 truncate">总部调度中心</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 flex flex-col bg-[#f8fafc] overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center text-slate-500 text-sm">
            <span className="text-slate-400 mr-2">
              <i className="fa-solid fa-location-dot"></i>
            </span>
            <span className="font-semibold text-slate-800">总览看板 (Control Tower)</span>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              <span className="pulse-dot"></span>
              <span className="text-xs font-medium text-slate-600">全国节点在线</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <button className="relative text-slate-400 hover:text-blue-600">
              <i className="fa-regular fa-bell text-lg"></i>
            </button>
            <button
              onClick={handleCreateOrder}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              新建订单
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 relative scroll-smooth animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800">下午好，调度员</h2>
            <p className="text-slate-500 mt-1">这是今日全国训练厂的实时生产概况。</p>
          </div>

          {/* KPI 卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">今日数据产出</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">2,845</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-database"></i>
                </div>
              </div>
              <div className="flex items-center text-xs">
                <span className="text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                  <i className="fa-solid fa-arrow-trend-up"></i> +12.5%
                </span>
                <span className="text-slate-400 ml-2">较昨日</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">进行中任务</p>
                  <h3 className="text-3xl font-bold text-slate-800 mt-1">{stats.ongoing}</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-bars-progress"></i>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: stats.total ? `${Math.min((stats.ongoing / stats.total) * 100, 100)}%` : '0%' }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                产能负载 {stats.total ? Math.round((stats.ongoing / stats.total) * 100) : 0}%
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">SLA 风险预警</p>
                  <h3 className="text-3xl font-bold text-orange-600 mt-1">3</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                </div>
              </div>
              <p className="text-xs text-slate-500">3 个订单交付剩余 &lt; 24h</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">机器人在线率</p>
                  <h3 className="text-3xl font-bold text-emerald-600 mt-1">94%</h3>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                  <i className="fa-solid fa-robot"></i>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">85/90 台设备正常运行</p>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">全国数据产出趋势 (Data Trend)</h3>
                <select className="text-xs border-slate-200 rounded-md text-slate-500 bg-slate-50 p-1 outline-none">
                  <option>近7天</option>
                  <option>近30天</option>
                </select>
              </div>
              <ReactECharts option={lineChartOption} style={{ height: '288px', width: '100%' }} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="font-bold text-slate-700 mb-2">厂区综合健康度</h3>
              <ReactECharts option={radarChartOption} style={{ height: '224px', width: '100%' }} />
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> 北京厂
                  </span>
                  <span className="font-mono font-bold text-slate-700">98 分</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span> 苏州厂
                  </span>
                  <span className="font-mono font-bold text-slate-700">92 分</span>
                </div>
              </div>
            </div>
          </div>

          {/* 实时动态和任务流转 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">实时动态 (Live Feed)</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </div>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                <div className="flex gap-3 text-xs border-l-2 border-blue-500 pl-3 py-0.5">
                  <span className="text-slate-400 font-mono">14:42</span>
                  <span className="text-slate-600">
                    北京厂 - 工位 A01 上传 <span className="font-mono text-blue-600">bag_1092.bag</span> (1.2GB)
                  </span>
                </div>
                <div className="flex gap-3 text-xs border-l-2 border-transparent pl-3 py-0.5">
                  <span className="text-slate-400 font-mono">14:41</span>
                  <span className="text-slate-600">
                    苏州厂 - 任务 TSK-SZ-992 状态更新为{' '}
                    <span className="bg-yellow-100 text-yellow-700 px-1 rounded">审核中</span>
                  </span>
                </div>
                <div className="flex gap-3 text-xs border-l-2 border-transparent pl-3 py-0.5">
                  <span className="text-slate-400 font-mono">14:40</span>
                  <span className="text-slate-600">
                    系统 - 自动创建新工单：<span className="text-red-500">深度图缺失告警</span>
                  </span>
                </div>
                <div className="flex gap-3 text-xs border-l-2 border-transparent pl-3 py-0.5">
                  <span className="text-slate-400 font-mono">14:38</span>
                  <span className="text-slate-600">北京厂 - 机器人 Kuavo-V1-05 上线</span>
                </div>
                <div className="flex gap-3 text-xs border-l-2 border-transparent pl-3 py-0.5">
                  <span className="text-slate-400 font-mono">14:35</span>
                  <span className="text-slate-600">总部 - 接收新订单 ORD-20251204-03 (美团)</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-700 mb-6">任务流转漏斗 (Task Pipeline)</h3>
              <div className="grid grid-cols-4 gap-4 text-center items-center">
                <div className="relative group">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">待下发</div>
                  <div className="text-2xl font-bold text-slate-700 group-hover:text-blue-600 transition">450</div>
                  <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full">
                    <div className="bg-slate-300 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <i className="fa-solid fa-arrow-right absolute top-8 -right-4 text-slate-300"></i>
                </div>
                <div className="relative group">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">采集中</div>
                  <div className="text-2xl font-bold text-blue-600">1,240</div>
                  <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full">
                    <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{ width: '80%' }}></div>
                  </div>
                  <i className="fa-solid fa-arrow-right absolute top-8 -right-4 text-slate-300"></i>
                </div>
                <div className="relative group">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">审核/标注</div>
                  <div className="text-2xl font-bold text-slate-700 group-hover:text-indigo-600 transition">890</div>
                  <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <i className="fa-solid fa-arrow-right absolute top-8 -right-4 text-slate-300"></i>
                </div>
                <div className="relative group">
                  <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-semibold">已交付</div>
                  <div className="text-2xl font-bold text-emerald-600">5,200</div>
                  <div className="w-full bg-slate-100 h-1.5 mt-3 rounded-full">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="absolute -top-2 right-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition">
                    <i className="fa-solid fa-check-circle"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App

