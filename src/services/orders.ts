import { supabase } from '@/lib/supabase';
import type { Order, OrderItem, Product } from '@/types';

type CartLine = { product: Product; quantity: number };

export async function createOrder(params: {
  userId: string;
  lines: CartLine[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: Record<string, string>;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
}): Promise<{ order: Order | null; error: string | null }> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: params.userId,
      subtotal: params.subtotal,
      shipping_cost: params.shippingCost,
      total: params.total,
      shipping_address: params.shippingAddress,
      customer_email: params.customerEmail,
      customer_name: params.customerName,
      customer_phone: params.customerPhone,
      notes: params.notes ?? null,
    })
    .select('*')
    .single();

  if (orderError) {
    return { order: null, error: orderError.message };
  }

  const order = orderData as unknown as Order;

  const orderItems = params.lines.map((line) => ({
    order_id: order.id,
    product_id: line.product.id,
    product_name: line.product.name,
    product_image:
      line.product.product_images?.[0]?.image_url ?? null,
    price: line.product.price,
    quantity: line.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) {
    return { order: null, error: itemsError.message };
  }

  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', params.userId);

  return { order, error: null };
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Order[];
}

export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as unknown as Order[];
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  return { error: error?.message ?? null };
}

export type { OrderItem };
