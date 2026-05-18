import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const SharedSkeletonTheme = ({ children }: { children: React.ReactNode }) => (
  <SkeletonTheme baseColor="#f1f5f9" highlightColor="#e2e8f0" borderRadius="1rem" duration={1.5}>
    {children}
  </SkeletonTheme>
);

export const ListingCardSkeleton = () => (
  <SharedSkeletonTheme>
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton className="w-full h-full absolute inset-0 !rounded-none" />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <Skeleton width="85%" height={24} />
        <Skeleton width="40%" height={24} className="my-1" />
        <div className="flex items-center gap-3 mt-1">
          <Skeleton width={60} height={16} />
          <Skeleton width={80} height={16} />
        </div>
      </div>
    </div>
  </SharedSkeletonTheme>
);

export const SearchCardSkeleton = () => (
  <SharedSkeletonTheme>
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 flex flex-col sm:flex-row h-[250px] sm:h-[220px]">
      <div className="w-full sm:w-64 h-48 sm:h-full shrink-0 p-2">
        <Skeleton className="w-full h-full !rounded-xl" />
      </div>
      <div className="p-5 flex flex-col justify-between flex-1">
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            <Skeleton width="60%" height={24} />
            <Skeleton width="20%" height={28} className="rounded-xl" />
          </div>
          <Skeleton width="40%" height={16} className="mb-4" />
          <div className="flex gap-4">
            <Skeleton width={80} height={24} />
            <Skeleton width={80} height={24} />
            <Skeleton width={80} height={24} />
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <Skeleton circle width={32} height={32} />
            <div>
              <Skeleton width={60} height={12} className="mb-1" />
              <Skeleton width={80} height={10} />
            </div>
          </div>
          <Skeleton width={100} height={36} className="rounded-xl" />
        </div>
      </div>
    </div>
  </SharedSkeletonTheme>
);

export const OrderCardSkeleton = () => (
  <SharedSkeletonTheme>
    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm flex flex-col lg:flex-row h-auto lg:h-[300px]">
      <div className="lg:w-2/3 p-4 sm:p-7 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50">
            <Skeleton width={150} height={24} className="rounded-xl" />
            <Skeleton width={100} height={24} className="rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
               <div className="flex-1">
                 <Skeleton width="60%" height={20} className="mb-2" />
                 <Skeleton width="30%" height={16} />
               </div>
               <Skeleton width={80} height={24} />
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Skeleton width="40%" height={16} className="mb-2" />
          <Skeleton width="80%" height={14} />
        </div>
      </div>
      <div className="lg:w-1/3 bg-slate-50/50 p-7 flex flex-col justify-between">
        <Skeleton width="50%" height={16} className="mb-4" />
        <Skeleton width="80%" height={40} className="mb-8" />
        <div className="mt-auto">
          <Skeleton width="100%" height={48} className="rounded-2xl" />
        </div>
      </div>
    </div>
  </SharedSkeletonTheme>
);

export const ListingDetailSkeleton = () => (
  <SharedSkeletonTheme>
    <div className="flex flex-col gap-6 w-full">
      <Skeleton width="30%" height={20} className="mb-2" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <Skeleton className="w-full aspect-video !rounded-xl mb-4" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-video !rounded-lg" />)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Skeleton width="80%" height={36} className="mb-4" />
            <Skeleton width="40%" height={24} className="mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-gray-100">
              {[1, 2, 3, 4].map(i => <Skeleton key={i} height={48} className="!rounded-lg" />)}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <Skeleton width="30%" height={24} className="mb-4" />
             <Skeleton count={4} className="mb-2" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <Skeleton circle width={80} height={80} className="mb-4" />
            <Skeleton width={150} height={24} className="mb-2" />
            <Skeleton width={100} height={16} className="mb-6" />
            <Skeleton width="100%" height={48} className="!rounded-xl mb-3 w-full" />
            <Skeleton width="100%" height={48} className="!rounded-xl w-full" />
          </div>
        </div>
      </div>
    </div>
  </SharedSkeletonTheme>
);

export const StoreDetailSkeleton = () => (
  <SharedSkeletonTheme>
    <div className="flex flex-col gap-6 w-full">
      <Skeleton width="40%" height={20} className="mb-2" />
      <div className="bg-white rounded-[40px] w-full shadow-sm overflow-hidden flex flex-col lg:flex-row relative border border-slate-100 mb-12">
         <div className="w-full lg:w-[60%] border-r border-slate-100 p-4 sm:p-8">
            <Skeleton className="w-full aspect-video lg:aspect-[4/3] !rounded-3xl mb-6" />
            <div className="flex items-center justify-center gap-3">
               {[1, 2, 3, 4].map(i => <Skeleton key={i} width={80} height={80} className="!rounded-2xl" />)}
            </div>
            <div className="mt-10">
               <Skeleton width="70%" height={40} className="mb-4" />
               <Skeleton width="40%" height={40} className="mb-8" />
               <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} height={64} className="!rounded-xl" />)}
               </div>
            </div>
         </div>
         <div className="w-full lg:w-[40%] sm:p-10 p-6 flex flex-col gap-8">
            <Skeleton height={150} className="!rounded-3xl" />
            <Skeleton height={200} className="!rounded-3xl" />
            <Skeleton height={60} className="!rounded-[20px]" />
            <Skeleton height={60} className="!rounded-[20px]" />
         </div>
      </div>
    </div>
  </SharedSkeletonTheme>
);
