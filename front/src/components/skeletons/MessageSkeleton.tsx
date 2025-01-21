const MessageSkeleton = () => {
  const skeletonMessages = Array(10).fill(null);

  return (
    <div className="overflow-y-hidden flex-1 p-4 space-y-4 bg-base-100">
      <div>
        {skeletonMessages.map((_, idx) => (
          <div
            key={crypto.randomUUID()}
            className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full">
                <div className="skeleton w-full h-full rounded-full" />
              </div>
            </div>

            <div className="chat-header mb-1">
              <div className="skeleton h-4 w-16" />
            </div>

            <div className="chat-bubble bg-transparent p-0">
              <div className="skeleton h-16 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageSkeleton;
