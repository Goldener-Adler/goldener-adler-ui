import {useEffect, useState} from "react";
import {API_ENDPOINT} from "@/assets/consts.ts";

type Occupancy = {
  occupied: number,
  free: number,
}

export const useGetOccupancy = () => {
  const [occupancy, setOccupancy] = useState<Occupancy>({occupied: 0, free: 0});
  const [loading, setLoading] = useState(false);

  const getOccupancy = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        API_ENDPOINT + "/occupancy",
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const result: Occupancy = await response.json();
      setOccupancy(result);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getOccupancy();
  }, []);

  return { occupancy , loading}
}