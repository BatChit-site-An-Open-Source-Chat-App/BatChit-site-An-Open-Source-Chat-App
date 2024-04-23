import { useLocation } from "react-router-dom";

export function getLocation() {
  const location = useLocation();
  const { pathname } = location;
  return pathname.replace("/", "");
}
