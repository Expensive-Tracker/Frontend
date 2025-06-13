const SubCategorySkeleton = ({ theme }: { theme: "light" | "dark" }) => {
  const skeletonColor = theme === "dark" ? "bg-zinc-800" : "bg-gray-200";
  const shimmerColor =
    theme === "dark"
      ? "from-zinc-800 via-zinc-700 to-zinc-800"
      : "from-gray-200 via-gray-100 to-gray-200";

  return (
    <div
      className={`w-full ${skeletonColor} rounded-2xl p-6 space-y-6 animate-pulse overflow-hidden relative`}
    >
      <div
        className={`absolute inset-0 z-10 animate-shimmer rounded-2xl ${shimmerColor} opacity-50`}
      ></div>

      <div className="flex items-center w-full justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${skeletonColor} h-9 w-9`}></div>
          <div>
            <div className={`h-5 w-40 ${skeletonColor} rounded mb-2`}></div>
            <div className={`h-3 w-24 ${skeletonColor} rounded`}></div>
          </div>
        </div>
        <div className={`p-2 rounded-lg ${skeletonColor} h-8 w-8`}></div>
      </div>

      <div className="space-y-3">
        <div className={`h-4 w-full ${skeletonColor} rounded`}></div>
        <div className="flex justify-between text-sm">
          <div className={`h-3 w-20 ${skeletonColor} rounded`}></div>
          <div className={`h-3 w-20 ${skeletonColor} rounded`}></div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`${skeletonColor} rounded-xl p-4 border-l-4 flex-auto border-transparent`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-4 w-4 ${skeletonColor} rounded-full`}></div>
              <div className={`h-3 w-24 ${skeletonColor} rounded`}></div>
            </div>
            <div className={`h-6 w-32 ${skeletonColor} rounded`}></div>
          </div>
        ))}
      </div>
      <div
        className={`flex items-center justify-between p-3 rounded-lg ${skeletonColor}`}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${skeletonColor}`}></div>
          <div className={`h-4 w-28 ${skeletonColor} rounded`}></div>
        </div>
        <div className={`h-4 w-20 ${skeletonColor} rounded`}></div>
      </div>
    </div>
  );
};

export default SubCategorySkeleton;
