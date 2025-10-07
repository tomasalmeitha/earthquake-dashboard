import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function EarthquakeChart({
  earthquakes,
}: {
  earthquakes: any[];
}) {
  if (!earthquakes || earthquakes.length === 0) {
    return (
      <div className="bg-white p-4 rounded shadow">No data to display!</div>
    );
  }

  const data = earthquakes.map((eq) => ({
    name: new Date(eq.time).toLocaleTimeString(),
    magnitude: eq.magnitude,
  }));

  return (
    <div className="bg-white p-4 rounded shadow">
        <h2 className="text-2xl p-4 font-extrabold tracking-tight text-start bg-gradient-to-r from-red-600 via-indigo-500 to-red-500 bg-clip-text text-transparent">
          Magnitude Over Time
        </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval="preserveStartEnd" textAnchor="end" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="magnitude" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
