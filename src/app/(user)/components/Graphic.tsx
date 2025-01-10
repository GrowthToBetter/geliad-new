
import { Skeleton } from "@/app/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { FC } from "react";

export type TypeGraphics ={
  name:string,
  classes: string,
  nomination: string,
  number: string,
  date_time: Date
}

export function TopFiveData({
    title,
    label,
    data,
    className,
  }: {
    title: string;
    label: string;
    data: TypeGraphics[] | null;
    className?: string;
  }) {
    if (data === null || data.length === 0) return <GraphicsSkeleton className={className} />;
    return (
      <div
        className={cn(
          "col-span-12 md:col-span-5 shadow-sm my-1 shadow-gray-400 rounded-xl border border-slate-100 px-6 py-4",
          className,
        )}
      >
        <h5 className="text-black mb-4">{title}</h5>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <p className="text-gray-700">{label}</p>
          </div>
          {data.map((dataItem) => (
            <TopFiveDataItem key={dataItem.number} dataItem={dataItem} />
          ))}
        </div>
      </div>
    );
  }

const TopFiveDataItem = ({ dataItem }: { dataItem: TypeGraphics }) => (
    <div className="flex justify-between text-sm border-t border-solid border-gray-300 pt-2">
      <p className="text-gray-700 max-w-[80%] truncate text-sm">
        {dataItem.name} - {dataItem.classes} - <span className="text-gray-600 font-light">{`${dataItem.date_time}`}</span>
      </p>
      <div className="flex items-center">
        <p className="text-gray-700 ml-2">{dataItem.number} - {dataItem.nomination}</p>
      </div>
    </div>
  );

export const GraphicsSkeleton: FC<{className?: string}> = ({className}) => {
    return (
        <div
          className={cn(
            "col-span-3 shadow-sm my-1 shadow-gray-400 rounded-xl border border-slate-100 px-6 py-4",
            className,
          )}
        >
          <Skeleton className="h-6 w-1/3 mb-4 bg-gray-200" />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            {Array.from({ length: 3 }).map((_, skeletonIndex) => (
              <div
                key={skeletonIndex}
                className="flex justify-between text-sm border-t border-solid border-gray-300 pt-2"
              >
                <Skeleton className="h-4 w-3/4 max-w-[80%] truncate bg-gray-200" />
                <div className="flex items-center">
                  <Skeleton className="h-4 w-12 mr-2 bg-gray-200" />
                  <Skeleton className="h-4 w-8 bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
};
