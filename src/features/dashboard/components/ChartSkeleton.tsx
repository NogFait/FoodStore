type ChartSkeletonProps = {
  title: string;
  height?: number;
};

export function ChartSkeleton({ title, height = 300 }: ChartSkeletonProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      {title ? (
        <h3 className="text-sm font-medium text-gray-300 mb-4">{title}</h3>
      ) : (
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
      )}
      <div
        className="bg-gray-100 rounded-lg w-full"
        style={{ height }}
      />
    </div>
  );
}
