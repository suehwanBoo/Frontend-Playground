function App() {
  const key = import.meta.env.VITE_API_URL;
  return (
    <>
      <h1>리액트 빌드 프로세스zzzz</h1>
      {key}
      <p>리액트 프로젝트의 변경사항만 추적하나요?</p>
      <p>브랜치에서의 변경 내용</p>
    </>
  );
}

export default App;
