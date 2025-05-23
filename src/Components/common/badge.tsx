type BadgeProps = {
  children: React.ReactNode;
  color?: "success" | "error" | "warning" | "primary" | "gray";
};

const colorClasses: Record<string, string> = {
  success: "bg-green-100 text-green-800",
  error: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  primary: "bg-blue-100 text-blue-800",
  gray: "bg-gray-100 text-gray-800",
};

const Badge: React.FC<BadgeProps> = ({ children, color = "gray" }) => {
  const classes = colorClasses[color] || colorClasses.gray;
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${classes}`}
    >
      {children}
    </span>
  );
};

export default Badge;
