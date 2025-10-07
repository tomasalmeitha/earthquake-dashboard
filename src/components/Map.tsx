import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

type Earthquake = {
  id: string;
  magnitude: number;
  depth: number;
  place: string;
  time: number;
  coords: [number, number];
};

type Props = {
  earthquakes: Earthquake[];
  onSelect?: (eq: Earthquake) => void;
};

export default function Map({ earthquakes, onSelect }: Props) {
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  function getColorByMagnitude(mag: number): Cesium.Color {
    if (mag < 3)
      return Cesium.Color.fromCssColorString("#00ff00").withAlpha(0.9);
    if (mag < 5)
      return Cesium.Color.fromCssColorString("#ffaa00").withAlpha(0.9);
    if (mag < 7)
      return Cesium.Color.fromCssColorString("#ff4500").withAlpha(0.9);
    return Cesium.Color.fromCssColorString("#ff0000").withAlpha(0.95);
  }

  useEffect(() => {
    if (!containerRef.current) return;

    if (!viewerRef.current) {
      viewerRef.current = new Cesium.Viewer(containerRef.current, {
        terrain: Cesium.Terrain.fromWorldTerrain(),
        baseLayerPicker: true,
      });
    }

    const viewer = viewerRef.current;
    viewer.entities.removeAll();

    earthquakes.forEach((eq) => {
      const magnitudeColor = getColorByMagnitude(eq.magnitude);
      const entity = viewer.entities.add({
        id: eq.id,
        position: Cesium.Cartesian3.fromDegrees(eq.coords[1], eq.coords[0]),
        point: {
          pixelSize: Math.max(eq.magnitude * 4, 10),
          color: magnitudeColor,
          outlineColor: Cesium.Color.WHITE.withAlpha(0.8),
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
          text: `${eq.magnitude.toFixed(1)}`,
          font: "14px sans-serif",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(0, -15),
        },
      });

      entity.description = new Cesium.ConstantProperty(`
        <h3>${eq.place}</h3>
        <p>Magnitude: ${eq.magnitude}</p>
        <p>Depth: ${eq.depth} km</p>
        <p>Time: ${new Date(eq.time).toLocaleString()}</p>
      `);
    });

    viewer.flyTo(viewer.entities);

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: any) => {
      const picked = viewer.scene.pick(click.position);
      if (Cesium.defined(picked) && picked.id) {
        const eq = earthquakes.find((e) => e.id === picked.id.id);
        if (eq && onSelect) onSelect(eq);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  }, [earthquakes, onSelect]);

  return <div ref={containerRef} className="w-full h-[500px] rounded shadow" />;
}
