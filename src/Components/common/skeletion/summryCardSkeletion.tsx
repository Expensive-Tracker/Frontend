const SummaryCardSkeleton = ({ theme }: { theme: string }) => {
  const cardBg = theme === "dark" ? "bg-[#27282E]/50" : "bg-white";
  const skeletonBg = theme === "dark" ? "bg-[#27282E]" : "bg-gray-300";
  const skeletonBgSecondary = theme === "dark" ? "bg-[#27282E]" : "bg-gray-200";

  return (
    <div
      className={`${cardBg} rounded-lg p-6 shadow-sm border ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div
            className={`h-4 ${skeletonBgSecondary} rounded animate-pulse mb-2 w-20`}
          ></div>
          <div className={`h-8 ${skeletonBg} rounded animate-pulse w-24`}></div>
        </div>
        <div
          className={`w-10 h-10 ${skeletonBg} rounded-full animate-pulse`}
        ></div>
      </div>
    </div>
  );
};

export default SummaryCardSkeleton;
