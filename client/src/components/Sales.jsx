import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSellerOrderes } from "../store/slices/orderSlice";
import SellerNavbar from "../layout/SellerNavbar.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const Sales = ({ db }) => {
  const dispatch = useDispatch();
  const { loading, orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSellerOrderes());
  }, [dispatch]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const categories = [
    "Men",
    "Women",
    "Kids",
    "Beauty",
    "Electronics",
    "Home-furniture",
    "Grocery",
    "Art-crafts",
    "Books",
  ];

  const getData = (orders) => {
    const monthData = Array(12)
      .fill(null)
      .map(() => {
        const categoryTotals = categories.reduce((acc, category) => {
          acc[category] = 0;
          return acc;
        }, {});
        return { ...categoryTotals, total: 0, totalprice: 0 };
      });

    let pendingCount = 0,
      cancelledCount = 0;

    orders.forEach((order) => {
      const date = new Date(order.orderDate);
      const month = date.getMonth();
      const category = order.product.category;
      const price = order.product.price;

      if (categories.includes(category)) {
        monthData[month][category] += price;
      }
      monthData[month].total += 1;
      monthData[month].totalprice += price;

      if (order.status === "pending") pendingCount++;
      else if (order.status === "cancelled") cancelledCount++;
    });

    return {
      monthWiseData: monthNames.map((month, index) => ({
        name: month,
        ...monthData[index],
      })),
      statusData: [
        { name: "Pending", value: pendingCount },
        { name: "Cancelled", value: cancelledCount },
      ],
      categoryWiseData: categories.map((category) => ({
        name: category,
        total: orders.filter((order) => order.product.category === category)
          .length,
      })),
    };
  };

  const { monthWiseData, statusData, categoryWiseData } = getData(orders);

  const STATUS_COLORS = ["#0088FE", "#FF0000"];
  const CATEGORY_COLORS = [
    "#0088FE",
    "#FF0000",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28CFF",
    "#FF6B6B",
    "#6A0572",
    "#B5B5B5",
  ];

  return (
    <>
      {db && <SellerNavbar />}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        {loading && <p className="text-green-500">loading...</p>}

        <div className="h-[350px] md:col-span-2 flex flex-col items-center border border-black/5 dark:border-white/5   rounded-lg p-2">
          <h2 className="mb-2">Category-wise Total Orders</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryWiseData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="total"
                label
              >
                {categoryWiseData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[350px] flex flex-col items-center border border-black/5 dark:border-white/5   rounded-lg p-2">
          <h2>Month-wise Category Sales</h2>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthWiseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[350px] flex flex-col items-center border border-black/5 dark:border-white/5   rounded-lg p-2">
          <h2>Month-wise Orders</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthWiseData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-[350px] flex flex-col items-center border border-black/5 dark:border-white/5   rounded-lg p-2">
          <h2 className="mb-2">Status-wise Sale</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={STATUS_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Sales;
