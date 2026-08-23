import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, Mail, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    customers: 0,
    contactSubmissions: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<{ order_number: string; total: number; status: string; created_at: string; customer_name: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [products, orders, customers, contacts] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total, status'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      ]);

      const orderData = orders.data ?? [];
      const revenue = orderData.reduce((sum, o) => sum + Number(o.total), 0);
      const pending = orderData.filter((o) => o.status === 'pending').length;

      setStats({
        products: products.count ?? 0,
        orders: orderData.length,
        revenue,
        customers: customers.count ?? 0,
        contactSubmissions: contacts.count ?? 0,
        pendingOrders: pending,
      });

      const { data: recent } = await supabase
        .from('orders')
        .select('order_number, total, status, created_at, customer_name')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentOrders(recent ?? []);
      setLoading(false);
    })();
  }, []);

  const cards = [
    { label: 'Products', value: stats.products, icon: Package, link: '/admin/products' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, link: '/admin/orders' },
    { label: 'Revenue', value: formatPrice(stats.revenue), icon: TrendingUp, link: '/admin/orders' },
    { label: 'Customers', value: stats.customers, icon: Users, link: '/admin/customers' },
    { label: 'New Messages', value: stats.contactSubmissions, icon: Mail, link: '/admin/contact' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: Clock, link: '/admin/orders' },
  ];

  if (loading) {
    return <div className="text-sm text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-serif text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white p-6 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className="text-gray-400" strokeWidth={1.5} />
              </div>
              <p className="text-2xl font-serif text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{card.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.order_number} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-xs text-gray-500">{order.customer_name ?? 'Unknown'} · {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{formatPrice(Number(order.total))}</p>
                  <span className="text-xs text-gray-500 uppercase">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
