import { TfiHome } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { FiBarChart } from "react-icons/fi";
import { navItemInterface } from "../util/interface/props";

const navItem: navItemInterface[] = [
  {
    id: 1,
    navName: "Dashboard",
    path: "/",
    icon: <TfiHome />,
  },
  {
    id: 2,
    navName: "Transaction List",
    path: "/transaction",
    icon: <CiViewList />,
  },
  {
    id: 3,
    navName: "Analysis",
    path: "/analysis",
    icon: <FiBarChart />,
  },
];

export default navItem;
