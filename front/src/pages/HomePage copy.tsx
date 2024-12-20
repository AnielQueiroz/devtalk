import { useChatStore } from "../store/useChatStore";

import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/AppSidebar";

const HomePage = () => {
	const { selectedUser } = useChatStore();

	return (
		<div className="h-screen bg-base-200">
			<div className="flex items-center justify-center pt-20 px-4">
				<div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
					<div className="flex h-full rounded-lg overflow-hidden">
						{/* <Sidebar /> */}
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger />
						  {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </SidebarProvider>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
