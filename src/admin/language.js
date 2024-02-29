import React from "react";
import {Select} from "antd";
import {observer} from "mobx-react-lite";
import {useTranslation} from "react-i18next";
import {setLocalStorage, getLocalStorage} from "../utils";
import {langOptions} from "../utils";


const Language = observer(() => {
  const {t, i18n} = useTranslation();
  const [transLang, setTransLang] = React.useState("Auto");

  const handleLangChange = (value) => {
    console.log(value);
    i18n.changeLanguage(value);
    setLocalStorage("language", value);
  };

  const handleTransLangChange = (value, e) => {
    setLocalStorage("transLang", e.label);
  }

  React.useEffect(() => {
    getLocalStorage("transLang")
        .then((res) => {
          console.log(res);
          if (res) {
            setTransLang(res);
          }
        });
  }, []);

  return (
      <div>
        <div className="w-full flex flex-col">
          <div className="flex flex-col xl:max-w-[70%]">
            <div className="title text-[24px] font-bold leading-[18px] mb-[24px]">
              {t("setting.lang.title1")}
            </div>
            <div className="flex flex-row justify-between items-center bg-white rounded-[10px] py-[16px] px-[16px]">

              <div className="flex flex-col">
                <p className="font text-base">
                  {t("setting.lang.label")}
                  {/*languages && languages.setting.lang.label*/}
                </p>
                <p className="text-sm text-[#3f3f3f] mt-1">
                  {t("setting.lang.label1desc")}
                  {/*languages && languages.setting.lang.label1desc*/}
                </p>
              </div>

              <Select
                  defaultValue={i18n.language || "Auto"}
                  options={langOptions}
                  style={{width: 160}}
                  onChange={handleLangChange}
              />
            </div>
          </div>

          <div className="flex flex-col xl:max-w-[70%] mt-10">
            <div className="title text-[24px] font-bold leading-[18px] mb-[24px]">
              {t("setting.lang.trans")}
            </div>
            <div className="flex flex-row justify-between items-center bg-white rounded-[10px] py-[16px] px-[16px]">

              <div className="flex flex-col">
                <p className="font text-base">
                  {t("setting.lang.transDesc")}
                  {/*languages && languages.setting.lang.label*/}
                </p>
                <p className="text-sm text-[#3f3f3f] mt-1">
                  {t("setting.lang.transDesc2")}
                  {/*languages && languages.setting.lang.label1desc*/}
                </p>
              </div>

              <Select
                  key={transLang}
                  defaultValue={transLang}
                  options={langOptions}
                  style={{width: 160}}
                  onChange={handleTransLangChange}
              />
            </div>
          </div>

        </div>
      </div>
  )
});

export default Language;