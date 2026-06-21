# 🍩 도넛 픽 (Donut Pick) - 깃허브 배포 가이드

이 프로젝트는 **GitHub Pages 배포 전용** 설정을 마친 상태입니다. 외부 프로그램 설치 없이, 웹 브라우저로 파일을 업로드하여 1분 만에 인터넷에 웹 사이트를 띄울 수 있습니다.

---

## 🚀 GitHub Pages 배포 3단계 (웹 업로드 방식)

### 1단계: GitHub에 새 저장소(Repository) 만들기
1. [GitHub 공식 홈페이지](https://github.com/)에 로그인합니다.
2. 메인 페이지 왼쪽 또는 우측 상단의 초록색 **[New]** 버튼을 누릅니다.
3. 아래 세 설정을 완료하고 **[Create repository]**를 누릅니다:
   - **Repository name**: `donut-pick`
   - **Public** 선택 (배포를 위해 필수)
   - *주의: Add a README 파일 등 추가 파일 체크박스는 모두 해제해 주세요.*

### 2단계: 프로젝트 파일 업로드하기
1. 저장소가 생성되면 첫 화면 중간에 보이는 **"uploading an existing file"** 링크를 누릅니다.
2. 내 컴퓨터의 **[donut-pick](file:///c:/Users/PC/OneDrive/문서/donut-pick)** 폴더를 엽니다.
3. 폴더 내부에 있는 다음 항목들을 모두 선택하여 깃허브 웹 브라우저 화면 안으로 끌어다 놓습니다(Drag & Drop):
   - `index.html` (메인 웹페이지)
   - `style.css` (스타일시트)
   - `app.js` (자바스크립트 로직)
   - `.nojekyll` (배포 최적화 설정 파일)
   - `images/` (도넛 이미지 폴더 전체)
4. 파일 목록이 올라가면 화면 맨 아래 초록색 **[Commit changes]** 버튼을 누릅니다. (업로드가 반영되는 데 약 20~30초 소요됩니다.)

### 3단계: Pages 활성화하여 인터넷 주소 얻기
1. 내 저장소 맨 위의 ⚙️ **Settings** 메뉴로 이동합니다.
2. 왼쪽 메뉴 탭에서 **Pages**를 클릭합니다.
3. **Build and deployment** -> **Branch** 영역에서 `None`으로 되어 있는 버튼을 클릭해 **`main`** (또는 `master`)으로 변경합니다.
4. 옆에 있는 **[Save]** 버튼을 누릅니다.
5. 1분 뒤 페이지를 새로고침하면, 상단에 **"Your site is live at https://[내-깃허브-아이디].github.io/donut-pick/"** 문구와 함께 최종 인터넷 링크가 나타납니다!

---

## ⚙️ 배포 전용 설정 특징

1. **상대 경로 적용 완비**: 이미지나 스타일시트 경로가 절대경로(예: `/images/`)가 아닌 상대경로(`images/`)로 지정되어 있어, 배포 후 주소에 하위 경로(`/donut-pick/`)가 붙어도 깨짐 없이 완벽하게 작동합니다.
2. **.nojekyll 파일 포함**: 깃허브의 Jekyll 빌드 엔진을 우회시켜, 특수 파일이 누락되는 현상을 막고 배포 속도를 2배 이상 단축시킵니다.
