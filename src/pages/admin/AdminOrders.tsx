import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/utils/format';
import type { Order } from '@/types';

const STATUS_OPTIONS: Order['status'][] = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'];

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: Order['status']) {
    await supabase.from('orders').update({ status }).eq('id', id);
    loadOrders();
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-serif text-gray-900 mb-8">Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setFilter('all')} className={`px-3 py-1 text-xs ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>All</button>
        {STATUS_OPTIONS.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 text-xs capitalize ${filter === s ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>{s}</button>
        ))}
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading...</p> : filtered.length === 0 ? (
        <p className="text-sm text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white border border-gray-200 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.created_at).toLocaleString()} · {order.customer_name} · {order.customer_email}
                  </p>
                  {order.customer_phone && <p className="text-xs text-gray-500">{order.customer_phone}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as Order['status'])}
                    className="border border-gray-300 px-2 py-1 text-xs outline-none focus:border-gray-900"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <p className="font-serif text-lg text-gray-900">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-100">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    {item.product_image && <img src={item.product_image} alt="" className="w-10 h-12 object-cover" />}
                    <span className="flex-1 text-gray-700">{item.product_name}</span>
                    <span className="text-gray-500">×{item.quantity}</span>
                    <span className="text-gray-700">{formatPrice(item.price)}</span>
                  </div>
                ))}
              </div>
              {order.shipping_address && (
                <div className="pt-4 mt-4 border-t border-gray-100 text-xs text-gray-500">
                  <p className="uppercase tracking-wider mb-1">Shipping Address</p>
                  <p>{order.shipping_address.address}, {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
