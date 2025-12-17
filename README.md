# Webprograming-2025-hansei
# 🌉 BRIDGE : IoT 기반 장애인 접근성 자동화 웹 서비스
모든 사용자가 기술로부터 동등한 접근성을 누리도록 지원하는 사용자 맞춤형 정보 등록이 가능한 웹서비스

## 💡 프로젝트 개요 (Overview)
**목표:** 모든 사용자가 기술로부터 동등한 접근성을 누리도록 지원. <br>

**현재 문제점**<br>
기존 키오스크는 장애인 및 고령자에게 높은 진입장벽이 됩니다. BRIDGE는 사용자의 장애 유형(시각, 지체 등)을 미리 등록하고, 해당 정보에 따라 키오스크의 UI를 최적으로 자동 변경해주기 위한 정보등록 웹사이트입니다.


## 🚀 주요 구현 기능 (Key Features)
1. 사용자 맞춤형 UI 자동 전환 <br>
**시각 장애 모드**: 고대비 테마, 텍스트 확대, 큰 글씨 제공.<br>
**청각 장애 모드**: 자막 지원, 진동 피드백, 시각 알림.<br>
**지체 장애 모드**: 높이 조절, 휠체어 접근, 큰 버튼.<br>

2. 반응형 디자인 <br>
모바일 및 태블릿 환경에서도 깨지지 않는 Grid/Flex 레이아웃 구현.

3. 로그인 정보 저장 <br>
수정된 정보를 저장.

## 🔗 핵심 링크 및 자료
자세한 기획 의도와 기능 정의, 시연은 아래 링크를 참고해 주십시오.

### 1. 📋 [상세 기획안 (GitHub Wiki)](https://github.com/stud-Limjiwon/Webprograming-2025-hansei/wiki)
* 프로젝트 배경, 문제 정의, 시스템 아키텍처, 상세 기능 정의 등 **전체 기획 문서**가 포함되어 있습니다.

### 2. 🎨 [프로토타입 (Figma Prototype)](https://www.figma.com/design/X7RrlDysDkstcRikAA0ipO/web-programming?node-id=0-1&t=zCVct50kyhQUIszu-1)
* **내용:** 사용자 설정 등록 과정, 키오스크 맞춤 모드 시연 등의 인터랙티브 흐름을 확인하실 수 있습니다.

---

## 🛠️ 프론트엔드 구현 특징

* **HTML:** WAI-ARIA 및 의미론적 마크업 준수
* **CSS:** 고대비/대형 폰트 등 접근성 테마 지원 및 반응형 디자인 적용
* **JavaScript:** 개인 설정 저장/로드 로직 및 IoT 통신(가정) 기반 UI 전환 로직 구현
---

## 📁 main 브랜치 파일 구조
```
src/
├── css/
│ ├── components.css
│ ├── global.css
│ ├── login.css
│ ├── mainpage.css
│ ├── mypage.css
├── func_hearing.html
├── func_physical.html
├── func_visual.html
├── login.html
├── mainpage_logout.html
├── mainpage.html
├── images/
├── package.json
└── README.md
```






 
