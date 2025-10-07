import { useAuth } from "../context/AuthContext";
import { useEarthquakesData } from "../hooks/useEarthquakeData";
import Auth from "../components/Auth";
import Charts from "../components/Charts";
import Map from "../components/Map";

export default function Dashboard() {
  const { logout } = useAuth();
  const { data, isLoading } = useEarthquakesData();

  return (
    <Auth>
      <div className="p-4 space-y-4">
        <header className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-center bg-gradient-to-r from-green-600 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Earthquake Dashboard
          </h1>

          <button
            onClick={logout}
            className="px-5 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Logout
          </button>
        </header>

        {isLoading && <p>Loading data...</p>}

        {data && (
          <>
            <Map earthquakes={data} />
            <Charts earthquakes={data} />
          </>
        )}
      </div>
    </Auth>
  );
}
