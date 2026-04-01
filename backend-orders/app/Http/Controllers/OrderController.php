&lt;?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $query = Order::with('orderItems', 'customer');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        if ($request->has('start_date')) {
            $query->whereDate('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->whereDate('created_at', '<=', $request->end_date);
        }

        return response()->json($query->get(), 200);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0'
        ]);

        $totalAmount = 0;
        foreach ($validated['items'] as $item) {
            $totalAmount += $item['quantity'] * $item['unit_price'];
        }

        $order = Order::create([
            'customer_id' => $validated['customer_id'],
            'order_number' => 'ORD-' . time(),
            'status' => 'pending',
            'total_amount' => $totalAmount
        ]);

        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_name' => $item['product_name'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'total' => $item['quantity'] * $item['unit_price']
            ]);
        }

        return response()->json($order->load('orderItems'), 201);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        return response()->json($order->load('orderItems', 'customer'), 200);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'items' => 'sometimes|array|min:1',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0'
        ]);

        if (isset($validated['items'])) {
            OrderItem::where('order_id', $order->id)->delete();

            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $total = $item['quantity'] * $item['unit_price'];
                $totalAmount += $total;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total' => $total
                ]);
            }

            $order->update(['total_amount' => $totalAmount]);
        }

        return response()->json($order->load('orderItems'), 200);
    }

    /**
     * Update order status.
     */
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,completed,cancelled'
        ]);

        $order->update([
            'status' => $validated['status'],
            'completed_at' => $validated['status'] === 'completed' ? now() : null
        ]);

        return response()->json($order, 200);
    }

    /**
     * Remove the specified order.
     */
    public function destroy(Order $order)
    {
        OrderItem::where('order_id', $order->id)->delete();
        $order->delete();
        return response()->json(null, 204);
    }
}
