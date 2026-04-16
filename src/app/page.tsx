'use client';
 
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
 
// ============================================================
// Supabase Client
// ============================================================
const SUPABASE_URL = 'https://nanbjdtzawynwubieikr.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbmJqZHR6YXd5bnd1YmllaWtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDkyNDQsImV4cCI6MjA5MTQ4NTI0NH0.15GJSu1ZYTUeCu2P8nLP83f2bcPV3t_p9NNf0RuUCN0';
 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
 
// ============================================================
// Types
// ============================================================
type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: 'sender' | 'driver' | null;
  city: string | null;
  avatar_url: string | null;
};
 
type Order = {
  id: string;
  sender_id: string;
  description: string | null;
  image_url: string | null;
  size: string | null;
  from_city: string | null;
  to_city: string | null;
  delivery_date: string | null;
  delivery_time: string | null;
  price: number | null;
  pickup_type: 'meeting_point' | 'home_pickup' | null;
  pickup_lat: number | null;
  pickup_lng: number | null;
  pickup_address: string | null;
  extra_fee: number | null;
  matched_driver_id: string | null;
  status: string | null;
  created_at: string;
};
 
type Trip = {
  id: string;
  driver_id: string;
  from_city: string | null;
  to_city: string | null;
  trip_date: string | null;
  trip_time: string | null;
  capacity: string | null;
  min_price: number | null;
  matched_sender_id: string | null;
  status: string | null;
  created_at: string;
};
 
// ============================================================
// Main Page
// ============================================================
export default function Page() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authForm, setAuthForm] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'sender' as 'sender' | 'driver',
    city: '',
  });
  const [authError, setAuthError] = useState('');
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadProfile(data.session.user.id);
      else setLoading(false);
    });
 
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) loadProfile(s.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });
 
    return () => sub.subscription.unsubscribe();
  }, []);
 
  async function loadProfile(userId: string) {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data);
    setLoading(false);
  }
 
  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
 
    if (authMode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: authForm.email,
        password: authForm.password,
      });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: authForm.full_name,
          phone: authForm.phone,
          role: authForm.role,
          city: authForm.city,
        });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authForm.email,
        password: authForm.password,
      });
      if (error) setAuthError(error.message);
    }
  }
 
  async function handleLogout() {
    await supabase.auth.signOut();
  }
 
  // ==========================================================
  // Loading Screen
  // ==========================================================
  if (loading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center bg-[#1a1410]"
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c9a961] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-[#c9a961] text-lg font-medium tracking-wider">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }
 
  // ==========================================================
  // Auth Screen
  // ==========================================================
  if (!session) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1a1410] via-[#2a1f18] to-[#1a1410]"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,#c9a961_0%,transparent_40%),radial-gradient(circle_at_80%_70%,#8b4513_0%,transparent_40%)]"></div>
 
        <div className="relative w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#c9a961] to-[#8b6914] flex items-center justify-center shadow-2xl shadow-[#c9a961]/20">
                <span className="text-4xl">🐪</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-[#f5e6d3] mb-2 tracking-tight">
              كدّاد
            </h1>
            <p className="text-[#c9a961] text-sm tracking-widest">
              توصيل الأمانات بين المدن
            </p>
          </div>
 
          <div className="bg-[#2a1f18]/80 backdrop-blur-xl border border-[#c9a961]/20 rounded-2xl p-8 shadow-2xl">
            <div className="flex gap-2 mb-6 p-1 bg-[#1a1410] rounded-xl">
              <button
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  authMode === 'login'
                    ? 'bg-[#c9a961] text-[#1a1410]'
                    : 'text-[#c9a961]/60'
                }`}
              >
                دخول
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                  authMode === 'signup'
                    ? 'bg-[#c9a961] text-[#1a1410]'
                    : 'text-[#c9a961]/60'
                }`}
              >
                تسجيل
              </button>
            </div>
 
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'signup' && (
                <>
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={authForm.full_name}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, full_name: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الجوال"
                    value={authForm.phone}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="المدينة"
                    value={authForm.city}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, city: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none transition-colors"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setAuthForm({ ...authForm, role: 'sender' })
                      }
                      className={`py-3 rounded-xl font-medium border transition-all ${
                        authForm.role === 'sender'
                          ? 'bg-[#c9a961] text-[#1a1410] border-[#c9a961]'
                          : 'bg-transparent text-[#c9a961] border-[#c9a961]/30'
                      }`}
                    >
                      📦 مرسل
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setAuthForm({ ...authForm, role: 'driver' })
                      }
                      className={`py-3 rounded-xl font-medium border transition-all ${
                        authForm.role === 'driver'
                          ? 'bg-[#c9a961] text-[#1a1410] border-[#c9a961]'
                          : 'bg-transparent text-[#c9a961] border-[#c9a961]/30'
                      }`}
                    >
                      🚚 كدّاد
                    </button>
                  </div>
                </>
              )}
 
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={authForm.email}
                onChange={(e) =>
                  setAuthForm({ ...authForm, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none transition-colors"
              />
              <input
                type="password"
                placeholder="كلمة المرور"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm({ ...authForm, password: e.target.value })
                }
                required
                minLength={6}
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none transition-colors"
              />
 
              {authError && (
                <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm">
                  {authError}
                </div>
              )}
 
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#c9a961] to-[#8b6914] text-[#1a1410] font-bold rounded-xl hover:shadow-xl hover:shadow-[#c9a961]/30 transition-all"
              >
                {authMode === 'login' ? 'دخول' : 'إنشاء حساب'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
 
  // ==========================================================
  // Profile Not Found
  // ==========================================================
  if (!profile || !profile.role) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex items-center justify-center p-4 bg-[#1a1410]"
      >
        <div className="bg-[#2a1f18] border border-[#c9a961]/20 rounded-2xl p-8 max-w-md text-center">
          <p className="text-[#f5e6d3] mb-4">
            لم يكتمل حسابك بعد. يرجى تسجيل الخروج والتسجيل من جديد.
          </p>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-[#c9a961] text-[#1a1410] rounded-xl font-medium"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    );
  }
 
  // ==========================================================
  // Main Dashboard
  // ==========================================================
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-[#1a1410] via-[#201812] to-[#1a1410]"
    >
      <Header profile={profile} onLogout={handleLogout} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        {profile.role === 'sender' ? (
          <SenderDashboard profile={profile} />
        ) : (
          <DriverDashboard profile={profile} />
        )}
      </main>
    </div>
  );
}
 
// ============================================================
// Header
// ============================================================
function Header({
  profile,
  onLogout,
}: {
  profile: Profile;
  onLogout: () => void;
}) {
  return (
    <header className="border-b border-[#c9a961]/10 bg-[#1a1410]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#c9a961] to-[#8b6914] flex items-center justify-center shadow-lg">
            <span className="text-2xl">🐪</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f5e6d3] leading-none">
              كدّاد
            </h1>
            <p className="text-[11px] text-[#c9a961]/70 mt-0.5">
              {profile.role === 'sender' ? 'حساب مرسل' : 'حساب كدّاد'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <p className="text-sm text-[#f5e6d3] font-medium">
              {profile.full_name}
            </p>
            <p className="text-xs text-[#c9a961]/60">{profile.city}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm border border-[#c9a961]/30 text-[#c9a961] rounded-lg hover:bg-[#c9a961]/10 transition-colors"
          >
            خروج
          </button>
        </div>
      </div>
    </header>
  );
}
 
// ============================================================
// SENDER DASHBOARD
// ============================================================
function SenderDashboard({ profile }: { profile: Profile }) {
  const [showForm, setShowForm] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Record<string, Profile>>({});
 
  useEffect(() => {
    loadData();
    const ch = supabase
      .channel('sender-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trips' },
        loadData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        loadData
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [profile.id]);
 
  async function loadData() {
    // رحلات متاحة فقط (matched_sender_id = null)
    const { data: tripsData } = await supabase
      .from('trips')
      .select('*')
      .is('matched_sender_id', null)
      .order('trip_date', { ascending: true });
    setTrips(tripsData || []);
 
    // طلباتي
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .eq('sender_id', profile.id)
      .order('created_at', { ascending: false });
    setMyOrders(ordersData || []);
 
    // بروفايلات الكدّادين
    const driverIds = Array.from(
      new Set((tripsData || []).map((t) => t.driver_id))
    );
    if (driverIds.length > 0) {
      const { data: dv } = await supabase
        .from('profiles')
        .select('*')
        .in('id', driverIds);
      const map: Record<string, Profile> = {};
      (dv || []).forEach((d) => (map[d.id] = d));
      setDrivers(map);
    }
  }
 
  async function selectDriver(trip: Trip, orderId: string) {
    // 1) تحديث الطلب بمعرف الكدّاد
    const { error: e1 } = await supabase
      .from('orders')
      .update({
        matched_driver_id: trip.driver_id,
        status: 'matched',
      })
      .eq('id', orderId);
 
    if (e1) {
      alert('خطأ في حجز الكدّاد: ' + e1.message);
      return;
    }
 
    // 2) إخفاء الرحلة من الباقين
    await supabase
      .from('trips')
      .update({ matched_sender_id: profile.id, status: 'matched' })
      .eq('id', trip.id);
 
    loadData();
    alert('تم اختيار الكدّاد بنجاح! ✓');
  }
 
  return (
    <div className="space-y-8">
      {/* زر إرسال غرض */}
      <div className="bg-gradient-to-br from-[#2a1f18] to-[#1f1711] border border-[#c9a961]/20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl"></div>
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-[#f5e6d3] mb-2">
              أهلاً، {profile.full_name} 👋
            </h2>
            <p className="text-[#c9a961]/80">
              احتاج كدّاد موثوق لتوصيل غرضك؟ أنشئ طلب جديد الآن
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-[#c9a961] to-[#8b6914] text-[#1a1410] font-bold rounded-xl shadow-xl hover:shadow-[#c9a961]/30 transition-all"
          >
            + أرسل غرض
          </button>
        </div>
      </div>
 
      {/* طلباتي */}
      {myOrders.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-[#f5e6d3] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#c9a961] rounded-full"></span>
            طلباتي ({myOrders.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {myOrders.map((o) => (
              <MyOrderCard key={o.id} order={o} />
            ))}
          </div>
        </section>
      )}
 
      {/* الكدّادين المتاحين */}
      <section>
        <h3 className="text-xl font-bold text-[#f5e6d3] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#c9a961] rounded-full"></span>
          كدّادين متاحين ({trips.length})
        </h3>
 
        {trips.length === 0 ? (
          <div className="bg-[#2a1f18]/50 border border-[#c9a961]/10 border-dashed rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">🏜️</div>
            <p className="text-[#c9a961]/70">لا يوجد كدّادين متاحين حالياً</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {trips.map((t) => (
              <TripCard
                key={t.id}
                trip={t}
                driver={drivers[t.driver_id]}
                myPendingOrders={myOrders.filter(
                  (o) => !o.matched_driver_id && o.status !== 'delivered'
                )}
                onSelect={(orderId) => selectDriver(t, orderId)}
              />
            ))}
          </div>
        )}
      </section>
 
      {showForm && (
        <OrderForm
          profile={profile}
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
 
// ============================================================
// ORDER FORM (Sender)
// ============================================================
function OrderForm({
  profile,
  onClose,
  onSubmit,
}: {
  profile: Profile;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [form, setForm] = useState({
    description: '',
    size: 'صغير',
    from_city: profile.city || '',
    to_city: '',
    delivery_date: '',
    delivery_time: '',
    price: '',
    pickup_type: 'meeting_point' as 'meeting_point' | 'home_pickup',
    pickup_address: '',
    pickup_lat: '',
    pickup_lng: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
 
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  }
 
  async function uploadImage(): Promise<string | null> {
    if (!imageFile) return null;
    const ext = imageFile.name.split('.').pop();
    const path = `${profile.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from('orders')
      .upload(path, imageFile);
    if (error) {
      console.error(error);
      return null;
    }
    const { data } = supabase.storage.from('orders').getPublicUrl(path);
    return data.publicUrl;
  }
 
  async function getLocation() {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setForm({
          ...form,
          pickup_lat: String(p.coords.latitude),
          pickup_lng: String(p.coords.longitude),
        });
      },
      () => alert('تعذر الحصول على الموقع')
    );
  }
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
 
    const image_url = await uploadImage();
    const extra_fee = form.pickup_type === 'home_pickup' ? 30 : 0;
 
    const { error } = await supabase.from('orders').insert({
      sender_id: profile.id,
      description: form.description,
      image_url,
      size: form.size,
      from_city: form.from_city,
      to_city: form.to_city,
      delivery_date: form.delivery_date,
      delivery_time: form.delivery_time,
      price: parseFloat(form.price),
      pickup_type: form.pickup_type,
      pickup_address:
        form.pickup_type === 'home_pickup' ? form.pickup_address : null,
      pickup_lat:
        form.pickup_type === 'home_pickup' && form.pickup_lat
          ? parseFloat(form.pickup_lat)
          : null,
      pickup_lng:
        form.pickup_type === 'home_pickup' && form.pickup_lng
          ? parseFloat(form.pickup_lng)
          : null,
      extra_fee,
      status: 'pending',
    });
 
    setSubmitting(false);
    if (error) {
      alert('خطأ: ' + error.message);
      return;
    }
    onSubmit();
  }
 
  const isHomePickup = form.pickup_type === 'home_pickup';
  const totalPrice =
    (parseFloat(form.price) || 0) + (isHomePickup ? 30 : 0);
 
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#2a1f18] border border-[#c9a961]/30 rounded-2xl p-6 md:p-8 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5e6d3]">طلب جديد</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1410] text-[#c9a961] hover:bg-[#c9a961]/20 transition-colors"
          >
            ✕
          </button>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="وصف الغرض">
            <textarea
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="مثال: صندوق كتب، حاسب محمول، هدية..."
              rows={3}
              className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none resize-none"
            />
          </Field>
 
          <Field label="صورة الغرض">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 border-dashed rounded-xl text-[#c9a961] hover:bg-[#c9a961]/5 transition-colors"
            >
              {imageFile ? '✓ ' + imageFile.name : '📷 اختر صورة'}
            </button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="معاينة"
                className="mt-3 max-h-40 rounded-xl border border-[#c9a961]/20"
              />
            )}
          </Field>
 
          <Field label="حجم الغرض">
            <div className="grid grid-cols-3 gap-2">
              {['صغير', 'متوسط', 'كبير'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setForm({ ...form, size: s })}
                  className={`py-2.5 rounded-xl font-medium border transition-all ${
                    form.size === s
                      ? 'bg-[#c9a961] text-[#1a1410] border-[#c9a961]'
                      : 'bg-[#1a1410] text-[#c9a961] border-[#c9a961]/30'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Field>
 
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="من مدينة">
              <input
                required
                value={form.from_city}
                onChange={(e) =>
                  setForm({ ...form, from_city: e.target.value })
                }
                placeholder="الرياض"
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
            <Field label="إلى مدينة">
              <input
                required
                value={form.to_city}
                onChange={(e) => setForm({ ...form, to_city: e.target.value })}
                placeholder="جدة"
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
          </div>
 
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="يوم التوصيل">
              <input
                required
                type="date"
                value={form.delivery_date}
                onChange={(e) =>
                  setForm({ ...form, delivery_date: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
            <Field label="الساعة">
              <input
                required
                type="time"
                value={form.delivery_time}
                onChange={(e) =>
                  setForm({ ...form, delivery_time: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
          </div>
 
          <Field label="السعر المعروض (ر.س)">
            <input
              required
              type="number"
              min="1"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="100"
              className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none"
            />
          </Field>
 
          <Field label="نوع الاستلام">
            <div className="grid md:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, pickup_type: 'meeting_point' })
                }
                className={`p-4 rounded-xl border text-right transition-all ${
                  form.pickup_type === 'meeting_point'
                    ? 'bg-[#c9a961]/15 border-[#c9a961]'
                    : 'bg-[#1a1410] border-[#c9a961]/30'
                }`}
              >
                <div className="text-[#f5e6d3] font-bold mb-1">
                  📍 نقطة لقاء
                </div>
                <div className="text-xs text-[#c9a961]/70">
                  بدون رسوم إضافية
                </div>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, pickup_type: 'home_pickup' })}
                className={`p-4 rounded-xl border text-right transition-all ${
                  form.pickup_type === 'home_pickup'
                    ? 'bg-[#c9a961]/15 border-[#c9a961]'
                    : 'bg-[#1a1410] border-[#c9a961]/30'
                }`}
              >
                <div className="text-[#f5e6d3] font-bold mb-1">
                  🏠 استلام من عندك
                </div>
                <div className="text-xs text-[#c9a961]/70">+30 ر.س رسوم</div>
              </button>
            </div>
          </Field>
 
          {isHomePickup && (
            <Field label="عنوان الاستلام">
              <textarea
                required
                value={form.pickup_address}
                onChange={(e) =>
                  setForm({ ...form, pickup_address: e.target.value })
                }
                placeholder="الحي، الشارع، رقم المبنى..."
                rows={2}
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none resize-none"
              />
              <button
                type="button"
                onClick={getLocation}
                className="mt-2 px-4 py-2 text-xs bg-[#c9a961]/10 border border-[#c9a961]/30 text-[#c9a961] rounded-lg hover:bg-[#c9a961]/20 transition-colors"
              >
                📍 استخدم موقعي الحالي
              </button>
              {form.pickup_lat && (
                <p className="text-xs text-[#c9a961]/60 mt-2">
                  الإحداثيات: {parseFloat(form.pickup_lat).toFixed(4)},{' '}
                  {parseFloat(form.pickup_lng).toFixed(4)}
                </p>
              )}
            </Field>
          )}
 
          {form.price && (
            <div className="p-4 bg-[#c9a961]/10 border border-[#c9a961]/30 rounded-xl flex items-center justify-between">
              <span className="text-[#c9a961]">المجموع المتوقع:</span>
              <span className="text-xl font-bold text-[#f5e6d3]">
                {totalPrice} ر.س
              </span>
            </div>
          )}
 
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#c9a961]/30 text-[#c9a961] rounded-xl font-medium hover:bg-[#c9a961]/10 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-[#c9a961] to-[#8b6914] text-[#1a1410] font-bold rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-[#c9a961]/30 transition-all"
            >
              {submitting ? 'جاري الإرسال...' : 'نشر الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
// ============================================================
// DRIVER DASHBOARD
// ============================================================
function DriverDashboard({ profile }: { profile: Profile }) {
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [myTrips, setMyTrips] = useState<Trip[]>([]);
  const [senders, setSenders] = useState<Record<string, Profile>>({});
 
  useEffect(() => {
    loadData();
    const ch = supabase
      .channel('driver-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        loadData
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'trips' },
        loadData
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [profile.id]);
 
  async function loadData() {
    // طلبات معلقة فقط (matched_driver_id = null)
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*')
      .is('matched_driver_id', null)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    setOrders(ordersData || []);
 
    // رحلاتي
    const { data: tripsData } = await supabase
      .from('trips')
      .select('*')
      .eq('driver_id', profile.id)
      .order('trip_date', { ascending: true });
    setMyTrips(tripsData || []);
 
    // بروفايلات المرسلين
    const senderIds = Array.from(
      new Set((ordersData || []).map((o) => o.sender_id))
    );
    if (senderIds.length > 0) {
      const { data: sd } = await supabase
        .from('profiles')
        .select('*')
        .in('id', senderIds);
      const map: Record<string, Profile> = {};
      (sd || []).forEach((s) => (map[s.id] = s));
      setSenders(map);
    }
  }
 
  async function acceptOrder(order: Order) {
    // 1) حجز الطلب
    const { error } = await supabase
      .from('orders')
      .update({
        matched_driver_id: profile.id,
        status: 'matched',
      })
      .eq('id', order.id)
      .is('matched_driver_id', null); // منع السباق
 
    if (error) {
      alert('خطأ: ' + error.message);
      return;
    }
 
    loadData();
    alert('تم قبول الطلب بنجاح! ✓');
  }
 
  return (
    <div className="space-y-8">
      {/* زر إضافة رحلة */}
      <div className="bg-gradient-to-br from-[#2a1f18] to-[#1f1711] border border-[#c9a961]/20 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl"></div>
        <div className="relative flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-[#f5e6d3] mb-2">
              مرحباً كدّاد {profile.full_name} 🚚
            </h2>
            <p className="text-[#c9a961]/80">
              أعلن عن رحلتك القادمة واستقبل الطلبات
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-[#c9a961] to-[#8b6914] text-[#1a1410] font-bold rounded-xl shadow-xl hover:shadow-[#c9a961]/30 transition-all"
          >
            + أضف رحلة
          </button>
        </div>
      </div>
 
      {/* رحلاتي */}
      {myTrips.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-[#f5e6d3] mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#c9a961] rounded-full"></span>
            رحلاتي ({myTrips.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {myTrips.map((t) => (
              <MyTripCard key={t.id} trip={t} />
            ))}
          </div>
        </section>
      )}
 
      {/* طلبات معلقة */}
      <section>
        <h3 className="text-xl font-bold text-[#f5e6d3] mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-[#c9a961] rounded-full"></span>
          طلبات معلقة ({orders.length})
        </h3>
 
        {orders.length === 0 ? (
          <div className="bg-[#2a1f18]/50 border border-[#c9a961]/10 border-dashed rounded-2xl p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-[#c9a961]/70">لا توجد طلبات معلقة حالياً</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {orders.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                sender={senders[o.sender_id]}
                onAccept={() => acceptOrder(o)}
              />
            ))}
          </div>
        )}
      </section>
 
      {showForm && (
        <TripForm
          profile={profile}
          onClose={() => setShowForm(false)}
          onSubmit={() => {
            setShowForm(false);
            loadData();
          }}
        />
      )}
    </div>
  );
}
 
// ============================================================
// TRIP FORM (Driver)
// ============================================================
function TripForm({
  profile,
  onClose,
  onSubmit,
}: {
  profile: Profile;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const [form, setForm] = useState({
    from_city: profile.city || '',
    to_city: '',
    trip_date: '',
    trip_time: '',
    capacity: 'متوسط',
    min_price: '50',
  });
  const [submitting, setSubmitting] = useState(false);
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
 
    const minPrice = parseFloat(form.min_price);
    if (minPrice < 50) {
      alert('الحد الأدنى للسعر 50 ر.س');
      return;
    }
 
    setSubmitting(true);
    const { error } = await supabase.from('trips').insert({
      driver_id: profile.id,
      from_city: form.from_city,
      to_city: form.to_city,
      trip_date: form.trip_date,
      trip_time: form.trip_time,
      capacity: form.capacity,
      min_price: minPrice,
      status: 'available',
    });
    setSubmitting(false);
 
    if (error) {
      alert('خطأ: ' + error.message);
      return;
    }
    onSubmit();
  }
 
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#2a1f18] border border-[#c9a961]/30 rounded-2xl p-6 md:p-8 w-full max-w-xl my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#f5e6d3]">رحلة جديدة</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1a1410] text-[#c9a961]"
          >
            ✕
          </button>
        </div>
 
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="من مدينة">
              <input
                required
                value={form.from_city}
                onChange={(e) =>
                  setForm({ ...form, from_city: e.target.value })
                }
                placeholder="الرياض"
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
            <Field label="إلى مدينة">
              <input
                required
                value={form.to_city}
                onChange={(e) => setForm({ ...form, to_city: e.target.value })}
                placeholder="الدمام"
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] placeholder-[#c9a961]/40 focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
          </div>
 
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="يوم الرحلة">
              <input
                required
                type="date"
                value={form.trip_date}
                onChange={(e) =>
                  setForm({ ...form, trip_date: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
            <Field label="الساعة">
              <input
                required
                type="time"
                value={form.trip_time}
                onChange={(e) =>
                  setForm({ ...form, trip_time: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] focus:border-[#c9a961] focus:outline-none"
              />
            </Field>
          </div>
 
          <Field label="المساحة المتوفرة">
            <div className="grid grid-cols-3 gap-2">
              {['صغير', 'متوسط', 'كبير'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, capacity: c })}
                  className={`py-2.5 rounded-xl font-medium border transition-all ${
                    form.capacity === c
                      ? 'bg-[#c9a961] text-[#1a1410] border-[#c9a961]'
                      : 'bg-[#1a1410] text-[#c9a961] border-[#c9a961]/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </Field>
 
          <Field label="الحد الأدنى للسعر (ر.س) - لا يقل عن 50">
            <input
              required
              type="number"
              min="50"
              value={form.min_price}
              onChange={(e) => setForm({ ...form, min_price: e.target.value })}
              className="w-full px-4 py-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-[#f5e6d3] focus:border-[#c9a961] focus:outline-none"
            />
          </Field>
 
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#c9a961]/30 text-[#c9a961] rounded-xl font-medium hover:bg-[#c9a961]/10 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-gradient-to-r from-[#c9a961] to-[#8b6914] text-[#1a1410] font-bold rounded-xl disabled:opacity-50 hover:shadow-lg hover:shadow-[#c9a961]/30 transition-all"
            >
              {submitting ? 'جاري النشر...' : 'نشر الرحلة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
 
// ============================================================
// Cards
// ============================================================
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#c9a961] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
 
function TripCard({
  trip,
  driver,
  myPendingOrders,
  onSelect,
}: {
  trip: Trip;
  driver: Profile | undefined;
  myPendingOrders: Order[];
  onSelect: (orderId: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
 
  return (
    <div className="bg-gradient-to-br from-[#2a1f18] to-[#1f1711] border border-[#c9a961]/20 rounded-2xl p-5 hover:border-[#c9a961]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6914] flex items-center justify-center text-[#1a1410] font-bold">
            {driver?.full_name?.[0] || '؟'}
          </div>
          <div>
            <p className="text-[#f5e6d3] font-bold">
              {driver?.full_name || 'كدّاد'}
            </p>
            <p className="text-xs text-[#c9a961]/60">{driver?.phone}</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-[11px] text-[#c9a961]/50">حد أدنى</p>
          <p className="text-[#c9a961] font-bold">{trip.min_price} ر.س</p>
        </div>
      </div>
 
      <div className="flex items-center gap-2 text-sm text-[#f5e6d3] mb-2">
        <span className="font-bold">{trip.from_city}</span>
        <span className="text-[#c9a961]">←</span>
        <span className="font-bold">{trip.to_city}</span>
      </div>
 
      <div className="flex flex-wrap gap-2 text-xs text-[#c9a961]/70 mb-4">
        <span>📅 {trip.trip_date}</span>
        <span>🕐 {trip.trip_time}</span>
        <span>📦 {trip.capacity}</span>
      </div>
 
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
          disabled={myPendingOrders.length === 0}
          className="w-full py-2.5 bg-[#c9a961] text-[#1a1410] font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#c9a961]/20 transition-all"
        >
          {myPendingOrders.length === 0
            ? 'أنشئ طلباً أولاً'
            : 'اختر هذا الكدّاد'}
        </button>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[#c9a961]">اختر الطلب المناسب:</p>
          {myPendingOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => onSelect(o.id)}
              className="w-full p-3 bg-[#1a1410] border border-[#c9a961]/30 rounded-xl text-right hover:bg-[#c9a961]/10 transition-colors"
            >
              <p className="text-[#f5e6d3] text-sm font-medium">
                {o.description}
              </p>
              <p className="text-xs text-[#c9a961]/60 mt-1">
                {o.from_city} ← {o.to_city} • {o.price} ر.س
              </p>
            </button>
          ))}
          <button
            onClick={() => setShowPicker(false)}
            className="w-full py-2 text-xs text-[#c9a961]/60 hover:text-[#c9a961]"
          >
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
}
 
function OrderCard({
  order,
  sender,
  onAccept,
}: {
  order: Order;
  sender: Profile | undefined;
  onAccept: () => void;
}) {
  const total = (order.price || 0) + (order.extra_fee || 0);
 
  return (
    <div className="bg-gradient-to-br from-[#2a1f18] to-[#1f1711] border border-[#c9a961]/20 rounded-2xl p-5 hover:border-[#c9a961]/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c9a961] to-[#8b6914] flex items-center justify-center text-[#1a1410] font-bold">
            {sender?.full_name?.[0] || '؟'}
          </div>
          <div>
            <p className="text-[#f5e6d3] font-bold">
              {sender?.full_name || 'مرسل'}
            </p>
            <p className="text-xs text-[#c9a961]/60">{sender?.phone}</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-[11px] text-[#c9a961]/50">المبلغ</p>
          <p className="text-[#c9a961] font-bold">{total} ر.س</p>
          {order.extra_fee ? (
            <p className="text-[10px] text-[#c9a961]/50">
              (شامل +{order.extra_fee})
            </p>
          ) : null}
        </div>
      </div>
 
      {order.image_url && (
        <img
          src={order.image_url}
          alt="غرض"
          className="w-full h-36 object-cover rounded-xl mb-3 border border-[#c9a961]/10"
        />
      )}
 
      <p className="text-[#f5e6d3] text-sm mb-2 line-clamp-2">
        {order.description}
      </p>
 
      <div className="flex items-center gap-2 text-sm text-[#f5e6d3] mb-2">
        <span className="font-bold">{order.from_city}</span>
        <span className="text-[#c9a961]">←</span>
        <span className="font-bold">{order.to_city}</span>
      </div>
 
      <div className="flex flex-wrap gap-2 text-xs text-[#c9a961]/70 mb-3">
        <span>📅 {order.delivery_date}</span>
        <span>🕐 {order.delivery_time}</span>
        <span>📦 {order.size}</span>
        <span>
          {order.pickup_type === 'home_pickup' ? '🏠 من البيت' : '📍 نقطة لقاء'}
        </span>
      </div>
 
      {order.pickup_type === 'home_pickup' && order.pickup_address && (
        <div className="p-2 bg-[#1a1410] rounded-lg text-xs text-[#c9a961]/80 mb-3">
          العنوان: {order.pickup_address}
        </div>
      )}
 
      <button
        onClick={onAccept}
        className="w-full py-2.5 bg-[#c9a961] text-[#1a1410] font-bold rounded-xl hover:shadow-lg hover:shadow-[#c9a961]/20 transition-all"
      >
        قبول الطلب
      </button>
    </div>
  );
}
 
function MyOrderCard({ order }: { order: Order }) {
  const total = (order.price || 0) + (order.extra_fee || 0);
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
    matched: 'bg-blue-900/30 text-blue-300 border-blue-500/30',
    delivered: 'bg-green-900/30 text-green-300 border-green-500/30',
  };
  const statusLabels: Record<string, string> = {
    pending: 'قيد البحث عن كدّاد',
    matched: 'تم الحجز',
    delivered: 'تم التوصيل',
  };
 
  return (
    <div className="bg-[#2a1f18] border border-[#c9a961]/20 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-[#f5e6d3]">
          <span className="font-bold">{order.from_city}</span>
          <span className="text-[#c9a961]">←</span>
          <span className="font-bold">{order.to_city}</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg text-[11px] border ${
            statusColors[order.status || 'pending']
          }`}
        >
          {statusLabels[order.status || 'pending']}
        </span>
      </div>
      <p className="text-[#c9a961]/80 text-sm mb-3 line-clamp-1">
        {order.description}
      </p>
      <div className="flex items-center justify-between text-xs text-[#c9a961]/60">
        <span>
          📅 {order.delivery_date} • 🕐 {order.delivery_time}
        </span>
        <span className="text-[#c9a961] font-bold">{total} ر.س</span>
      </div>
    </div>
  );
}
 
function MyTripCard({ trip }: { trip: Trip }) {
  const statusColors: Record<string, string> = {
    available: 'bg-green-900/30 text-green-300 border-green-500/30',
    matched: 'bg-blue-900/30 text-blue-300 border-blue-500/30',
    completed: 'bg-gray-900/30 text-gray-300 border-gray-500/30',
  };
  const statusLabels: Record<string, string> = {
    available: 'متاحة',
    matched: 'محجوزة',
    completed: 'مكتملة',
  };
 
  return (
    <div className="bg-[#2a1f18] border border-[#c9a961]/20 rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-sm text-[#f5e6d3]">
          <span className="font-bold">{trip.from_city}</span>
          <span className="text-[#c9a961]">←</span>
          <span className="font-bold">{trip.to_city}</span>
        </div>
        <span
          className={`px-2.5 py-1 rounded-lg text-[11px] border ${
            statusColors[trip.status || 'available']
          }`}
        >
          {statusLabels[trip.status || 'available']}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-[#c9a961]/60">
        <span>
          📅 {trip.trip_date} • 🕐 {trip.trip_time} • 📦 {trip.capacity}
        </span>
        <span className="text-[#c9a961] font-bold">
          من {trip.min_price} ر.س
        </span>
      </div>
    </div>
  );
}