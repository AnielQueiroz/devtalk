const SidebarSkeleton = () => {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full border-r border-base-200 
    flex flex-col transition-all duration-200"
    >
      {/* Skeleton Contacts */}
      <div className="overflow-y-hidden w-full py-3">
        {skeletonContacts.map(() => (
          <div
            key={crypto.randomUUID()}
            className="w-full p-3 flex items-center gap-3"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
