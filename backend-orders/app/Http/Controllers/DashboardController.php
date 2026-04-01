&lt;?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats()
    {
        $totalOrders = Order::count();
        $completedOrders = Order::where('status', 'completed')->count();
        $pendingOrders = Order::where('status', 'pending')->count();
        $cancelledOrders = Order::where('status', 'cancelled')->count();
        $totalCustomers = Customer::count();
        $totalRevenue = Order::whereIn('status', ['completed', 'pending'])->sum('total_amount');
        $monthlyRevenue = Order::whereMonth('created_at', now()->month)->sum('total_amount');

        return response()->json([
            'totalOrders' => $totalOrders,
            'completedOrders' => $completedOrders,
            'pendingOrders' => $pendingOrders,
            'cancelledOrders' => $cancelledOrders,
            'totalCustomers' => $totalCustomers,
            'activeCustomers' => $totalCustomers,
            'totalRevenue' => $totalRevenue,
            'monthlyRevenue' => $monthlyRevenue
        ], 200);
    }

    /**
     * Get order activity chart data.
     */
    public function orderActivity()
    {
        $orders = Order::selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('created_at', '>=', now()->subDays(30))
            ->groupBy('date')
            ->get();

        $labels = $orders->pluck('date')->toArray();
        $data = $orders->pluck('count')->toArray();

        return response()->json([
            'labels' => $labels,
            'data' => $data,
            'title' => 'Order Activity (Last 30 Days)'
        ], 200);
    }

    /**
     * Get revenue chart data.
     */
    public function revenueChart()
    {
        $revenue = Order::selectRaw('MONTH(created_at) as month, SUM(total_amount) as amount')
            ->whereYear('created_at', now()->year)
            ->groupBy('month')
            ->get();

        $labels = $revenue->map(fn($r) => now()->setMonth($r->month)->format('M'))->toArray();
        $data = $revenue->pluck('amount')->map(fn($a) => round($a, 2))->toArray();

        return response()->json([
            'labels' => $labels,
            'data' => $data,
            'title' => 'Monthly Revenue'
        ], 200);
    }
}
