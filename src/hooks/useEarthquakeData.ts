import { useQuery } from "@tanstack/react-query";

const fetchEarthquakesData = async () => {

  const res = await fetch(`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`)

  const data = await res.json()

  const mappedData = data.features.map((feat: any) => ({
    id: feat.id,
    magnitude: feat.properties.mag,
    place: feat.properties.place,
    time: feat.properties.time,
    depth: feat.geometry.coordinates[2],
    coords: [feat.geometry.coordinates[1], feat.geometry.coordinates[0]],
  }))

  console.log('yoyo1', mappedData)

  return mappedData
}

export const useEarthquakesData = () => (useQuery({ queryKey: ['earthquakes'], queryFn: fetchEarthquakesData, refetchInterval: 30000}))