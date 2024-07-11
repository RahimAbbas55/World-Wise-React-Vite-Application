import { useSearchParams } from "react-router-dom";

export function useUrlPosition(){
    const [searchParams] = useSearchParams();
    const lat = searchParams.get("lat"),lng = searchParams.get("lng");
    return [lat ,lng]
}