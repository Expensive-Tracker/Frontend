import TransactionSkeleton from "./transactionSkeleton";

const TableSkeleton = ({ theme }: { theme: string }) => {
  const skeletonBg = theme === "dark" ? "bg-[#27282E]" : "bg-gray-300";
  const containerBg = theme === "dark" ? "bg-[#27282E]" : "bg-gray-200";

  return (
    <div
      className={`p-4 m-4 rounded-xl ${containerBg} shadow-sm border ${
        theme === "dark" ? "border-gray-700" : "border-gray-200"
      }`}
    >
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-6">
        <div className={`h-6 ${skeletonBg} rounded animate-pulse w-32`}></div>
        <div className={`h-4 ${skeletonBg} rounded animate-pulse w-24`}></div>
      </div>

      {/* Transaction List Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <TransactionSkeleton key={index} theme={theme} />
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;
