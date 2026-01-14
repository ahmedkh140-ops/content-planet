
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Rocket, 
  Settings, 
  Users, 
  BarChart3, 
  Layers, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  TrendingUp, 
  DollarSign, 
  Target,
  Search,
  ChevronRight,
  Download,
  Calendar,
  XCircle,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from 'recharts';
import { User, Course, Sale, AdCampaign, ViewType, SubViewType, Round, PaymentMethod, Gender } from './types';
import { DEFAULT_COURSES, PLATFORMS, GOVERNORATES, PAYMENT_METHODS } from './constants';

const App: React.FC = () => {
  // --- AUTH & CORE STATE ---
  const [user, setUser] = useState<User | null>(null);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('cp_courses');
    return saved ? JSON.parse(saved) : DEFAULT_COURSES;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('cp_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [ads, setAds] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem('cp_ads');
    return saved ? JSON.parse(saved) : [];
  });

  // --- UI STATE ---
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [activeSubView, setActiveSubView] = useState<SubViewType>('new-sale');
  const [activeDbTab, setActiveDbTab] = useState<string>('');
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [dbSearch, setDbSearch] = useState('');
  
  const [filters, setFilters] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
    platform: 'All'
  });

  const [pasteData, setPasteData] = useState('');
  const [tempParsedAds, setTempParsedAds] = useState<AdCampaign[]>([]);

  // Sync to Storage
  useEffect(() => { localStorage.setItem('cp_courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('cp_sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('cp_ads', JSON.stringify(ads)); }, [ads]);

  useEffect(() => {
    if (courses.length > 0 && !activeDbTab) setActiveDbTab(courses[0].id);
  }, [courses]);

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = loginForm.username.toLowerCase().trim();
    const p = loginForm.password;
    if (u === 'marketing' && p === '1111') {
      setUser({ username: 'admin', role: 'admin', displayName: 'تيم الماركتنج' });
      setActiveView('landing');
    } else if (u === 'moderation' && p === '1234') {
      setUser({ username: 'mod', role: 'mod', displayName: 'تيم المودريشن' });
      setActiveView('moderation');
    } else {
      setLoginError('بيانات الدخول غير صحيحة!');
    }
  };

  const financialData = useMemo(() => {
    const filteredSales = sales.filter(s => 
      s.status !== 'withdrawn' &&
      s.date >= filters.start && s.date <= filters.end && 
      (filters.platform === 'All' || s.platform === filters.platform)
    );
    const filteredAds = ads.filter(a => a.date >= filters.start && a.date <= filters.end);
    const metrics = courses.map(c => {
      const cSales = filteredSales.filter(s => s.courseId === c.id);
      const cAds = filteredAds.filter(a => a.courseId === c.id);
      const rev = cSales.reduce((sum, s) => sum + s.finalPrice, 0);
      const spend = cAds.reduce((sum, a) => sum + a.spend, 0);
      return {
        id: c.id, name: c.name, revenue: rev, spend: spend, profit: rev - spend,
        roas: spend > 0 ? (rev / spend).toFixed(1) : '0'
      };
    });
    return { metrics, totalRevenue: metrics.reduce((s, x) => s + x.revenue, 0), totalSpend: metrics.reduce((s, x) => s + x.spend, 0) };
  }, [sales, ads, courses, filters]);

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || id;
  const getRoundName = (courseId: string, roundId: string) => {
    const c = courses.find(x => x.id === courseId);
    return c?.rounds.find(r => r.id === roundId)?.name || 'غير محدد';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="glass w-full max-w-md p-10 rounded-3xl shadow-2xl border-t-4 border-brand-teal text-center">
          <div className="text-7xl mb-6 flex justify-center animate-pulse">
            <Rocket className="text-brand-teal w-20 h-20" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Content Planet</h2>
          <p className="text-slate-400 mb-8 font-semibold">نظام إدارة المحتوى والعمليات</p>
          <form onSubmit={handleLogin} className="space-y-5 text-right">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 mr-1 uppercase">المستخدم</label>
              <input type="text" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl focus:ring-2 ring-brand-teal outline-none text-white text-center" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 mr-1 uppercase">كلمة المرور</label>
              <input type="password" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-slate-900/50 border border-white/10 p-3 rounded-xl focus:ring-2 ring-brand-teal outline-none text-white text-center" required />
            </div>
            {loginError && <p className="text-rose-400 text-sm font-bold text-center">{loginError}</p>}
            <button type="submit" className="w-full bg-brand-teal hover:bg-[#207a84] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-black/40">دخول للمنظومة 🚀</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 glass border-l border-white/5 flex flex-col z-50">
        <div className="p-8 border-b border-white/5 text-center">
          <h1 className="text-2xl font-black text-white">Content <span className="text-brand-teal">Planet</span></h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {user.role === 'admin' && (
            <>
              <NavItem active={activeView === 'landing'} onClick={() => setActiveView('landing')} icon={<Layers size={20}/>} label="الرئيسية" />
              <NavItem active={activeView === 'settings'} onClick={() => setActiveView('settings')} icon={<Settings size={20}/>} label="إعدادات الكورسات" />
              <NavItem active={activeView === 'rounds'} onClick={() => setActiveView('rounds')} icon={<Clock size={20}/>} label="مواعيد الراوندات" />
            </>
          )}
          <NavItem active={activeView === 'moderation'} onClick={() => setActiveView('moderation')} icon={<Users size={20}/>} label="إدارة العملاء" />
          {user.role === 'admin' && (
            <>
              <NavItem active={activeView === 'meta'} onClick={() => setActiveView('meta')} icon={<Target size={20}/>} label="حملات Meta" />
              <NavItem active={activeView === 'financial'} onClick={() => setActiveView('financial')} icon={<BarChart3 size={20}/>} label="التحليل المالي" />
            </>
          )}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="bg-slate-900/50 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center font-bold text-white text-xs">CP</div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user.displayName}</p>
              <p className="text-[10px] text-slate-500 uppercase">{user.role}</p>
            </div>
          </div>
          <button onClick={() => setUser(null)} className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-rose-400 hover:text-rose-300 py-2">
            <LogOut size={14} /> تسجيل خروج
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow overflow-y-auto p-4 md:p-8">
        {/* VIEW: LANDING */}
        {activeView === 'landing' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="glass p-12 rounded-[2.5rem] text-center space-y-6">
              <h2 className="text-4xl font-black text-white">أهلاً بك في نظام <span className="text-brand-lime">Content Planet</span></h2>
              <p className="text-slate-400 text-lg">التحكم المتكامل في المبيعات، الحملات، وإدارة الراوندات.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button onClick={() => setActiveView('moderation')} className="bg-brand-teal hover:bg-[#207a84] text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-all flex items-center gap-2">
                  <Plus /> تسجيل عميل جديد
                </button>
                <button onClick={() => setActiveView('rounds')} className="bg-white/5 hover:bg-white/10 text-white font-bold py-4 px-10 rounded-2xl border border-white/10 transition-all">
                  إدارة مواعيد الكورسات
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DashboardCard icon={<Clock className="text-brand-blue"/>} title="مواعيد الكورسات" desc="تحديد الراوندات القادمة" onClick={() => setActiveView('rounds')} />
              <DashboardCard icon={<Users className="text-brand-teal"/>} title="إدارة العملاء" desc="المبيعات، التحصيل، والسحب" onClick={() => setActiveView('moderation')} />
              <DashboardCard icon={<BarChart3 className="text-brand-lime"/>} title="التحليل المالي" desc="مراقبة ROAS والأرباح" onClick={() => setActiveView('financial')} />
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS (COURSES) */}
        {activeView === 'settings' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Settings className="text-brand-teal"/> إعدادات الكورسات</h2>
            <div className="glass p-6 rounded-3xl space-y-6">
              <h3 className="font-bold flex items-center gap-2">إضافة كورس جديد</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const price = parseFloat((form.elements.namedItem('price') as HTMLInputElement).value);
                if (name && !isNaN(price)) {
                  setCourses([...courses, { id: name.toLowerCase().replace(/\s/g, '-'), name, price, keywords: [name.toLowerCase()], rounds: [] }]);
                  form.reset();
                }
              }} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="md:col-span-1">
                  <label className="text-xs text-slate-500 mb-1 block">اسم الكورس</label>
                  <input name="name" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" required />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">السعر</label>
                  <input name="price" type="number" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl" required />
                </div>
                <button type="submit" className="bg-brand-teal text-white font-bold py-3 rounded-xl">إضافة</button>
              </form>
            </div>
            <div className="glass rounded-3xl overflow-hidden">
               <table className="w-full text-right">
                  <thead className="bg-white/5 font-bold">
                    <tr><th className="p-4">اسم الكورس</th><th className="p-4">السعر</th><th className="p-4">إجراء</th></tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {courses.map(c => (
                      <tr key={c.id}>
                        <td className="p-4 font-bold">{c.name}</td>
                        <td className="p-4">{c.price} ج.م</td>
                        <td className="p-4">
                          <button onClick={() => setCourses(courses.filter(x => x.id !== c.id))} className="text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-all"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* VIEW: ROUNDS */}
        {activeView === 'rounds' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Clock className="text-brand-blue"/> إدارة مواعيد الراوندات</h2>
            <div className="glass p-6 rounded-3xl space-y-6">
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const cid = (form.elements.namedItem('cid') as HTMLSelectElement).value;
                const rname = (form.elements.namedItem('rname') as HTMLInputElement).value;
                const rdate = (form.elements.namedItem('rdate') as HTMLInputElement).value;
                if (cid && rname) {
                  setCourses(courses.map(c => c.id === cid ? { ...c, rounds: [...c.rounds, { id: Date.now().toString(), name: rname, startDate: rdate }] } : c));
                  form.reset();
                }
              }} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">الكورس</label>
                  <select name="cid" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none">
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs text-slate-500 mb-1 block">اسم الراوند</label>
                  <input name="rname" placeholder="راوند أكتوبر" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none" required />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">تاريخ البداية</label>
                  <input name="rdate" type="date" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none" required />
                </div>
                <button type="submit" className="bg-brand-blue text-white font-bold py-3 rounded-xl">إضافة الراوند</button>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(c => (
                <div key={c.id} className="glass p-5 rounded-2xl border-white/5">
                  <h4 className="font-bold text-brand-teal mb-4 flex items-center gap-2 underline underline-offset-4">{c.name}</h4>
                  <div className="space-y-2">
                    {c.rounds.map(r => (
                      <div key={r.id} className="bg-white/5 p-3 rounded-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold">{r.name}</p>
                          <p className="text-slate-500 italic">{r.startDate}</p>
                        </div>
                        <button onClick={() => {
                          setCourses(courses.map(x => x.id === c.id ? { ...x, rounds: x.rounds.filter(round => round.id !== r.id) } : x));
                        }} className="text-rose-400 p-2 hover:bg-rose-400/10 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    ))}
                    {c.rounds.length === 0 && <p className="text-slate-600 text-xs text-center py-4">لا توجد راوندات مسجلة.</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: MODERATION */}
        {activeView === 'moderation' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Users className="text-brand-teal"/> إدارة العملاء</h2>
              <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
                <TabBtn active={activeSubView === 'new-sale'} onClick={() => setActiveSubView('new-sale')} label="تسجيل جديد" />
                <TabBtn active={activeSubView === 'database'} onClick={() => setActiveSubView('database')} label="قاعدة البيانات" />
                <TabBtn active={activeSubView === 'installments'} onClick={() => setActiveSubView('installments')} label="الأقساط" />
              </div>
            </div>

            {/* SUB: NEW SALE */}
            {activeSubView === 'new-sale' && (
              <div className="max-w-5xl mx-auto glass p-8 rounded-[2.5rem] animate-in fade-in duration-300">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const cid = data.get('courseId') as string;
                  const c = courses.find(x => x.id === cid);
                  const basePrice = c?.price || 0;
                  const discount = parseFloat(data.get('discount') as string) || 0;
                  const final = basePrice - discount;
                  const paid = parseFloat(data.get('paid') as string) || 0;
                  const remain = final - paid;

                  const newSale: Sale = {
                    id: Date.now(),
                    date: data.get('date') as string,
                    client: data.get('client') as string,
                    phone: data.get('phone') as string,
                    age: parseInt(data.get('age') as string),
                    governorate: data.get('gov') as string,
                    gender: data.get('gender') as Gender,
                    moderatorName: data.get('modName') as string,
                    courseId: cid,
                    roundId: data.get('roundId') as string,
                    paymentMethod: data.get('payMethod') as PaymentMethod,
                    platform: data.get('platform') as string,
                    basePrice, discount, finalPrice: final, paidAmount: paid, remainingAmount: remain,
                    dueDate: data.get('dueDate') as string,
                    status: remain > 0 ? 'partial' : 'paid'
                  };
                  setSales([newSale, ...sales]);
                  form.reset();
                  alert('تم تسجيل العميل بنجاح! 🎉');
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormGroup label="اسم العميل *" name="client" required />
                    <FormGroup label="رقم الموبايل *" name="phone" required />
                    <FormGroup label="السن" name="age" type="number" />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">المحافظة</label>
                      <select name="gov" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm">
                        {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">النوع</label>
                      <select name="gender" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                    <FormGroup label="اسم المودريتور القائم بالطلب *" name="modName" required />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">المنصة</label>
                      <select name="platform" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm">
                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <FormGroup label="التاريخ" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>

                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">الكورس</label>
                      <select 
                        id="courseSelect" 
                        name="courseId" 
                        onChange={(e) => setActiveDbTab(e.target.value)} 
                        className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm"
                      >
                        {courses.map(c => <option key={c.id} value={c.id}>{c.name} ({c.price} ج.م)</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">الراوند (الموعد)</label>
                      <select name="roundId" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm">
                        {courses.find(c => c.id === activeDbTab)?.rounds.map(r => <option key={r.id} value={r.id}>{r.name} - {r.startDate}</option>)}
                        {(!courses.find(c => c.id === activeDbTab)?.rounds.length) && <option value="none">لا يوجد راوندات مفعله</option>}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">طريقة الدفع</label>
                      <select name="payMethod" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl outline-none text-sm">
                        {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </select>
                    </div>
                    <FormGroup label="المبلغ المدفوع" name="paid" type="number" defaultValue="0" />
                    <FormGroup label="قيمة الخصم" name="discount" type="number" defaultValue="0" />
                    <FormGroup label="تاريخ استحقاق الباقي" name="dueDate" type="date" />
                  </div>
                  <button type="submit" className="w-full bg-brand-teal py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-teal/20 transition-all hover:scale-[1.01]">تسجيل وحفظ البيانات ✅</button>
                </form>
              </div>
            )}

            {/* SUB: DATABASE */}
            {activeSubView === 'database' && (
              <div className="space-y-4">
                 <div className="flex gap-2 overflow-x-auto pb-2">
                  {courses.map(c => (
                    <button key={c.id} onClick={() => setActiveDbTab(c.id)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border ${activeDbTab === c.id ? 'bg-brand-teal border-brand-teal' : 'bg-slate-900 border-white/10 text-slate-500'}`}>{c.name}</button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input className="w-full bg-slate-900 border border-white/10 pr-12 p-4 rounded-2xl outline-none" placeholder="بحث بالاسم أو الهاتف..." value={dbSearch} onChange={e => setDbSearch(e.target.value)} />
                </div>
                <div className="glass rounded-3xl overflow-hidden overflow-x-auto">
                   <table className="w-full text-right text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 font-bold">
                        <tr>
                          <th className="p-4">العميل</th>
                          <th className="p-4">المودريتور</th>
                          <th className="p-4">الراوند</th>
                          <th className="p-4">طريقة الدفع</th>
                          <th className="p-4">المحافظة</th>
                          <th className="p-4">المبلغ</th>
                          <th className="p-4">الباقي</th>
                          <th className="p-4">إجراء</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sales
                          .filter(s => s.status !== 'withdrawn' && s.courseId === activeDbTab && (s.client.includes(dbSearch) || s.phone.includes(dbSearch)))
                          .map(s => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors">
                              <td className="p-4">
                                <div className="font-bold text-white">{s.client}</div>
                                <div className="text-[10px] text-slate-500">{s.phone}</div>
                              </td>
                              <td className="p-4 font-bold text-brand-lime">{s.moderatorName}</td>
                              <td className="p-4 text-brand-blue">{getRoundName(s.courseId, s.roundId)}</td>
                              <td className="p-4 uppercase font-semibold">{s.paymentMethod}</td>
                              <td className="p-4">{s.governorate}</td>
                              <td className="p-4 font-bold">{s.finalPrice}</td>
                              <td className="p-4 text-rose-400 font-bold">{s.remainingAmount}</td>
                              <td className="p-4">
                                {user.role === 'admin' ? (
                                  <div className="flex gap-2">
                                    <button onClick={() => setEditingSale(s)} className="p-2 bg-blue-500/10 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"><Edit size={16}/></button>
                                    <button onClick={() => { if(confirm('متأكد من حذف العميل؟')) setSales(sales.filter(x => x.id !== s.id)); }} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                                  </div>
                                ) : (
                                  <span className="text-slate-600 italic">للماركتنج فقط</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW: META ADS IMPORT */}
        {activeView === 'meta' && (
          <div className="max-w-6xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><Target className="text-brand-teal"/> استيراد حملات Meta</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass p-8 rounded-[2.5rem] space-y-4">
                <h3 className="font-bold">الصق البيانات من Ads Manager</h3>
                <textarea 
                  className="w-full h-64 bg-slate-900 border border-white/10 p-4 rounded-2xl outline-none text-xs text-brand-teal font-mono"
                  placeholder="Campaign_Name   150.50   12   2024-10-01..."
                  value={pasteData}
                  onChange={e => setPasteData(e.target.value)}
                />
                <button 
                  onClick={() => {
                    const rows = pasteData.trim().split('\n');
                    const parsed: AdCampaign[] = [];
                    rows.forEach(r => {
                      let cols = r.split('\t');
                      if (cols.length < 2) cols = r.split(/\s\s+/);
                      if (cols.length >= 2) {
                        const name = cols[0].trim();
                        const spend = parseFloat(cols[1]?.replace(/[^0-9.]/g, '')) || 0;
                        const leads = parseInt(cols[2]?.replace(/[^0-9.]/g, '')) || 0;
                        const date = cols[3]?.trim() || new Date().toISOString().split('T')[0];
                        if (name.toLowerCase().includes('campaign') || isNaN(spend)) return;
                        let cId = 'unknown';
                        for (let c of courses) {
                          if (name.toLowerCase().includes(c.name.toLowerCase())) cId = c.id;
                        }
                        parsed.push({ id: Date.now() + Math.random(), date, campaignName: name, courseId: cId, spend, leads, platform: 'Facebook' });
                      }
                    });
                    setTempParsedAds(parsed);
                  }}
                  className="w-full bg-brand-teal text-white font-bold py-4 rounded-2xl shadow-lg"
                >
                  تحليل البيانات
                </button>
              </div>
              <div className="glass p-8 rounded-[2.5rem] flex flex-col">
                <h3 className="font-bold mb-4">المعاينة والحفظ</h3>
                <div className="flex-grow overflow-y-auto mb-6 bg-slate-900/50 rounded-2xl p-2 border border-white/5">
                  <table className="w-full text-right text-[10px]">
                    <thead className="sticky top-0 bg-slate-800 font-bold">
                      <tr><th className="p-2">التاريخ</th><th className="p-2">الكورس</th><th className="p-2">الصرف</th><th className="p-2">الليدز</th></tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {tempParsedAds.map(a => (
                        <tr key={a.id}>
                          <td className="p-2">{a.date}</td>
                          <td className="p-2 font-bold">{getCourseName(a.courseId)}</td>
                          <td className="p-2">{a.spend}</td>
                          <td className="p-2 text-brand-lime">{a.leads}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  disabled={tempParsedAds.length === 0}
                  onClick={() => { setAds([...tempParsedAds, ...ads]); setTempParsedAds([]); setPasteData(''); alert('تم الاستيراد بنجاح!'); }}
                  className="w-full bg-brand-lime text-brand-purple font-black py-4 rounded-2xl shadow-xl disabled:opacity-30"
                >
                  حفظ في قاعدة البيانات 💾
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: FINANCIAL ANALYTICS */}
        {activeView === 'financial' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3"><BarChart3 className="text-brand-lime"/> التحليل المالي</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="glass p-8 rounded-3xl border-brand-teal/20">
                  <p className="text-xs font-bold text-brand-teal mb-2 uppercase">إيرادات الكورسات</p>
                  <p className="text-4xl font-black">{financialData.totalRevenue} <span className="text-sm font-normal">ج.م</span></p>
               </div>
               <div className="glass p-8 rounded-3xl border-rose-500/20">
                  <p className="text-xs font-bold text-rose-400 mb-2 uppercase">مصاريف الإعلانات</p>
                  <p className="text-4xl font-black">{financialData.totalSpend} <span className="text-sm font-normal">ج.م</span></p>
               </div>
               <div className="glass p-8 rounded-3xl border-brand-lime/20">
                  <p className="text-xs font-bold text-brand-lime mb-2 uppercase">صافي الأرباح</p>
                  <p className="text-4xl font-black">{financialData.totalRevenue - financialData.totalSpend} <span className="text-sm font-normal">ج.م</span></p>
               </div>
            </div>
            <div className="glass p-8 rounded-[2.5rem] h-[400px]">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false}/>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12}/>
                    <YAxis stroke="#64748b" fontSize={12}/>
                    <Tooltip contentStyle={{backgroundColor: '#2a1b3d', border: 'none', borderRadius: '15px'}}/>
                    <Bar dataKey="revenue" fill="#a2cf44" radius={[8, 8, 0, 0]} name="الإيرادات" />
                    <Bar dataKey="spend" fill="#258c97" radius={[8, 8, 0, 0]} name="المصاريف" />
                  </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      {editingSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="glass w-full max-w-3xl p-8 rounded-[2.5rem] border-brand-teal/30 space-y-6 shadow-2xl">
             <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2"><Edit className="text-brand-blue"/> تعديل بيانات {editingSale.client}</h3>
                <button onClick={() => setEditingSale(null)} className="text-slate-400 hover:text-white text-3xl">×</button>
             </div>
             <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const cid = data.get('courseId') as string;
                const c = courses.find(x => x.id === cid);
                const basePrice = c?.price || 0;
                const discount = parseFloat(data.get('discount') as string) || 0;
                const final = basePrice - discount;
                const paid = parseFloat(data.get('paid') as string) || 0;
                const updated: Sale = {
                  ...editingSale,
                  client: data.get('client') as string,
                  phone: data.get('phone') as string,
                  age: parseInt(data.get('age') as string),
                  governorate: data.get('gov') as string,
                  moderatorName: data.get('modName') as string,
                  courseId: cid,
                  roundId: data.get('roundId') as string,
                  paymentMethod: data.get('payMethod') as PaymentMethod,
                  discount,
                  finalPrice: final,
                  paidAmount: paid,
                  remainingAmount: final - paid,
                  dueDate: data.get('dueDate') as string,
                  status: (final - paid) > 0 ? 'partial' : 'paid'
                };
                setSales(sales.map(s => s.id === editingSale.id ? updated : s));
                setEditingSale(null);
                alert('تم التعديل بنجاح!');
             }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormGroup label="الاسم" name="client" defaultValue={editingSale.client} />
                <FormGroup label="الموبايل" name="phone" defaultValue={editingSale.phone} />
                <FormGroup label="السن" name="age" type="number" defaultValue={editingSale.age?.toString()} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">المحافظة</label>
                  <select name="gov" defaultValue={editingSale.governorate} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-sm outline-none">
                    {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <FormGroup label="المودريتور القائم بالطلب" name="modName" defaultValue={editingSale.moderatorName} />
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">طريقة الدفع</label>
                  <select name="payMethod" defaultValue={editingSale.paymentMethod} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-sm outline-none">
                    {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl">
                   <FormGroup label="المدفوع" name="paid" type="number" defaultValue={editingSale.paidAmount.toString()} />
                   <FormGroup label="الخصم" name="discount" type="number" defaultValue={editingSale.discount.toString()} />
                   <FormGroup label="تاريخ استحقاق الباقي" name="dueDate" type="date" defaultValue={editingSale.dueDate} />
                </div>
                <div className="md:col-span-2 flex gap-4 pt-4 border-t border-white/10">
                   <button type="submit" className="flex-grow bg-brand-teal font-black text-white py-4 rounded-xl shadow-lg hover:scale-[1.01] transition-all">حفظ التغييرات</button>
                   <button type="button" onClick={() => {
                      if(confirm('هل تريد حذف العميل نهائياً (تم السحب)؟')) {
                        setSales(sales.filter(x => x.id !== editingSale.id));
                        setEditingSale(null);
                      }
                   }} className="px-6 bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 rounded-xl flex items-center gap-2 hover:bg-rose-500 hover:text-white transition-all">
                     <XCircle size={18}/> تم السحب
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SMALL COMPONENTS ---

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${active ? 'bg-brand-teal text-white shadow-lg' : 'text-slate-400 hover:bg-white/5'}`}>
    {icon} <span className="text-sm">{label}</span>
  </button>
);

const DashboardCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <button onClick={onClick} className="glass p-8 rounded-3xl text-right space-y-4 hover:-translate-y-2 transition-all border-white/5 group">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center transition-all group-hover:bg-brand-teal group-hover:text-white">{icon}</div>
    <h3 className="text-xl font-bold group-hover:text-brand-teal">{title}</h3>
    <p className="text-xs text-slate-500">{desc}</p>
  </button>
);

const TabBtn: React.FC<{ active: boolean, onClick: () => void, label: string }> = ({ active, onClick, label }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${active ? 'bg-brand-teal text-white shadow-md' : 'text-slate-500 hover:text-white'}`}>
    {label}
  </button>
);

const FormGroup: React.FC<{ label: string, name: string, type?: string, defaultValue?: string, required?: boolean }> = ({ label, name, type = 'text', defaultValue, required }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-500 uppercase">{label}</label>
    <input name={name} type={type} defaultValue={defaultValue} required={required} className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl focus:ring-1 ring-brand-teal outline-none text-white text-sm" />
  </div>
);

export default App;
