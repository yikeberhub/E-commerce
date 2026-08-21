import React from "react";

export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="p-3 flex flex-col gap-2">
      <Skeleton className="h-2.5 w-1/3" />
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="h-4 w-1/2 mt-1" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({
  count = 10,
  columns = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
}) => (
  <div className={`grid ${columns} gap-4 md:gap-6 w-full`}>
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const RowSkeleton = ({ count = 4 }) => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 bg-white rounded-xl border border-slate-100 p-3"
      >
        <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md shrink-0" />
      </div>
    ))}
  </div>
);

export const DetailHeroSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-card overflow-hidden">
    <Skeleton className="h-36 sm:h-48 w-full rounded-none" />
    <div className="px-5 sm:px-8 pb-6">
      <Skeleton className="w-24 h-24 rounded-2xl border-4 border-white -mt-12" />
      <Skeleton className="h-6 w-1/3 mt-4" />
      <Skeleton className="h-3.5 w-1/2 mt-3" />
      <Skeleton className="h-3.5 w-2/3 mt-4" />
    </div>
  </div>
);

export const StatRowSkeleton = ({ count = 5 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-xl border border-slate-100 shadow-card px-4 py-3 flex items-center gap-3"
      >
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-2.5 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const TextBlockSkeleton = ({ lines = 3 }) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-3.5 ${i === lines - 1 ? "w-1/2" : "w-full"}`}
      />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 p-4">
    <div className="col-span-1 md:col-span-4 bg-white shadow-card border border-slate-100 rounded-xl p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="w-full md:w-2/5 h-72 rounded-xl shrink-0" />
        <div className="w-full md:w-3/5 flex flex-col gap-3">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-1/3 mt-2" />
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
    <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
      <Skeleton className="h-40 rounded-xl" />
      <Skeleton className="h-56 rounded-xl" />
    </div>
  </div>
);

export default Skeleton;
