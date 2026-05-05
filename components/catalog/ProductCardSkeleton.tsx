import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

export const ProductCardSkeleton = () => {
  return (
    <Card className="overflow-hidden p-0 flex flex-col h-full border-neutral-100 shadow-sm bg-white animate-pulse">
      <div className="w-full aspect-square bg-neutral-100" />
      <CardContent className="p-4 flex flex-col flex-1 space-y-3">
        <div className="h-4 w-1/3 bg-neutral-100 rounded-full" />
        <div className="h-6 w-full bg-neutral-100 rounded-lg" />
        <div className="h-4 w-2/3 bg-neutral-100 rounded-full" />
        <div className="mt-auto pt-4 flex gap-2">
          <div className="h-10 flex-1 bg-neutral-100 rounded-xl" />
          <div className="h-10 w-10 bg-neutral-100 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
};
