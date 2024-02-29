import React from "react";
import { Input, Button, Collapse, theme} from "antd";
import { ExportOutlined } from "@ant-design/icons";
import {useTranslation} from "react-i18next";

import { getGeminiAPIKey, setGeminiAPIKey, getGeminiHost, setGeminiHost, GeminiDefaultHost } from "../hook/gemini";


const Gemini = () => {
  const { t } = useTranslation();
  const [key, setKey] = React.useState("");
  const [host, setHost] = React.useState("");

  React.useEffect(() => {

    const init = async () => {
      const key = await getGeminiAPIKey();
      const host = await getGeminiHost();

      console.log("初始化 key 与 host -> ", key, host);
      setKey(key);
      if (!host) {
        setHost(GeminiDefaultHost);
        return;
      }
      setHost(host);
    };
    init();
  }, []);

  React.useEffect(() => {
    if (!key) return;
    setGeminiAPIKey(key);
  }, [key]);

  React.useEffect(() => {
    if (!host) return;
    setGeminiHost(host);
  }, [host]);

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 8,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <>
      <div className="gemini">
      <div className="title text-[24px] font-bold leading-[18px] mb-[24px]">
        {"Gemini API Key"}
      </div>

        <div className="flex flex-row">
          <div className="min-w-[60%] bg-white rounded-[10px] p-[24px] h-full">
            <div className="">
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Your Gemini API key"
                addonBefore={"API key"}
              />
            </div>
            <div className="mt-[18px]">
              <Input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder={GeminiDefaultHost}
                addonBefore={"API host"}
              />
            </div>
            <div className="">
              <Button
                style={{ padding: "0px 30px" }}
                type="primary"
                className="mt-[18px]"
                icon={<ExportOutlined />}
                onClick={() => {
                  window.open("https://makersuite.google.com/app/apikey")
                }}
              >
                {t("setting.gemini.get")} Gemini API key
              </Button>
            </div>
          </div>

          <div className="desc  ml-[25px] w-full">
            <div className="bg-white rounded-[10px] mb-[8px] text-[16px] py-[8px] pl-[1rem]">
              Help
            </div>
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                style={{
                  background: "white"
                }}
                items={[{
                  key: '1',
                  label: t("setting.gemini.labelObtain"),
                  children: (<div>
                    <p>1. {t("setting.gemini.step1")} <a target="_blank" href="https://aistudio.google.com/app/apikey">Google AI studio</a></p>
                    <p>2. {t("setting.gemini.step2")} </p>
                    <p>3. {t("setting.gemini.step3")} </p>
                    <p>4. {t("setting.gemini.step4")} </p>
                    <p>5. {t("setting.gemini.step5")} </p>
                  </div>),
                  style: panelStyle

                }]}
            />
            <Collapse
                bordered={false}
                defaultActiveKey={['1']}
                style={{
                  background: "white"
                }}
                items={[{
                  key: '1',
                  label: t("setting.gemini.tipsLabel"),
                  children: (<div>
                    <p>1. {t("setting.gemini.tips1")}</p>
                    <p>2. {t("setting.gemini.tips2")}</p>
                  </div>),
                  style: panelStyle
                }]}
            />
          </div>

        </div>

      </div>
    </>
  )
}

export default Gemini;
