import PenguinWrapper from "./components/PenguinWrapper";
import BuyFloatBtn from "./components/BuyFloatBtn";
import WelcomeModal from "./components/WelcomeModal";

export const metadata = {
  title: "儿童英语启蒙库 — 动画片段·双语字幕·趣味学英语",
  description: "精选动画、儿童影视真实英语片段，配合双语字幕与词汇卡片。让孩子在真实语境中快乐学英语，轻松建立英语语感。",
  keywords: "儿童英语, 动画英语, 启蒙英语, 双语字幕, 少儿英语, 英语学习, 儿童英语动画",
  openGraph: {
    title: "儿童英语启蒙库",
    description: "精选动画、儿童影视真实英语片段，配合双语字幕与词汇卡片",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <style>{`
          *, *::before, *::after { -webkit-tap-highlight-color: transparent; }
          :focus-visible { outline: 2px solid rgba(99,102,241,0.5); outline-offset: 2px; }
          :focus:not(:focus-visible) { outline: none; }
          body.dark-mode {
            filter: invert(1) hue-rotate(180deg);
            background: #fff;
          }
          body.dark-mode img,
          body.dark-mode video,
          body.dark-mode iframe,
          body.dark-mode canvas {
            filter: invert(1) hue-rotate(180deg);
          }
          body.dark-mode mark {
            filter: invert(1) hue-rotate(180deg);
          }
        `}</style>
      </head>
      <body style={{ margin: 0 }}>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('dark_mode')==='1')document.body.classList.add('dark-mode')}catch(e){}` }} />
        {children}
        <PenguinWrapper />
        <BuyFloatBtn />
        <WelcomeModal />
      </body>
    </html>
  );
}
