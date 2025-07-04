import { TfiHome } from "react-icons/tfi";
import { CiViewList } from "react-icons/ci";
import { FiBarChart } from "react-icons/fi";
import { navItemInterface } from "../interface/props";
import { MdOutlineSavings } from "react-icons/md";

const navItem: navItemInterface[] = [
  {
    id: 1,
    navName: "Dashboard",
    path: "/",
    icon: <TfiHome />,
  },
  {
    id: 2,
    navName: "Budgets",
    path: "/budget",
    icon: <MdOutlineSavings />,
  },
  {
    id: 3,
    navName: "Transaction List",
    path: "/transaction",
    icon: <CiViewList />,
  },
  {
    id: 4,
    navName: "Analysis",
    path: "/analysis",
    icon: <FiBarChart />,
  },
];

export const authPath: string[] = ["/auth/signin", "/auth/signup"];

export default navItem;
