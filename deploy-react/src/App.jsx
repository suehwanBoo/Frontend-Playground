function App() {
  const key = import.meta.env.VITE_API_URL;
  return (
    <>
      <h1>리액트 빌드 프로세스zzzz</h1>
      {key}
    </>
  );
}

export default App;
