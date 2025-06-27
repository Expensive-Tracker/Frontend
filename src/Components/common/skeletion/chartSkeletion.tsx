const ChartSkeleton = ({
  height = "h-80",
  span = "col-span-1",
  theme,
  title,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const cardBg = theme === "dark" ? "bg-[#27282E]/50" : "bg-white";
  const skeletonBg = theme === "dark" ? "bg-[#27282E]" : "bg-gray-300";
  const skeletonBgSecondary = theme === "dark" ? "bg-[#27282E]" : "bg-gray-200";

  return (
    <div
      className={`${cardBg} rounded-lg p-6 shadow-sm border ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      } ${span}`}
    >
      {/* Chart Title Skeleton */}
      <div className="mb-4">
        <div
          className={`h-6 ${skeletonBg} rounded animate-pulse w-40 mb-2`}
        ></div>
        <div
          className={`h-4 ${skeletonBgSecondary} rounded animate-pulse w-60`}
        ></div>
      </div>

      {/* Chart Content Skeleton */}
      <div className={`${height} flex items-center justify-center`}>
        {title === "pie" ? (
          <div
            className={`w-48 h-48 ${skeletonBg} rounded-full animate-pulse`}
          ></div>
        ) : (
          <div className="w-full h-full flex items-end justify-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`${skeletonBg} animate-pulse rounded-t w-8`}
                style={{ height: `${Math.random() * 60 + 40}%` }}
              ></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSkeleton;
