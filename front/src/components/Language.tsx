import i18n from "../i18n";
import { useThemeStore } from "../store/useThemeStore";

const Language = () => {
  const { setLanguage } = useThemeStore();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <div className="dropdown dropdown-bottom dropdown-end absolute top-4 right-4">
      <button tabIndex={0} type="button" className="btn m-1">
        <img className="size-5" src="/language.svg" alt="" />
      </button>
      <ul
        className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow"
      >
        <li>
          <button type="button" onClick={() => changeLanguage("pt")}>pt</button>
        </li>
        <li>
          <button type="button" onClick={() => changeLanguage("en")}>en</button >
        </li>
      </ul>
    </div>
  );
};

export default Language;
