import React from "react";
import "./index.css";

import "../i18n/i18n";
const { Header, Content, Sider } = Layout;
import { message, Layout, Menu, theme } from "antd";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import LogoSVG from "../components/svgs/logo";
import { UserOutlined, GoogleOutlined, TranslationOutlined } from "@ant-design/icons";

import Home from "./home";
import Gemini from "./gemini";
import Language from "./language";

import { observer } from "mobx-react-lite";
import {useTranslation} from "react-i18next";

const Admin = observer(() => {
  const { t } = useTranslation();
  const navigator = useNavigate();
  const location = useLocation();
  const menu = t("setting.menu", { returnObjects: true })

  let index = menu.findIndex((item) => item.link === location.pathname);

  const [messageApi, contextHolder] = message.useMessage();
  const { token: { colorBgContainer } } = theme.useToken();

  const getKeyIcon = (key) => {
    switch (key) {
      case "3":
        return <UserOutlined />;
      case "1":
        return <GoogleOutlined />;
      case "2":
        return <TranslationOutlined />;
      default:
        return <UserOutlined />;
    }
  }


  return (
    <div className="admin-container antd-app">
      {contextHolder}
      <Layout>
        <Sider
          style={{
            backgroundColor: colorBgContainer,
            borderRight: "1px solid #e8e8e8",
          }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="logo font-bold text-[30px] pt-[12px] mb-[10px] text-[#1d1d1d] flex flex-row items-center justify-center">
            <LogoSVG size={32} />
            <div className="pl-[1rem]">FoxAI.me</div>
          </div>
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            style={{ borderInline: "none" }}
            mode="inline"
            defaultSelectedKeys={[(index + 1).toString()]}
            onClick={(item) => {
              navigator(menu.filter((e) => e.key == item.key)[0].link);
            }}
            items={
              menu.map((item) => {
                return {
                  key: item.key,
                  icon: getKeyIcon(item.key),
                  label: item.label,
                  link: item.link,
                };
              }
              )
            }
          >
          </Menu>
        </Sider>
        <Layout>
          {/*
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="admin-header px-[16px] font-bold text-center">{menuItems[index] && menuItems[index].label}</div>
          </Header>
           */
          }
          <Content style={{ margin: "0px 96px 0" }}>
            <div style={{ padding: 24 }}>
              <Routes>
                <Route path="/" element={<Gemini />} />
                <Route path="/languages" element={<Language />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
})

export default Admin;