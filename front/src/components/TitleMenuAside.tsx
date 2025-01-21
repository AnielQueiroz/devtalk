import { t } from "i18next";
import type React from "react";

interface Props {
    icon: React.ReactNode;
    title: string;
}

const TitleMenuAside: React.FC<Props> = ({ icon, title }) => {
    return (
        <div className="flex items-center justify-center gap-2 py-[18px] border-b border-primary/30 shrink-0">
            {icon}
            <h1 className="text-lg font-bold">{t(title)}</h1>
        </div>
    );
};

export default TitleMenuAside;
